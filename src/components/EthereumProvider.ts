import { connect, ConnectedProps } from 'react-redux'

// wallets, etc
import Portis from '@portis/web3'
import Fortmatic from 'fortmatic'
import Torus from '@toruslabs/torus-embed'

// @ts-ignore
import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import Matic from '@maticnetwork/maticjs'
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
  // make sure this is present for all who need it
  window.web3 = web3

  // @ts-ignore
  let contractAPI = new web3.eth.Contract(abiResardis, network.contract)

  store.dispatch(setContractAPI(contractAPI))

  getBalances(
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

  // 1. get accounts
  const accounts = await web3.eth.getAccounts()

  setWalletInfo('metamask', 'accounts', accounts)

  if (!accounts.length) {
    setWalletInfo('metamask', 'enabled', false)
    return
  }

  // 2. check network
  const networkID = await web3.eth.getChainId()

  if (networkID.toString() !== network.chainID) {
    console.error('Unknown network', networkID)
    setWalletInfo('metamask', 'error', `Connected to unexpected chain ${networkID.toString()}!`)
    store.dispatch(setContractAPI(null))
    store.dispatch(clearAssetsBalance())
    return
  }

  // let MM be the default, if it is installed and active
  initContractAndBalances(accounts[0], network, web3)
  setActiveWallet('metamask')
  setWalletInfo('metamask', 'error', '')
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
  console.log('Portis instance', portis)

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
  const mumbaiConfig = {
    rpcUrl: 'https://rpc-mumbai.matic.today',
    chainId: 80001,
  }

  const fm = new Fortmatic('pk_test_84A737E63CBC3C77', mumbaiConfig)
  // @ts-ignore
  const web3 = new Web3(fm.getProvider())
  console.log('Fortmatic instance', fm)

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
    buildEnv: 'production',
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

  console.log('Torus instance', torus)
}

const setUpMaticJS = (network:Network, setWalletInfo:Function) => {
  const maticProvider1 = new WalletConnectProvider({
    host: `https://rpc-mumbai.matic.today`,
    callbacks: {
      onConnect: console.log('connected'),
      onDisconnect: console.log('disconnected!')
    }
  })
  const maticProvider2 = new WalletConnectProvider({
    host: `https://goerli.infura.io/v3/75aa7935112647bc8cc49d20beafa189`,
    callbacks: {
      onConnect: console.log('connected'),
      onDisconnect: console.log('disconnected!')
    }
  })

  const matic = new Matic({
    maticProvider: new Web3(window.ethereum),
    parentProvider: new Web3(window.ethereum),
    // maticProvider: "https://rpc-mumbai.matic.today",
    // parentProvider: "https://goerli.infura.io/v3/75aa7935112647bc8cc49d20beafa189",
    rootChain: "0x2890bA17EfE978480615e330ecB65333b880928e",
    withdrawManager: "0x2923C8dD6Cdf6b2507ef91de74F1d5E0F11Eac53",
    depositManager: "0x7850ec290A2e2F40B82Ed962eaf30591bb5f5C96",
    registry: "0xeE11713Fe713b2BfF2942452517483654078154D",
  })
  // "MATIC_PROVIDER": "https://rpc-mumbai.matic.today",
  // "PARENT_PROVIDER": "https://goerli.infura.io/v3/75aa7935112647bc8cc49d20beafa189",
  // "ROOTCHAIN_ADDRESS": "0x2890bA17EfE978480615e330ecB65333b880928e",
  // "WITHDRAWMANAGER_ADDRESS": "0x2923C8dD6Cdf6b2507ef91de74F1d5E0F11Eac53",
  // "DEPOSITMANAGER_ADDRESS": "0x7850ec290A2e2F40B82Ed962eaf30591bb5f5C96",
  // "PRIVATE_KEY": "your_pvt_key", // Append 0x to your private key
  // "FROM_ADDRESS": "your address",
  // "GOERLI_ERC20": "0xb2eda8A855A4176B7f8758E0388b650BcB1828a4",
  // "MATIC_ERC20": "0xc7bb71b405ea25A9251a1ea060C2891b84BE1929",
  // "REGISTRY": "0xeE11713Fe713b2BfF2942452517483654078154D",
  // "MUMBAI_ERC721":"0xa38c6F7FEaB941160f32DA7Bbc8a4897b37876b5",
  // "GOERLI_ERC721":"0x0217B02596Dfe39385946f82Aab6A92509b7F352",
  // "MUMBAI_WETH":"0x4DfAe612aaCB5b448C12A591cD0879bFa2e51d62",
  // "GOERLI_WETH":"0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc"

  matic.initialize()

  console.warn('---setUpMaticJS', matic)
  setWalletInfo('matic', 'instance', matic)
  setWalletInfo('matic', 'web3', new Web3(window.ethereum))
}


const EthereumProvider = ({ network, setWalletInfo, setActiveWallet }: PropsFromRedux) => {
  checkMetaMask(network, setWalletInfo, setActiveWallet)
  checkPortis(network, setWalletInfo)
  checkFortmatic(network, setWalletInfo)
  checkTorus(network, setWalletInfo)
  setUpMaticJS(network, setWalletInfo)

  return null
}

export default connector(EthereumProvider)
