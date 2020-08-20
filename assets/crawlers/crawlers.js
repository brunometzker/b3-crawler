const { Crawler, CrawlerOptions } = require("web-crawler");
const inspector = require('my_inspector');

const getAssetCrawler = () => {
    const options = new CrawlerOptions(
        'https://www.infomoney.com.br/cotacoes/empresas-b3/',
        (companyRowSelector) => {
            const rows = Array.from(document.querySelectorAll(companyRowSelector));
            const companies = {}

            rows.forEach(row => {
                const companyName = row.children[0].textContent;
                let company = null;

                if(companies[companyName]) {
                    company = companies[companyName];
                } else {
                    company = {
                        name: companyName,
                        assets: []
                    }

                    companies[company.name] = company;
                }

                Array.from(row.children).slice(1).forEach(node => {
                    const asset = {
                        symbol: node.children[0].textContent,
                        detailsLink: node.children[0].getAttribute('href')
                    }
                    
                    company.assets.push(asset);
                });
            });

            return Object.values(companies);
        },
        ['.list-companies tbody tr']
    );

    return new Crawler(options);
};

const getAssetDetailsCrawler = (asset) => {
    const isAnAsset = (asset) => {
        return inspector.type.hasAllOwnProperties(asset, ['symbol', 'detailsLink']);
    }

    if(!isAnAsset(asset)) {
        throw new TypeError('Argument should be of type Asset');
    }

    const options = new CrawlerOptions(
        asset.detailsLink,
        (assetTypeLocator, priceLocator) => {
            const assetType = document.querySelector(assetTypeLocator) === null 
                ? null 
                : document.querySelector(assetTypeLocator).textContent;
    
            const assetPrice = document.querySelector(priceLocator) === null
                ? null
                : document.querySelector(priceLocator).textContent;
    
            return { 
                type: assetType,
                valuation: {
                    price: assetPrice
                }
            };
        },
        ['.about h3:nth-of-type(2) strong', '.line-info .value p']
    );

    return new Crawler(options);
};

module.exports.getAssetCrawler = getAssetCrawler;
module.exports.getAssetDetailsCrawler = getAssetDetailsCrawler;