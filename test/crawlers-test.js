const { expect } = require("chai");
const crawlers = require('../assets/crawlers/crawlers');
const { Crawler } = require("web-crawler");


describe('Crawlers Suite', () => {
    describe('getAssetCrawler', () => {
        it('should return an instance of Crawler', () => {
            expect(crawlers.getAssetCrawler()).to.be.an.instanceOf(Crawler);
        });
    });

    describe('getAssetDetailsCrawler', () => {
        it('should throw error when asset is null', () => {
            expect(() => crawlers.getAssetDetailsCrawler(null)).to.throw();
        });

        it('should throw error when asset is undefined', () => {
            expect(() => crawlers.getAssetDetailsCrawler(undefined)).to.throw();
        });

        it('should throw error when asset is not an instance of asset', () => {
            expect(() => crawlers.getAssetDetailsCrawler({ a: 'a', b: 'b' })).to.throw();
        });

        it('should return an instance of Crawler', () => {
            const asset = { symbol: 'BIDI11', detailsLink: 'https://somewebsite.com' };

            expect(crawlers.getAssetDetailsCrawler(asset)).to.be.an.instanceOf(Crawler);
        });
    });
});