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

wd.setAuth('username', 'password', 'env');
wd.setCampaign('site from ui', 'campaign name');
wd.getCampaign();
```

## Docs

App has only 3 methods. Here are the methods with params they take:

### setAuth(username, password, env)

Sets the credentials to successfully download a campaign.

* `username` takes a string with username from UI
* `password` takes a string with password from UI
* `env` takes a string: `us` or `eu` depending from which you want to download

### setCampaign(site, campaignName)

Sets the necessary things to successfully download a campaign.

* `site` takes a string with site name form UI
* `campaignName` takes a string with campaign name form UI

### getCampaign()

Doesn't take any parameter. After `setAuth` and `setCampaign` run it to download the campaign files.
