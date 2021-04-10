import React from 'react';

import 'antd/dist/antd.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import WalletConnectProvider from "@walletconnect/web3-provider";

import Navbar from './components/Navbar/Navbar';

import ConnectModal from './components/Modals/WalletConnect';

import WalletLink from 'walletlink'

import Home from './pages/Home';

const ethers = require('ethers');

const walletLink = new WalletLink({
  appName: "Finpound",
  appLogoUrl: "https://app.compound.finance/images/compound-logo.svg",
  darkMode: false
})

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      signer: null,
      connecting: false,
      address: '',
      connected: false
    };
    this.connect = this.connect.bind(this);
    this.cancel = this.cancel.bind(this);
    this.open = this.open.bind(this);
    this.metamask = this.metamask.bind(this);
    this.walletconnect = this.walletconnect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.coinbase = this.coinbase.bind(this);
  }

  componentDidMount = () => {

  }

  open = () => {
    this.setState({
      modal: true,
    });
  }

  cancel = () => {
    this.setState({
      modal: false,
      connecting: false,
    });
  }

  connect = (type) => {
    this.setState({
      connecting: true,
    });
    if (type === 'metamask'){
      this.metamask();
    }
    else if (type === 'walletconnect'){
      this.walletconnect();
    }
    else if (type === 'coinbase'){
      this.coinbase();
    }
  }

  disconnect = () => {
    this.setState({
      connected: false,
      connecting: false,
      address: '',
    });
    localStorage.clear();
    walletLink.disconnect();
  }

  metamask = async () => {
    try {
      if (window.ethereum !== undefined) {
			 let provider = new ethers.providers.Web3Provider(window.ethereum);
       await window.ethereum.enable();
       const address = await provider.listAccounts();
			//  let network = await provider.getNetwork();
       let signer = await provider.getSigner();
       this.setState({
         address : address[0],
         signer : signer,
         connected : true,
         modal : false,
       })
      }
    } catch (e) {
      // Error Logs
    }
  }

  walletconnect = async () => {
    try{
      const web3Provider = new WalletConnectProvider({
        infuraId: "857fdaf932a740ffbe04a50c51aaee8e", // Required
      });
			await web3Provider.enable()
			.catch(e=>{
        // Connection Error Handler
        this.setState({
          connecting: false,
        })
				console.log(e)
			})
			const provider = new ethers.providers.Web3Provider(web3Provider);
			const address = await provider.listAccounts();
			const signer = provider.getSigner();
			this.setState({
        address: address[0],
        signer: signer,
        connected: true,
        connecting: false,
        modal: false
      });
		}
		catch(e){
			console.log(e)
		}
  }

  coinbase = async () => {
    try {
      const web3Provider = walletLink.makeWeb3Provider("https://mainnet.infura.io/v3/857fdaf932a740ffbe04a50c51aaee8e", 1);
      await web3Provider.enable()
			.catch(e=>{
        // Connection Error Handler
        this.setState({
          connecting: false,
          connected: false
        })
				console.log(e)
        return;
			})
      const provider = new ethers.providers.Web3Provider(web3Provider);
			const address = await provider.listAccounts();
			const signer = provider.getSigner(); 
      if(address.length > 0){
			this.setState({
        address: address[0],
        signer: signer,
        connected: true,
        connecting: false,
        modal: false
      });
     }
    } catch (e) {
      // Handle Error
    }
  }

  render() {
    const { modal, signer, connecting, connected, address } = this.state;
    return (
      <>
        <Navbar 
         open={this.open} 
         connected={connected} 
         address={address}
        />
        <ConnectModal
          modal={modal}
          cancel={this.cancel}
          connect={this.connect}
          connecting={connecting}
          connected={connected}
          disconnect={this.disconnect}
        />
        <BrowserRouter>
          <Switch>
            <Route path="/" render={() => (<Home signer={signer} />)} />
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}
