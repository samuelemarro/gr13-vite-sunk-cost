// NOTE: Queries are authomatically retried and don't fail (while calls do), so some query tests have been written as call tests.

import { describe } from "mocha";
import chai from "chai";
const vite = require('@vite/vuilder');
import chaiAsPromised from "chai-as-promised";
import config from "./vite.config.json";

chai.use(chaiAsPromised);
const expect = chai.expect;

let provider: any;
let deployer: any;
let alice: any;
let bob: any;
let contract: any;
let mnemonicCounter = 1;

const checkEvents = (result : any, correct : Array<Object>) => {
    expect(result).to.be.an('array').with.length(correct.length);
    for (let i = 0; i < correct.length; i++) {
        expect(result[i].returnValues).to.be.deep.equal(correct[i]);
    }
}

describe('test SunkCost', function () {
    beforeEach(async function () {
        provider = vite.localProvider();
        deployer = vite.newAccount(config.networks.local.mnemonic, 0);
        // init users
        alice = vite.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        bob = vite.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        await deployer.sendToken(alice.address, '0');
        await alice.receiveAll();
        await deployer.sendToken(bob.address, '0');
        await bob.receiveAll();
        // compile
        const compiledContracts = await vite.compile('SunkCost.solpp',);
        expect(compiledContracts).to.have.property('SunkCost');
        contract = compiledContracts.SunkCost;
        // deploy
        contract.setDeployer(deployer).setProvider(provider);
        await contract.deploy({params: [], responseLatency: 1});
        expect(contract.address).to.be.a('string');
    });

    describe('creator', function () {
        it('fails to query the creator of a non-existent game', async function () {
            await expect(
                contract.call('creator', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('tokenId', function () {
        it('fails to query the token ID of a non-existent game', async function () {
            await expect(
                contract.call('tokenId', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('expiration', function () {
        it('fails to query the expiration of a non-existent game', async function () {
            await expect(
                contract.call('expiration', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('maxExpiration', function () {
        it('fails to query the maximum expiration of a non-existent game', async function () {
            await expect(
                contract.call('maxExpiration', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('expired', function () {
        it('fails to query if a non-existent game is expired', async function () {
            await expect(
                contract.call('expired', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('initialBuyIn', function () {
        it('fails to query the initial buy-in of a non-existent game', async function () {
            await expect(
                contract.call('initialBuyIn', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('currentBuyIn', function () {
        it('fails to query the current buy-in of a non-existent game', async function () {
            await expect(
                contract.call('currentBuyIn', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('currentPot', function () {
        it('fails to query the current pot of a non-existent game', async function () {
            await expect(
                contract.call('currentPot', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('buyInIncrement', function () {
        it('fails to query the buy-in increment of a non-existent game', async function () {
            await expect(
                contract.call('buyInIncrement', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('burnAmount', function () {
        it('fails to query the burn amount of a non-existent game', async function () {
            await expect(
                contract.call('burnAmount', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('extension', function () {
        it('fails to query the extension of a non-existent game', async function () {
            await expect(
                contract.call('extension', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('currentWinner', function () {
        it('fails to query the current winner of a non-existent game', async function () {
            await expect(
                contract.call('currentWinner', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('claimed', function () {
        it('fails to query if a non-existent game has already been claimed', async function () {
            await expect(
                contract.call('claimed', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });

    describe('createGame', function() {
        it('creates a game', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // 1899673200 = March 14, 2030
            // 2215292400 = March 14, 2040
            await contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1899673200', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '2000'});

            // 1000000 - 2000 = 998000
            expect(await alice.balance()).to.be.deep.equal('998000');

            expect(await contract.query('numGames', [], {caller: alice})).to.be.deep.equal(['1']);

            expect(await contract.query('creator', [0], {caller: alice})).to.be.deep.equal([alice.address]);
            expect(await contract.query('exists', [0])).to.be.deep.equal(['1']);

            expect(await contract.query('tokenId', [0], {caller: alice})).to.be.deep.equal(['tti_5649544520544f4b454e6e40']);
            expect(await contract.query('expiration', [0], {caller: alice})).to.be.deep.equal(['1899673200']);
            expect(await contract.query('maxExpiration', [0], {caller: alice})).to.be.deep.equal(['2215292400']);
            expect(await contract.query('initialBuyIn', [0], {caller: alice})).to.be.deep.equal(['2000']);

            // 2000 + 100 = 2100
            expect(await contract.query('currentBuyIn', [0], {caller: alice})).to.be.deep.equal(['2100']);

            // 2000 added - 25 burned = 1975
            expect(await contract.query('currentPot', [0], {caller: alice})).to.be.deep.equal(['1975']);
            // Balance must match currentPot
            // 2000 - 25 = 1975
            expect(await contract.balance()).to.be.deep.equal('1975');

            expect(await contract.query('buyInIncrement', [0], {caller: alice})).to.be.deep.equal(['100']);
            expect(await contract.query('burnAmount', [0], {caller: alice})).to.be.deep.equal(['25']);
            expect(await contract.query('extension', [0], {caller: alice})).to.be.deep.equal(['1000']);
            expect(await contract.query('currentWinner', [0], {caller: alice})).to.be.deep.equal([alice.address]);
            expect(await contract.query('claimed', [0], {caller: alice})).to.be.deep.equal(['0']);

            const events = await contract.getPastEvents('allEvents', {fromHeight: 0, toHeight: 100});
            checkEvents(events, [
                { '0': '0', gameId: '0',
                  '1': alice.address, creator: alice.address
                } // Game created
            ]);
        });

        it('creates two games', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            await deployer.sendToken(bob.address, '1000000');
            await bob.receiveAll();

            // 1899673200 = March 14, 2030
            // 2215292400 = March 14, 2040
            await contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1899673200', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '2000'});

            expect(await contract.query('numGames', [], {caller: alice})).to.be.deep.equal(['1']);

            // 1899673201 = March 14, 2030 00:00:01
            // 2215292401 = March 14, 2040 00:00:01
            await contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1899673201', '2215292401', '4000', '200', '50', '2000'], {caller: bob, amount: '4000'});

            expect(await contract.query('numGames', [], {caller: alice})).to.be.deep.equal(['2']);

            // 1000000 - 2000 = 998000
            expect(await alice.balance()).to.be.deep.equal('998000');
            // 2000 + 4000 - 25 - 50 = 5925
            expect(await contract.balance()).to.be.deep.equal('5925');

            expect(await contract.query('creator', [0], {caller: alice})).to.be.deep.equal([alice.address]);
            expect(await contract.query('exists', [0])).to.be.deep.equal(['1']);

            expect(await contract.query('tokenId', [0], {caller: alice})).to.be.deep.equal(['tti_5649544520544f4b454e6e40']);
            expect(await contract.query('expiration', [0], {caller: alice})).to.be.deep.equal(['1899673200']);
            expect(await contract.query('maxExpiration', [0], {caller: alice})).to.be.deep.equal(['2215292400']);
            expect(await contract.query('initialBuyIn', [0], {caller: alice})).to.be.deep.equal(['2000']);

            // 2000 + 100 = 2100
            expect(await contract.query('currentBuyIn', [0], {caller: alice})).to.be.deep.equal(['2100']);

            // 2000 added - 25 burned = 1975
            expect(await contract.query('currentPot', [0], {caller: alice})).to.be.deep.equal(['1975']);
            // Balance must match currentPot

            expect(await contract.query('buyInIncrement', [0], {caller: alice})).to.be.deep.equal(['100']);
            expect(await contract.query('burnAmount', [0], {caller: alice})).to.be.deep.equal(['25']);
            expect(await contract.query('extension', [0], {caller: alice})).to.be.deep.equal(['1000']);
            expect(await contract.query('currentWinner', [0], {caller: alice})).to.be.deep.equal([alice.address]);
            expect(await contract.query('claimed', [0], {caller: alice})).to.be.deep.equal(['0']);

            // Second game

            // 1000000 - 4000 = 996000
            expect(await bob.balance()).to.be.deep.equal('996000');

            expect(await contract.query('creator', [1], {caller: bob})).to.be.deep.equal([bob.address]);
            expect(await contract.query('exists', [1])).to.be.deep.equal(['1']);

            expect(await contract.query('tokenId', [1], {caller: bob})).to.be.deep.equal(['tti_5649544520544f4b454e6e40']);
            expect(await contract.query('expiration', [1], {caller: bob})).to.be.deep.equal(['1899673201']);
            expect(await contract.query('maxExpiration', [1], {caller: bob})).to.be.deep.equal(['2215292401']);
            expect(await contract.query('initialBuyIn', [1], {caller: bob})).to.be.deep.equal(['4000']);

            // 4000 + 200 = 4200
            expect(await contract.query('currentBuyIn', [1], {caller: bob})).to.be.deep.equal(['4200']);

            // 4000 added - 50 burned = 3950
            expect(await contract.query('currentPot', [1], {caller: bob})).to.be.deep.equal(['3950']);

            expect(await contract.query('buyInIncrement', [1], {caller: bob})).to.be.deep.equal(['200']);
            expect(await contract.query('burnAmount', [1], {caller: bob})).to.be.deep.equal(['50']);
            expect(await contract.query('extension', [1], {caller: bob})).to.be.deep.equal(['2000']);
            expect(await contract.query('currentWinner', [1], {caller: bob})).to.be.deep.equal([bob.address]);
            expect(await contract.query('claimed', [1], {caller: bob})).to.be.deep.equal(['0']);

            const events = await contract.getPastEvents('allEvents', {fromHeight: 0, toHeight: 100});
            checkEvents(events, [
                { '0': '0', gameId: '0',
                  '1': alice.address, creator: alice.address
                }, // Game created by Alice
                { '0': '1', gameId: '1',
                  '1': bob.address, creator: bob.address
                } // Game created by Bob
            ]);
        });

        it('fails to overpay a createGame call', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // 1899673200 = March 14, 2030
            // 2215292400 = March 14, 2040
            expect(
                contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1899673200', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '2001'})
            ).to.eventually.be.rejectedWith('revert');
        });

        it('fails to underpay a createGame call', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // 1899673200 = March 14, 2030
            // 2215292400 = March 14, 2040
            expect(
                contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1899673200', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '1999'})
            ).to.eventually.be.rejectedWith('revert');
        });

        it('fails to pay a createGame call with the wrong token', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // 1899673200 = March 14, 2030
            // 2215292400 = March 14, 2040
            expect(
                contract.call('createGame', ['tti_5649544520544f4b454e6e41', '1899673200', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '2000'})
            ).to.eventually.be.rejectedWith('revert');
        });

        it('fails to create a game in the past', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // Timestamp starts at 0 with vuilter
            vite.utils.sleep(1000);

            // 1 = January 1, 1970 00:00:01
            // 2215292400 = March 14, 2040
            expect(
                contract.call('createGame', ['tti_5649544520544f4b454e6e40', '1', '2215292400', '2000', '100', '25', '1000'], {caller: alice, amount: '2000'})
            ).to.eventually.be.rejectedWith('revert');
        });

        it('fails to create a game with maxExpiration < expiration', async function() {
            await deployer.sendToken(alice.address, '1000000');
            await alice.receiveAll();

            // 2215292400 = March 14, 2040
            // 1899673200 = March 14, 2030
            expect(
                contract.call('createGame', ['tti_5649544520544f4b454e6e40', '2215292400', '1899673200', '2000', '100', '25', '1000'], {caller: alice, amount: '2000'})
            ).to.eventually.be.rejectedWith('revert');
        });
    });
});