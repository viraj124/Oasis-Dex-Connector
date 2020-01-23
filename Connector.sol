pragma solidity ^0.5.7;


interface ERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface OTCDEX{
       function offer(
        uint pay_amt,    //maker (ask) sell how much
        ERC20 pay_gem,   //maker (ask) sell which token
        uint buy_amt,    //maker (ask) buy how much
        ERC20 buy_gem,   //maker (ask) buy which token
        uint pos         //position to insert offer, 0 should be used if unknown
    ) external returns (uint);
        
      function cancel(uint id)
        external
        returns (bool success);
        
        function buy(uint id, uint quantity)
        external
        returns (bool);
        
        function sellAllAmount(ERC20 pay_gem, uint pay_amt, ERC20 buy_gem, uint min_fill_amount)
        external
        returns (uint fill_amt);
        
        function buyAllAmount(ERC20 buy_gem, uint buy_amt, ERC20 pay_gem, uint max_fill_amount)
        external
        returns (uint fill_amt);
        
        function make(
        ERC20    pay_gem,
        ERC20    buy_gem,
        uint128  pay_amt,
        uint128  buy_amt
    )
        external
        returns (bytes32);
        
        function take(bytes32 id, uint128 maxTakeAmount)
        external;
}

contract Helper {
    /**
     * @dev get kovan address of the underlying contract
     */
    function getAddressDEX() public pure returns (address dex) {
        dex = 0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F;
        
    }
    
    /**
     * @dev get kovan address of DAI
     */
    function getAddressDAI() public pure returns (address dai) {
        dai = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
}
   
    /**
     * @dev get kovan address of WETH
     */
    function getAddressWETH() public pure returns (address weth) {
        weth = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
}
}
contract OasisDEX is Helper{
       function offer(
        uint pay_amt,    //maker (ask) sell how much
        ERC20 pay_gem,   //maker (ask) sell which token
        uint buy_amt,    //maker (ask) buy how much
        ERC20 buy_gem,   //maker (ask) buy which token
        uint pos,        //position to insert offer, 0 should be used if unknown
        uint maxAmount
    )
        external
        returns (uint) {
        ERC20(getAddressDAI()).approve(getAddressDEX(), maxAmount);

        return OTCDEX(getAddressDEX()).offer(pay_amt, pay_gem, buy_amt, buy_gem, pos);
        }
        
        function cancel(uint id)
        public
        returns (bool success) {
        return OTCDEX(getAddressDEX()).cancel(id);
        }
        
        
        function buy(uint id, uint quantity, uint maxAmount)
        external
        returns (bool){
        ERC20(getAddressWETH()).approve(getAddressDEX(), maxAmount);
        return OTCDEX(getAddressDEX()).buy(id, quantity);
        }
        
        function sellAllAmount(ERC20 pay_gem, uint pay_amt, ERC20 buy_gem, uint min_fill_amount)
        external
        returns (uint fill_amt){
        return OTCDEX(getAddressDEX()).sellAllAmount(pay_gem, pay_amt, buy_gem, min_fill_amount);
        }
        
        function buyAllAmount(ERC20 buy_gem, uint buy_amt, ERC20 pay_gem, uint max_fill_amount)
        external
        returns (uint fill_amt) {
        return OTCDEX(getAddressDEX()).buyAllAmount(buy_gem, buy_amt, pay_gem, max_fill_amount);
        }
        
        function make(
        ERC20    pay_gem,
        ERC20    buy_gem,
        uint128  pay_amt,
        uint128  buy_amt
    )
        external
        returns (bytes32) {
        return OTCDEX(getAddressDEX()).make(pay_gem, buy_gem, pay_amt, buy_amt);
        }
        
        function take(bytes32 id, uint128 maxTakeAmount)
        external{
              OTCDEX(getAddressDEX()).take(id, maxTakeAmount);
        }
}