import React, { Component } from 'react';
import Web3 from 'web3';
import Market from '../abis/Market.json';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: ''
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({
        account: accounts[0]
    })

      //MatchingMarket Kovan Address
      const contractAddress = '0x4a6bc4e803c62081ffebcc8d227b5a87a58f1f8f';
      const contract = web3.eth.Contract(Market.abi, contractAddress)

    //NOTE
    //0xd0A1E359811322d97991E03f863a0C30C2cF029C -> WETH KOVAN
    //0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa -> DAI KOVAN 
    const abi = {"constant":false,"inputs":[{"name":"pay_amt","type":"uint256"},{"name":"pay_gem","type":"address"},{"name":"buy_amt","type":"uint256"},{"name":"buy_gem","type":"address"},{"name":"pos","type":"uint256"},{"name":"maxAmount","type":"uint256"}],"name":"offer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
    
    const args = [
      "100000000000000",
      "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
      "100000000000",
      "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
      0,
      "10000000000000000000000000000000000000"
    ]

    const sellAllAbi = {"constant":false,"inputs":[{"name":"pay_gem","type":"address"},{"name":"pay_amt","type":"uint256"},{"name":"buy_gem","type":"address"},{"name":"min_fill_amount","type":"uint256"}],"name":"sellAllAmount","outputs":[{"name":"fill_amt","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
    const selAllargs = [
      "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
      "100000000000",
      "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
      "1000"
    ]

    const buyAllAbi = {"constant":false,"inputs":[{"name":"buy_gem","type":"address"},{"name":"buy_amt","type":"uint256"},{"name":"pay_gem","type":"address"},{"name":"max_fill_amount","type":"uint256"}],"name":"buyAllAmount","outputs":[{"name":"fill_amt","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
    const buyAllArgs = [
      "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
      "1000000000000",
      "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
      "1000000000000000"
    ]

    const buyAbi = {"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"maxAmount","type":"uint256"}],"name":"buy","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}

    const buyArgs = [
      4223,
      "100000000",
      "100000000000000000000"
    ]

    const cancelAbi = {"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancel","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}

    const cancelArgs = [
      4221
    ]
    var data = await web3.eth.abi.encodeFunctionCall(abi, args)
    console.log(data)

    var sellAllData = await web3.eth.abi.encodeFunctionCall(sellAllAbi, selAllargs)
    console.log(sellAllData)

    var buyAllData = await web3.eth.abi.encodeFunctionCall(buyAllAbi, buyAllArgs)
    console.log(buyAllData)

    var buyData = await web3.eth.abi.encodeFunctionCall(buyAbi, buyArgs)
    console.log(buyData)

    var cancelData = await web3.eth.abi.encodeFunctionCall(cancelAbi, cancelArgs)
    console.log(cancelData)

    //Get User Functions Using Sample Values for now
    console.log("IS_ACTIVE " + await contract.methods.isActive(34).call()); //To check if theat offer is active or not

    console.log("GET_OWNER " + await contract.methods.getOwner(402).call()); //get owner

    console.log("GET_OFFER " + JSON.stringify(await contract.methods.getOffer(4220).call())); //get offer

    console.log("IS_CLOSED " + await contract.methods.isClosed().call()); //check of market is closed

    console.log("GET_BEST_OFFER " + await contract.methods.getBestOffer("0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa").call()); //get best offer for a token pair

    console.log("GET_MIN_SELL_FOR_OFFER " + await contract.methods.getMinSell("0xd0A1E359811322d97991E03f863a0C30C2cF029C").call()); //get min selling price set for a particular token
    
    console.log("GET_WORST_OFFER " + await contract.methods.getWorseOffer(4210).call()); //get worst offer

    console.log("GET_BETTER_OFFER " + await contract.methods.getBetterOffer(4223).call()); //get better offer

    console.log("GET_OFFER_COUNT " + await contract.methods.getOfferCount("0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa").call()); //get offer count

    console.log("GET_FIRST_UNSORTED_OFFER " + await contract.methods.getFirstUnsortedOffer().call()); 

    console.log("GET_NEXT_SORTED_OFFER " + await contract.methods.getNextUnsortedOffer(1).call());

    console.log("GET_BUY_AMOUNT " + await contract.methods.getBuyAmount("0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa", "10000000000").call()); //get buy amount for a token pair

    console.log("GET_PAY_AMOUNT " + await contract.methods.getPayAmount("0xd0A1E359811322d97991E03f863a0C30C2cF029C", "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa", "10000000000").call()); //get pay amount for a token pair
}

  render() {
    return (
      <div>
       Oasis Dex Connector
      </div>
    );
  }
}

export default App;
