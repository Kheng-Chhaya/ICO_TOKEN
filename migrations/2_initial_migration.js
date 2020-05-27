const token20 = artifacts.require("Token20.sol");
const ICOToken = artifacts.require("ICOToken.sol");

module.exports = function(deployer) {
	var instance;
  deployer.deploy(token20,100000).then((ins)=>{
    instance = ins;
    var tokenPrice = 1000000000000000;
  	return deployer.deploy(ICOToken,instance.address,tokenPrice);

  })
};
