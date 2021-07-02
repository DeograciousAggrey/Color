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

          //Get the balance of the contract
          const balance = await myContract.methods.balanceOf(accounts[0]).call()
          

          

          //Load the colors
          for (var i = 1; i< balance.toNumber(); i++) {
            const color = await myContract.methods.colors(i-1).call()
            this.setState({
              colors: [...this.state.colors, color]
            })
          }
          
    } else {
      window.alert ('Smart Contract not deployed to the detected network')
    }
  
  }

  mint = (color) =>{
    this.state.myContract.methods.mint(color).send({from: this.state.account})
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
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
                {/*Create a form with one input*/}
                <h1 className="text-center">ISSUE TOKEN</h1>
                <form className="form-inline" onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <div className="form-group">
                    <label className="sr-only" htmlFor="color">Color</label>
                    <input
                      className="form-control mb-1"
                      id="color"
                      type="text"
                      placeholder="e.g #FFFFFF"
                      ref={(input) => {this.color = input}}
                    />  
                    
                    <input 
                      className="btn btn-block btn-primary"
                      type="submit"
                      value="MINT"
                    />
                  </div>
                </form>
                  

              </div>
            </main>
          </div>
          <hr></hr>
            <div className="row text-center">
              {this.state.colors.map((color, key) => {
                return (
                  <div key={key} className= "col-md-3 mb-3">
                    <div className="token" style={{backgroundColor: color }}></div>
                      <div>{color}</div> 
                  </div>
                )
              })}
            </div>

        </div>
      </div>
    );
  }
} 

export default App;
