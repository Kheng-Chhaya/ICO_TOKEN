pragma solidity 0.6.7;

contract ICOToken
{
	address payable owner = payable(msg.sender);
	uint256 public tokenSold;
	uint256 public tokenPrice;
	token20 token20Contract;
	event Sell(address indexed _buyer,uint256 _tokenbuy);
	event Send(address indexed _owner);
	constructor(address _token20Address,uint256 _tokenPrice) public
	{
		tokenPrice = _tokenPrice;
	    token20Contract = token20(_token20Address);
	}
	modifier onlyOwner
	{
		require(msg.sender == owner,"you are not owner");
		_;
	}
	function setNewToken20(address _newtoken20) external onlyOwner
	{
		token20Contract = token20(_newtoken20);
	}
	function mul(uint256 a, uint256 b) internal pure returns (uint256)
    {
        if (a == 0)
        {
            return 0;
        }
  		uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
		return c;
    }

	function BuyToken(uint256 _tokenbuy) public payable
	{
		require(msg.value == mul(_tokenbuy,tokenPrice),"need enough value");
		require(token20Contract.balanceOf(address(this))>= _tokenbuy,"not enough token");
		tokenSold += _tokenbuy;
      	emit Sell(msg.sender,_tokenbuy);
	}
	function transferMoneyTo() public onlyOwner
	{
		if(token20Contract.balanceOf(address(this)) > 0)
		{
		require(token20Contract.transfer(owner,token20Contract.balanceOf(address(this))),"need to transfer the left token");
	    }
	    owner.transfer(address(this).balance);
        Send(msg.sender);
	    
	}



}

abstract contract token20
{
	mapping(address => uint) public balanceOf;
	uint public totalSupply;
	function transfer(address _to,uint _value) public virtual returns(bool success);
}