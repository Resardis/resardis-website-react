import { connect, ConnectedProps } from 'react-redux'

// wallets, etc
import Portis from '@portis/web3'
import Fortmatic from 'fortmatic'
import Torus from '@toruslabs/torus-embed'
//import WalletConnectProvider from '@maticnetwork/walletconnect-provider'

// @ts-ignore
import Web3 from 'web3'
import { RootState } from '../reducers'
import { setActiveWallet, setWalletInfo, clearAssetsBalance } from '../actions/walletActions'
import { setContractAPI } from '../actions/contractActions'
import { AccountActions } from '../actions/walletActions'
import { getBalances } from '../contracts'
import abiResardis from '../abi/Resardis.json'
import BigNumber from 'bignumber.js'
import { Network } from '../constants/networks'
import store from '../store'

declare global {
  interface Window {
    ethereum:any;
  }
}

interface StateProps {
  network: Network,
  //wallets: any,
}

const mapStateToProps = (state: RootState):StateProps => ({
  network: state.contract.network,
  //wallets: state.funds.wallets,
})

const mapDispatchToProps = (dispatch:any) => ({
  setActiveWallet: (wallet:string):AccountActions => dispatch(setActiveWallet(wallet)),
  setWalletInfo: (walletName:string, property:string, value:any):AccountActions => dispatch(setWalletInfo(walletName, property, value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

export const initContractAndBalances = (accountAddress:string, network:Network, web3:any) => {
  // @ts-ignore
  let contractAPI = new web3.eth.Contract(abiResardis, network.contract)

  store.dispatch(setContractAPI(contractAPI))

  getBalances(
    web3,
    contractAPI,
    accountAddress,
    network,
  )
}

const initMetaMask = async (network:Network, setWalletInfo:Function, setActiveWallet:Function) => {
  const web3 = new Web3(window.ethereum)

  setWalletInfo('metamask', 'instance', window.ethereum)
  setWalletInfo('metamask', 'web3', web3)

  // is the page connected?
  const permissions = await window.ethereum.request({ method: 'wallet_getPermissions' })

  if (permissions.length) {
    setWalletInfo('metamask', 'enabled', true)
  } else {
    setWalletInfo('metamask', 'enabled', false)
    return
  }

  // 1. check network
  const networkID = await web3.eth.getChainId()

  if (networkID.toString() !== network.chainID) {
    console.error('Unknown network', networkID)
    store.dispatch(setContractAPI(null))
    store.dispatch(clearAssetsBalance())
    return
  }

  // 2. get accounts
  const accounts = await web3.eth.getAccounts()

  setWalletInfo('metamask', 'accounts', accounts)

  if (!accounts.length) {
    setWalletInfo('metamask', 'enabled', false)
    return
  }

  // let MM be the default, if it is installed and active
  initContractAndBalances(accounts[0], network, web3)
  setActiveWallet('metamask')
}

  // const maticProvider = new WalletConnectProvider(
  //   {
  //     host: `https://rpc-mumbai.matic.today`,
  //     callbacks: {
  //       onConnect: console.log('connected'),
  //       onDisconnect: console.log('disconnected!')
  //     }
  //   }
  // )
//  const maticWeb3 = new Web3(maticProvider)

  //let contractAPI = new ethers.Contract(network.contract, abiResardis, provider.getSigner())
//  let contractAPI = new maticWeb3.eth.Contract(abiResardis, network.contract)
//  let contractAPI = new window.web3.eth.Contract(abiResardis, network.contract)


interface PortisIsLoggedIn {
  error:any,
  result: any,
}

const checkPortis = async (network:Network, setWalletInfo:Function) => {
  const portis = new Portis('c4949813-1449-467b-871d-9dd9ce6bd5f6', 'maticMumbai')
  const web3 = new Web3(portis.provider)

  setWalletInfo('portis', 'instance', portis)
  setWalletInfo('portis', 'web3', web3)

  // portis.onLogin((walletAddress, email, reputation) => {
  portis.onLogin((walletAddress) => {
    setWalletInfo('portis', 'isLoggedIn', true)
    setWalletInfo('portis', 'account', walletAddress)
    web3.eth.getAccounts((error, accounts) => {
      if (error)
        setWalletInfo('portis', 'error', error)
      else
        setWalletInfo('portis', 'accounts', accounts)
    })
  })

  portis.onLogout(() => {
    setWalletInfo('portis', 'isLoggedIn', false)
    setWalletInfo('portis', 'accounts', [])
  })

  portis.onActiveWalletChanged((walletAddress) => {
    setWalletInfo('portis', 'account', walletAddress)
  })

  portis.onError((error) => {
    setWalletInfo('portis', 'error', error)
  })

  portis.isLoggedIn().then(({ error, result }:PortisIsLoggedIn) => {
    if (error)
      setWalletInfo('portis', 'error', error)
    else
      setWalletInfo('portis', 'isLoggedIn', result)

    if (result) {
      web3.eth.getAccounts((error, accounts) => {
        if (error)
          setWalletInfo('portis', 'error', error)
        else
          setWalletInfo('portis', 'accounts', accounts)
      })
    }
  })
}
//network, wallets, setWalletInfo, setActiveWallet
const checkMetaMask = async (network:Network, setWalletInfo:Function, setActiveWallet:Function) => {
  if (typeof window.ethereum === 'undefined') {
    setWalletInfo('metamask', 'present', false)
    return
  }

  setWalletInfo('metamask', 'present', true)

  window.ethereum.on('accountsChanged', (accounts:Array<string>) => {
    initMetaMask(network, setWalletInfo, setActiveWallet)
  })

  window.ethereum.on('chainChanged', (chainId:number) => {
    const i = new BigNumber(chainId).toString()
    console.log('chain changed', chainId.toString(), i)

    initMetaMask(network, setWalletInfo, setActiveWallet)
  })

  initMetaMask(network, setWalletInfo, setActiveWallet)
}

const checkFortmatic = async (network:Network, setWalletInfo:Function) => {
  const fm = new Fortmatic('pk_test_84A737E63CBC3C77')
 // @ts-ignore
 const web3 = new Web3(fm.getProvider())

  setWalletInfo('fortmatic', 'instance', fm)
  setWalletInfo('fortmatic', 'web3', web3)

  let isUserLoggedIn = await fm.user.isLoggedIn()

  if (!isUserLoggedIn) {
    setWalletInfo('fortmatic', 'isLoggedIn', false)
    return
  }

  setWalletInfo('fortmatic', 'isLoggedIn', true)

  web3.eth.getAccounts((error:any, accounts:Array<string>) => {
    if (error)
      setWalletInfo('fortmatic', 'error', error)
    else
      setWalletInfo('fortmatic', 'accounts', accounts)
  })
}

const checkTorus = async (network:Network, setWalletInfo:Function) => {
  const torus = new Torus({
    buttonPosition: 'bottom-right',
  })

  await torus.init({
    buildEnv: 'testing',
    network: {
      host: 'mumbai',
      chainId: 80001,
      networkName: 'Mumbai Test Network',
    },
    showTorusButton: false,
    loginConfig: {
      // 'google': {
      //   name: 'Resardis',
      //   typeOfLogin: 'google',
      //   showOnModal: true,
      // },
    },
  })

  setWalletInfo('torus', 'instance', torus)
  setWalletInfo('torus', 'web3', new Web3(torus.provider))
}

const EthereumProvider = ({ network, setWalletInfo, setActiveWallet }: PropsFromRedux) => {
  checkMetaMask(network, setWalletInfo, setActiveWallet)
  checkPortis(network, setWalletInfo)
  checkFortmatic(network, setWalletInfo)
  checkTorus(network, setWalletInfo)

  return null
}

export default connector(EthereumProvider)
