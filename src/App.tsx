import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from './reducers'
import './App.css'
import {
  FundsWindow,
  Funds,
  Graph,
  Header,
  Markets,
  OrderForm,
  SelectedMarket,
  UserData,
} from './components'
import { openFundsWindow } from './actions'
import { OpenFundsWindowAction } from './constants/actionTypes'
//import { ethers } from 'ethers'
// import Web3 from 'web3';
import { BigNumber } from 'bignumber.js'

// @ts-ignore
// import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
// const config = {
//   "posRootERC20": "0x655F2166b0709cd575202630952D71E2bB0d61Af",
//   "posChildERC20": "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
//   "posWETH": "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
//   "rootChainWETH": "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc",
//   "plasmaWETH": "0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62",
//   "plasmaRootERC20": "0x3f152B63Ec5CA5831061B2DccFb29a874C317502",
//   "plasmaChildERC20": "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e",
//   "MATIC_RPC": "https://rpc-mumbai.matic.today",
//   "ETHEREUM_RPC": "https://goerli.infura.io/v3/541999c8adbc4c3594d03a6b7b71eda6",
//   "VERSION": "mumbai",
//   "NETWORK": "testnet",
//   "MATIC_CHAINID": 80001,
//   "ETHEREUM_CHAINID": 5
// }
// const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;
// const Network = require("@maticnetwork/meta/network");
// const Matic = require("@maticnetwork/maticjs");

// matic
//   .balanceOfERC20('0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283', '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
//   { from: '0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283' })
//   .then(balance => {
//     console.log('---!---balance', balance)
//   })
// )
// .catch(e => console.log(e.message))

interface StateProps {
  selectedScreen: string,
  isWalletEnabled: boolean,
}

const mapStateToProps = (state: RootState): StateProps => ({
  selectedScreen: state.selectedScreen,
  isWalletEnabled: state.funds.isWalletEnabled,
})

const mapDispatchToProps = (dispatch:any) => ({
  openFundsWindow: ():OpenFundsWindowAction => dispatch(openFundsWindow()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const App = ({ selectedScreen, isWalletEnabled, openFundsWindow }: PropsFromRedux) => {
//   const [Networkid, setNetworkid] = useState(0);
//   const [account, setAccount] = useState("0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283");
//   const [loading, setLoading] = useState(true);
//   const [inputValue, setInputValue] = useState("");
//   const [burnHash, setBurnHash] = useState("");
//   const [maticProvider, setMaticProvider] = useState();
//   const [ethereumprovider, setEthereumProvider] = useState();


//   useEffect(() => {
//     loadWeb3();
//     loadBlockchainData();
//   }, []);


// const loadWeb3 = async () => {
//   if (window.ethereum) {
//     window.web3 = new Web3(window.ethereum);
//     await window.ethereum.enable();
//   } else if (window.web3) {
//     window.web3 = new Web3(window.web3.currentProvider);
//   } else {
//     window.alert(
//       "Non-Ethereum browser detected. You should consider trying MetaMask!"
//     );
//   }
// };

// const loadBlockchainData = async () => {
//   setLoading(true);
//   const maticProvider = new WalletConnectProvider({
//     host: config.MATIC_RPC,
//     callbacks: {
//       onConnect: console.log("matic connected"),
//       onDisconnect: console.log("matic disconnected!"),
//     },
//   });

//   const ethereumProvider = new WalletConnectProvider({
//     host: config.ETHEREUM_RPC,
//     callbacks: {
//       onConnect: console.log("mainchain connected"),
//       onDisconnect: console.log("mainchain disconnected"),
//     },
//   });

//   setMaticProvider(maticProvider);
//   setEthereumProvider(ethereumProvider);
//   const web3 = window.web3;

//   const accounts = await web3.eth.getAccounts();
//   setAccount(accounts[0]);
//   const networkId = await web3.eth.net.getId();

//   setNetworkid(networkId);

//   if (networkId === config.ETHEREUM_CHAINID) {
//     setLoading(false);
//   } else if (networkId === config.MATIC_CHAINID) {
//     setLoading(false);
//   } else {
//     window.alert(" switch to  Matic or Ethereum network");
//   }

//   posClientParent(maticProvider)

// };


// const posClientParent = (maticProvider:any) => {
//   const maticPoSClient = new MaticPoSClient({
//     network: config.NETWORK,
//     version: config.VERSION,
//     //maticProvider: maticProvider,
//     //parentProvider: window.web3,
//     maticProvider: window.web3,
//     parentDefaultOptions: { from: account },
//     maticDefaultOptions: { from: account },
//   });


//   // matic
//   maticPoSClient.balanceOfERC20(
//     '0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283',
//     '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
//     {
//       from: '0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283'
//     }
//   )
//   .then((balance:any) => {
//     console.log('---!---balance', balance)
//   })
//   .catch((e:any) => console.log(e.message))


//   // const amount = new BigNumber(30000000000000000)

//   // maticPoSClient.transferERC20Tokens(
//   //   '0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e',
//   //   '0xdf3786659dc64e343fFED27eD213Ed6138834B19',
//   //   3000000000000000,
//   //   {
//   //     from: '0xA586B76cbb1F4a7850c137275A6D5ffC5c9A5283',
//   //     parent: false,
//   //   })
//   //   .then((res:any) => {
//   //     console.log("Transfer hash: ", res.transactionHash);
//   //   })
//   // .catch((e:any) => console.log(e.message))


//   return maticPoSClient;
// };


  //if (!isWalletEnabled) openFundsWindow()

  return (
    <div className="main-grid">
      <FundsWindow />
      <Header />

      {selectedScreen === 'Funds' ? (
        <Funds />
        ) : (
        <>
          <SelectedMarket />
          <Graph />
          <OrderForm />
          <UserData />
          <Markets/>
        </>
      )}

    </div>
  )
}

export default connector(App)
