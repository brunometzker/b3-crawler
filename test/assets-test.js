const { expect, assert } = require("chai");
const sinon = require('sinon');
const assets = require('../assets/assets');
const { Crawler } = require("web-crawler");

describe('Assets Suite', () => {
    describe('getB3AvailableAssetsByCompany', () => {
        after(() => {
            sinon.restore();
        })

        it('should throw error when crawler is null', () => {
            const crawler = null;

            expect(() => assets.getB3AvailableAssetsByCompany(crawler)).to.throw();
        });

        it('should throw error when crawler is undefined', () => {
            const crawler = undefined;

            expect(() => assets.getB3AvailableAssetsByCompany(crawler)).to.throw();
        });

        it('should throw error when crawler is not an instance of Crawler', () => {
            const crawler = 'crawler';

            expect(() => assets.getB3AvailableAssetsByCompany(crawler)).to.throw();
        });

        it('should return promise when calling getB3AvailableAssetsByCompany()', () => {
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub().returns(Promise.resolve([]))
            });

            expect(assets.getB3AvailableAssetsByCompany(crawler))
                .to
                .be
                .an
                .instanceOf(Promise);
        });

        it('should resolve to an array of companies with their assets when crawling ends', () => {
            const company = {
                name: 'Banco Inter',
                assets: [
                    {
                        symbol: 'BIDI11',
                        detailsLink: 'https://somewebsite.com/BIDI11'
                    },
                    {
                        symbol: 'BIDI3',
                        detailsLink: 'https://somewebsite.com/BIDI3'
                    }
                ]
            };

            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub().returns(Promise.resolve([company]))
            });

            return assets.getB3AvailableAssetsByCompany(crawler)
                .then(companies => {
                    expect(companies)
                        .to
                        .be
                        .an
                        .instanceOf(Array)
                        .and
                        .to
                        .include(company)
                })
                .catch(err => assert.fail(`Promise should have resolved but it rejected. ${err}`));
        });

        it('should reject with an error when crawling fails', () => {
            const errorMessage = 'Error from crawl()';
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub().returns(Promise.reject(new Error(errorMessage)))
            });
            
            return assets.getB3AvailableAssetsByCompany(crawler)
                .then(companies => {
                    assert.fail(`Promise should have rejected but resolved. ${companies}`);
                })
                .catch(err => {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.be.equal(errorMessage);
                });
        });
    });

    describe('getAssetDetails', () => {
        after(() => {
            sinon.restore();
        });

        it('shoud throw error when crawler is null', () => {
            const crawler = null
            const asset = { symbol: 'BIDI11', b: 'https://somewebsite.com' };

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('shoud throw error when crawler is undefined', () => {
            const crawler = undefined
            const asset = { symbol: 'BIDI11', b: 'https://somewebsite.com' };

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('shoud throw error when crawler is not a Crawler instance', () => {
            const crawler = 'crawler'
            const asset = { symbol: 'BIDI11', b: 'https://somewebsite.com' };

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('should throw error when asset is null', () => {
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub()
            });
            const asset = null;

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('should throw error when asset is undefined', () => {
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub()
            });
            const asset = undefined;

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('should throw error when asset is not an asset instance', () => {
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub()
            });
            const asset = { symbol: 'BIDI11', b: 'https://somewebsite.com' };

            expect(() => assets.getAssetDetails(crawler, asset)).to.throw();
        });

        it('should return promise when calling getAssetDetails()', () => {
            const asset = { symbol: 'BIDI11', detailsLink: 'https://somewebsite.com' };
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub().returns(Promise.resolve({}))
            });

            expect(assets.getAssetDetails(crawler, asset))
                .to
                .be
                .an
                .instanceOf(Promise);
        });

        it('should resolve to a modified asset object when crawling ends', () => {
            const asset = { symbol: 'BIDI11', detailsLink: 'https://somewebsite.com' };
            const assetDetails = { type: 'Ações', valuation: { price: 220.10 } };
            const crawler = sinon.createStubInstance(Crawler, { 
                crawl: sinon.stub().returns(Promise.resolve(assetDetails))
            });

            return assets.getAssetDetails(crawler, asset)
                .then(value => {
                    expect(value).to.be.an('object');
                    expect(value).to.have.ownProperty('type');
                    expect(value).to.have.ownProperty('valuation');
                    expect(value).to.have.ownProperty('lastUpdatedAt');
                    expect(value).to.not.have.ownProperty('detailsLink');
                })
                .catch(err => assert.fail(`Promise should have resolved but it rejected. ${err}`));
        });

        it('should resolve to a modified asset object with an UTC last updated date when crawling ends', () => {
            const asset = { symbol: 'BIDI11', detailsLink: 'https://somewebsite.com' };
            const assetDetails = { type: 'Ações', valuation: { price: 220.10 } };
            const crawler = sinon.createStubInstance(Crawler, { 
                crawl: sinon.stub().returns(Promise.resolve(assetDetails))
            });

            return assets.getAssetDetails(crawler, asset)
                .then(value => {
                    expect(value).to.have.ownProperty('lastUpdatedAt');
                    expect(value.lastUpdatedAt).to.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
                })
                .catch(err => assert.fail(`Promise should have resolved but rejected. ${err}`));
        });

        it('should reject with an error when crawling fails', () => {
            const errorMessage = 'Error from crawl()';
            const asset = { symbol: 'BIDI11', detailsLink: 'https://somewebsite.com' };
            const crawler = sinon.createStubInstance(Crawler, {
                crawl: sinon.stub().returns(Promise.reject(new Error(errorMessage)))
            });
            
            return assets.getAssetDetails(crawler, asset)
                .then(value => {
                    assert.fail(`Promise should have rejected but resolved. ${value}`);
                })
                .catch(err => {
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.be.equal(errorMessage);
                });
        });
    });
});