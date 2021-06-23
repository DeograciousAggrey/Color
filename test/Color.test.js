const { assert } = require("chai");

const Color = artifacts.require("Color");

contract ('Color',(accounts) => {
    let contract;  

    before (async () =>{
        contract = await Color.deployed();
    });

    describe('deployment', async () => {
        it('deploys succesfully', async () => {
           
            const address = contract.address;
            assert.notEqual(address, '');    
        });

        it ('has a name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Color', "The name of the contract should be correct");
        });

        it('has a symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol,'COLOR', "Symbol should be correct");
        });

    });

    describe('minting a new token', async() => {
        it('creates a new token', async() => {
            const result = await contract.mint('#E8HUE9');
            //SUCCESS
            console.log(result);
        });
    });

});