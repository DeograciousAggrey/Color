const { assert } = require("chai");
const { showCompletionScript } = require("yargs");

require('chai').use(require('chai-as-promised')).should();

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
            //console.log(result);
            const event = result.logs[0].args;
            assert.equal(event.tokenId,1,"Id should be correct");

            //FAILURE
            await contract.mint('#E8HUE9').should.be.rejected;

        });
    });

    describe('indexing', async() => {
        it('lists colors', async() => {
            //Mint 3 new tokens
            await contract.mint('#TH8DJ5');
            await contract.mint('#DVN347');
            await contract.mint('#000000');
            let Supply = await contract.colors.length;
            console.log(Supply);

            let color ;
            let result = [];
    
            for(var i = 0; i <= totalSupply; i++) {
                color = await contract.colors[i-1];
                result.push(color);
            };
            
            let expectedResult = ['#E8HUE9','#TH8DJ5','#DVN347','#000000'];
            assert.equal(result.join(','),expectedResult.join(','), " Total Supply Should be correct");
        });
    });
    
   describe ('Total Supply', async() => {
       it('Shows the total supply', async()=> {
           let expectedTotal = 1;
           let supply = await contract.colors.length ;
          console.log(supply);
            assert.equal(expectedTotal, result, 'The total supply should be correct');
       });
   });
    

});