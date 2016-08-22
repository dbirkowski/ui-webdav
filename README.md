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

wd.getCampaign({}, 'site from ui', 'campaign name');
```

### Sample task in Gulp

```js
const wd = require('./source/client.js');
const gulp = require('gulp');
let settings = {
    auth: 'username:password'.
    host: 'host'
};

gulp.task('dl', () => {
    let customer = 'customer',
        campaign = 'campaign';

    wd.getCampaign(settings, customer, campaign);
});
```

## Docs

App has only 1 method:

### getCampaign(settings, site, campaignName)

* `settings` should contain the following:

```js
let settings = {
    auth: 'username:password',
    host: 'host'
} 
```

* `site` takes a string with site name form UI
* `campaignName` takes a string with campaign name form UI