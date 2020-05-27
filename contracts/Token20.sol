pragma solidity 0.6.7;

contract Token20
{
    string public name = "Token20";
    string public symbol = "TK20";
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address=>mapping(address=>uint)) public allowance;
    constructor(uint _totalSupply) public
    {
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = totalSupply;
    }
    event Approval(address indexed _owner,address indexed _spender,uint _value);
    event Transfer(address indexed _sender,address indexed _receiver,uint _value);
    function transfer(address _to,uint _value) public returns(bool success)
    {
        require(_value <= balanceOf[msg.sender]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender,_to,_value);
        return true;    
    }
    function approve(address _spender,uint _value) public returns(bool success)
    {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender,_spender,_value);
        
        return true;
    }
    function transferFrom(address _owner,address _to,uint _value) public returns(bool success)
    {
        require(_value <= balanceOf[_owner]);
        require(_value <= allowance[_owner][msg.sender]);
        balanceOf[_owner] -= _value;
        balanceOf[_to] += _value;
        allowance[_owner][msg.sender] -= _value;
        Transfer(_owner,_to,_value);
        
        return true;
          
    }
}