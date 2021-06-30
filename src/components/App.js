import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3'
import Color from '../abis/Color.json'

class App extends Component {

  async componentWillMount() {
    await this.loadweb3()
    await this.loadBlockchainData()
  }

  async loadweb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser detected. You should consider trying Metamask !')
    }
  }

  //Load Blockchain Data
  async loadBlockchainData() {
    const web3 = window.web3
    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if (networkData) {
          const abi = Color.abi
          const address = networkData.address
          const myContract = new web3.eth.Contract (abi, address)
          this.setState({ myContract })

          //Get the total number of colors in the contract
          const colorCount = await myContract.methods.getColorCount().call()
        


         /* //Get colors
          for (var i= 1; i < myContract.methods.colors.length; i++) {
            const color = await myContract.methods.colors(i-1).call()
            this.setState({colors: [...this.state.colors, color]})
            console.log(myContract.methods.colors.length)
          }
         */

    } else {
      window.alert ('Smart Contract not deployed to the detected network')
    }
    


  }

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      myContract: null,
      colors: []
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-white"> <span id="account">{this.state.account}</span></small>
              </li>
            </ul>

        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {/*FORM GOES HERE */}

              </div>
            </main>
          </div>
          <hr></hr>
            <div className="row text-center">
              <p>Tokens Go here</p>
            </div>

        </div>
      </div>
    );
  }
}

export default App;
