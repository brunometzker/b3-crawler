const { Crawler } = require('web-crawler');
const inspector = require('my_inspector');
const moment = require('moment');

const isACrawler = (crawler) => {
    return inspector.type.isObjectOfType(crawler, Crawler);
}

const getB3AvailableAssetsByCompany = (crawler) => {
    if(!isACrawler(crawler)) {
        throw new TypeError('Argument must be of type Crawler');
    }

    return new Promise((resolve, reject) => {
        crawler
            .crawl()
            .then(companies => {
                resolve(companies)
            })
            .catch(err => {
                reject(err)
            });
    });
};

const getAssetDetails = (crawler, asset) => {
    const isAnAsset = (asset) => {
        return inspector.type.hasAllOwnProperties(asset, ['symbol', 'detailsLink']);
    }

    if(!isACrawler(crawler) || !isAnAsset(asset)) {
        throw new TypeError('Arguments must be of type Crawler and Asset, respectively');
    }

    return new Promise((resolve, reject) => {
        crawler
            .crawl()
            .then(value => {
                asset.type = value.type;
                asset.valuation = value.valuation;
                asset.lastUpdatedAt = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
                delete asset.detailsLink;

                resolve(asset);
            })
            .catch(err => {
                reject(err)
            });
    });
};

module.exports.getB3AvailableAssetsByCompany = getB3AvailableAssetsByCompany;
module.exports.getAssetDetails = getAssetDetails;