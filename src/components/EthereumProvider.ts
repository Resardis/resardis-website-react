import { connect, ConnectedProps } from 'react-redux'
import { setIsWalletEnabled, clearAssetsBalance } from '../actions/walletActions'
import { setContractAPI } from '../actions/contractActions'
import { AccountActions } from '../actions/walletActions'
import { ethers } from 'ethers'
import { getBalances } from '../contracts'
import { networks } from '../constants/networks'
import abiResardis from '../abi/Resardis.json'
import BigNumber from 'bignumber.js'
import { Network } from '../constants/networks'
import store from '../store'

///////////////////////////////////////////////////////////
// @ts-ignore
import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import Web3 from 'web3'

const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;
//const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs");
const config = {
  "posRootERC20": "0x655F2166b0709cd575202630952D71E2bB0d61Af",
  "posChildERC20": "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
  "posWETH": "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
  "rootChainWETH": "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc",
  "plasmaWETH": "0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62",
  "plasmaRootERC20": "0x3f152B63Ec5CA5831061B2DccFb29a874C317502",
  "plasmaChildERC20": "0x2d7882beDcbfDDce29Ba99965dd3cdF7fcB10A1e",
  "MATIC_RPC": "https://rpc-mumbai.matic.today",
  "ETHEREUM_RPC": "https://goerli.infura.io/v3/541999c8adbc4c3594d03a6b7b71eda6",
  "VERSION": "mumbai",
  "NETWORK": "testnet",
  "MATIC_CHAINID": 80001,
  "ETHEREUM_CHAINID": 5
}
//////////////////////////////////////////////////////////

declare global {
  interface Window {
    web3:any;
    ethereum:any;
  }
}

const mapDispatchToProps = (dispatch:any) => ({
  setIsWalletEnabled: (to:boolean):AccountActions => dispatch(setIsWalletEnabled(to)),
})

const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const connectMetaMask = () => {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .catch((err:any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.')
      } else {
        console.error(err)
      }
    })
}

const initEthConnection = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  let account
  try {
    account = await provider.getSigner().getAddress()
  }
  catch(err) {
    console.log('No account[0]', err)
    return
  }

  const networkData = await provider.getNetwork()
  const networkID = networkData.chainId.toString()

  if (!(networkID in networks)) {
    console.error('Unknown network', networkID)
    store.dispatch(setContractAPI(null, ))
    store.dispatch(clearAssetsBalance())
    return
  }

  const network:Network = networks[networkID]

  //let contractAPI = new ethers.Contract(network.contract, abiResardis, provider.getSigner())


//////////////////////////////////////////////////
  window.web3 = new Web3(window.ethereum)
  const maticProvider = new WalletConnectProvider(
    {
      host: `https://rpc-mumbai.matic.today`,
      callbacks: {
        onConnect: console.log('connected'),
        onDisconnect: console.log('disconnected!')
      }
    }
  )
  const maticWeb3 = new Web3(maticProvider)

//  let contractAPI = new maticWeb3.eth.Contract(abiResardis, network.contract)
  let contractAPI = new window.web3.eth.Contract(abiResardis, network.contract)

//   contractAPI.events.allEvents({
//     fromBlock: 0
//   }, (error:any, event:string) => {
//     console.log(event)
//   })
//   .on("connected", (subscriptionId:any) => { console.log('subscribed to events', subscriptionId) })
//   .on('data', function(event) {
//     console.log(event); // same results as the optional callback above
//   })
//   .on('changed', (event) => {
//     // remove event from local database
//   })
//   .on('error', (error, receipt) => {
//     // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
//     console.log('error', error, receipt)
//   })

// // event output example
// > {
//     returnValues: {
//         myIndexedParam: 20,
//         myOtherIndexedParam: '0x123456789...',
//         myNonIndexParam: 'My String'
//     },
//     raw: {
//         data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
//         topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
//     },
//     event: 'MyEvent',
//     signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
//     logIndex: 0,
//     transactionIndex: 0,
//     transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
//     blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
//     blockNumber: 1234,
//     address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
// }
// //////////////////////////////////////////////////


  store.dispatch(setContractAPI(contractAPI, network))

  getBalances(
    provider,
    contractAPI,
    account,
    network,
  )
}

const EthereumProvider = ({ setIsWalletEnabled }: PropsFromRedux) => {

  if (typeof window.ethereum === 'undefined') {
    setIsWalletEnabled(false)
    return null
  }

  connectMetaMask()

  window.ethereum.on('accountsChanged', (accounts:Array<string>) => {
    initEthConnection()
  })

  window.ethereum.on('chainChanged', (chainId:number) => {
    const i = new BigNumber(chainId).toString()
    console.log('chain changed', chainId.toString(), i)

    initEthConnection()
  })

  initEthConnection()

  return null
}

export default connector(EthereumProvider)
