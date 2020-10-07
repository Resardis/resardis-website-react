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

  let contractAPI = new ethers.Contract(network.contract, abiResardis, provider.getSigner())

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
