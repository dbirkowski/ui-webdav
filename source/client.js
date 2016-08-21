'use strict';
const rp = require('request-promise');
const xml2js = require('xml2js');
const fs = require('fs');
const fetch = require('node-fetch');
let auth = {}, campaignSettings;

function getFullPath() {
    return `http://${auth.host}/webdav/${campaignSettings.site}/Sandbox/1-Debug/${campaignSettings.campaignName}`;
}

function downloadFiles(items, path, subFolder) {
    if (!subFolder) {
        createFolder(campaignSettings.campaignName);
    } else {
        createFolder([campaignSettings.campaignName, subFolder].join('/'));
    }
    items.forEach(el => {
        if (el.type === 'file') {
            let dlPath = [path, el.name].join('/');
            let writePath = subFolder ? [campaignSettings.campaignName, subFolder, el.name].join('/') : [campaignSettings.campaignName, el.name].join('/');

            getFile(dlPath)
                .then(data => {
                    fs.writeFile(writePath, data, err => {
                        if (err) {
                            throw err;
                        }
                    });
                    console.info('saved', writePath);
                }, err => {
                    throw err;
                });
        } else if (el.type === 'directory') {
            getCampaign(auth, [path, el.name].join('/'), el.name);
        }
    });
}

function getCampaign(auth, path, subFolder) {
    const data = `<?xml version='1.0'?>
        <propfind xmlns='DAV:' xmlns:srtns='http://www.southrivertech.com/'>
        <prop>
        <creationdate/>
        <getlastmodified/>
        <href/>
        <getcontentlength/>
        <resourcetype/>
        <collection/>
        <isreadonly/>
        <lockdiscovery/>
        <srtns:srt_modifiedtime/>
        <srtns:srt_creationtime/>
        <srtns:srt_lastaccesstime/>
        <srtns:srt_proptimestamp/>
        <ishidden/>
        </prop>
        </propfind>`;
    const headers = {
        "Authorization": "Basic " + (new Buffer(auth.username + ":" + auth.password)).toString('base64'),
        "Content-Length": data.length,
        "Depth": 0,
        "Content-Type": "text/xml",
        "Translate": "f",
        "Connection": "Keep-Alive",
        "User-Agent": "WebDrive 16.0.4348 DAV"
    };
    const options = {
        uri: path,
        method: "PROPFIND",
        body: new Buffer(data, "binary"),
        headers
    };
    return rp(options).then(body => {
        const parser = new xml2js.Parser();
        parser.parseString(body, (err, result) => {
            if (err) {
                throw err;
            } else {
                downloadFiles(parseResult(result), [path, subFolder].join('/'), subFolder);
            }
        });
    }).catch(err => {
        throw err;
    });
}

function getFile(path) {
    return fetch(path, {
            headers: {
                "Authorization": "Basic " + (new Buffer(`${auth.username}:${auth.password}`)).toString('base64'),
                "User-Agent": "WebDrive 16.0.4348 DAV"
            }
        })
        .then(handleResponseError)
        .then(res => {
            return res.text();
        });
}

function createFolder(path) {
    try {
        fs.lstatSync(path);
    } catch (err) {
        try {
            fs.mkdirSync(path);
            console.info(path + ' created.');
        } catch (err) {
            throw err;
        }
    }
}

function parseResult(result) {
    let multistatus = result['d:multistatus'] || result['D:multistatus'];
    let response = multistatus['d:response'] || multistatus['D:response'];
    let items = response.map(el => {
        let name = (el['d:href'] || el['D:href'])[0];
        let propstat = (el['d:propstat'] || el['D:propstat'])[0];
        let prop = (propstat['d:prop'] || propstat['D:prop'])[0];
        let resourcetype = (prop['d:resourcetype'] || prop['D:resourcetype']);
        let type = resourcetype && resourcetype[0] && resourcetype[0].hasOwnProperty('D:collection') ? 'directory' : 'file';
        return {
            name,
            type
        };
    });
    return items;
}

function handleResponseError(res) {
    if (res.status >= 400) {
        let err = new Error("Bad response: " + res.status);
        err.httpStatusCode = res.status;
        throw err;
    }
    return res;
}

module.exports = {
    setAuth: (username, password, env) => {
        if(!username || !password) {
            throw new Error('Please fill out your credentials');
        } else {
            auth.username = username;
            auth.password = password;
        }
        if (env === 'eu') {
            auth.host = 'ui61.maxymiser.com';
        } else if (env === 'us') {
            auth.host = 'ui61us.maxymiser.com';
        } else {
            throw new Error('Incorrect environment. Use "us" or "eu" as passed parameter.');
        }
    },
    setCampaign: (site, campaignName) => {
        campaignSettings = {
            site,
            campaignName
        };
    },
    getCampaign: () => {
        getCampaign(auth, getFullPath());
    }
};