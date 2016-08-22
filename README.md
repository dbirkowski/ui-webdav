# ui-webdav

Downloader for campaigns.

##Usage

### Install dependencies

Clone repo to your machine and then run:

```js
npm install
```

### Download a campaign

```js
const wd = require('./source/client.js');

wd.setAuth('auth');
wd.setCampaign('site from ui', 'campaign name');
wd.getCampaign();
```

## Docs

App has only 1 method:

### getCampaign(settings, site, campaignName)

* `settings` should contain the following:

```js
let settings = {
    auth: 'username:password',
    host: 'host url'
} 
```

* `site` takes a string with site name form UI
* `campaignName` takes a string with campaign name form UI