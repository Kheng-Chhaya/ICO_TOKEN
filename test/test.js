const token20 = artifacts.require("Token20.sol");
const ICOToken = artifacts.require("ICOToken.sol");

contract("ICOToken",(accounts)=>{
	var tokenPrice = 1000000000000000;
	it("testing the properties of ICOToken",()=>{
		var ICOInstance;
		return ICOToken.deployed().then((ins)=>{
			ICOInstance = ins;
			return ICOInstance.address;
		}).then((address)=>{
			assert.notEqual(address,0,"The ICOToken address is 0");
			return ICOInstance.tokenPrice();
		}).then((tokenPrice)=>{
			assert.equal(tokenPrice.toNumber(),1000000000000000,"Not equal 10000000000000000");
			return token20.deployed();
		}).then(async(ins)=>{
			assert.notEqual(ins.address,0,"why token20 address is 0");
			try 
			{
				await ICOInstance.setNewToken20(ins.address,{from:accounts[3]});
			}
			catch(error)
			{
				var er = error.message.search("you are not owner")>=0;
				assert.ok(er,"It is not see er");
			}
		})

	});

	it("testing buytoken function",()=>{
		var ICOInstance;
		return ICOToken.deployed().then((ins)=>{
			ICOInstance = ins;
			return ICOInstance.address;
		}).then(async(add)=>{
			assert.notEqual(add,0,"why it is equal 0 ICOToken address");
			try
			{
				await ICOInstance.BuyToken(12,{from:accounts[8],value:1});
			}
			catch(error)
			{
				var er = error.message.search("need enough value")>=0;
				assert.ok(er,"er is not true");
			}

		})
	});

	it("transfer token from accounts 0 to this contract",()=>{
		var token20Instance;
		var ICOInstance;
		return token20.deployed().then((ins)=>{
			token20Instance = ins;
			return token20Instance.address;
		}).then(function(address){
			assert.notEqual(address,0,"token address is 0");
			return ICOToken.deployed();
		}).then(function(ins){
			ICOInstance = ins;
			return ICOInstance.address;
		}).then(function(address){
			assert.notEqual(address,0,"ICOToken is 0");
			return token20Instance.transfer(ICOInstance.address,10000,{from:accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"transfer event triggered");
			assert.equal(receipt.logs[0].event,"Transfer","You be Transfer event");
			assert.equal(receipt.logs[0].args._sender,accounts[0],"the sender is first account");
			assert.equal(receipt.logs[0].args._receiver,ICOInstance.address,"should to the ICOInstance address");
			assert.equal(receipt.logs[0].args._value,10000,"should be 10000");
            return token20Instance.balanceOf(ICOInstance.address);
		}).then(async(balance)=>{
			assert.equal(balance.toNumber(),10000,"not equal 10000");
			try 
			{
				 
				await ICOInstance.BuyToken(20000,{from:accounts[3],value:20000*1000000000000000});

			}
			catch(error)
			{
			      var err = error.message.search('not enough token')>=0;
			      assert.ok(err,"err is should be true");

			}
			return ICOInstance.BuyToken(2000,{from:accounts[6],value:2000*1000000000000000});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"Sell should be triggered");
			assert.equal(receipt.logs[0].event,"Sell","should be equal to Sell");
			assert.equal(receipt.logs[0].args._buyer,accounts[6],"shoud be accounts[6]");
			assert.equal(receipt.logs[0].args._tokenbuy,2000,"should be 1000 token buy");
		})
	});

	it("test the transferMoneyToken",()=>{
		var ICOInstance;
		var token20Instance;
		return ICOToken.deployed().then(function(ins){
			ICOInstance = ins;
			return ICOInstance.address;
		}).then(async function(address){
			assert.notEqual(address,0,"why it is 0");
			try
			{
				await ICOInstance.transferMoneyTo({from:accounts[4]});
			}
			catch(error)
			{
				var err = error.message.search('you are not owner');
				assert.ok(err,"err need be true ");

			}
		})
	});

	it("testing transferMoneyTo ",()=>{
		var ICOInstance;
		var token20Instance;
		return ICOToken.deployed().then((ins)=>{
			ICOInstance = ins;
			return token20.deployed();
		}).then((ins)=>{
			token20Instance = ins;
			return token20Instance.address;
		}).then((address)=>{
			assert.notEqual(address,0,"token20Instance address 0");
			return ICOInstance.address;
		}).then((address)=>{
			assert.notEqual(address,0,"ICOInstance address is 0");
			return web3.eth.getBalance(ICOInstance.address);
		}).then((balance)=>{
			console.log(balance, ": then contract balance before sent");
			return ICOInstance.transferMoneyTo({from:accounts[0]});
		}).then((tx)=>{
			assert.equal(tx.logs.length,1,"Send is triggered");
			assert.equal(tx.logs[0].event,"Send","should be send event");
			assert.equal(tx.logs[0].args._owner,accounts[0],"should be accounts[0]");
			return web3.eth.getBalance(ICOInstance.address);
		}).then((balance)=>{
			console.log(balance, ": balance sent already");
			return token20Instance.balanceOf(ICOInstance.address);
		}).then((tokenleft)=>{
			assert.equal(tokenleft,0,"token left should be sent");
		})

	});

	

	
})