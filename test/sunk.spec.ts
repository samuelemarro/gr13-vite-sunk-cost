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
});