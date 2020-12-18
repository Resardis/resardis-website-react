import React from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import Web3 from 'web3'
import { AccountActions, setWalletInfo } from '../actions/walletActions'
import metaMaskLogo from '../assets/metamask.jpg'
import { WalletContainer, WalletDetails } from '.'

interface StateProps {
  wallets: any,
}

const mapStateToProps = (state: RootState):StateProps => ({
  wallets: state.funds.wallets,
})

const mapDispatchToProps = (dispatch:any) => ({
  setWalletInfo: (walletName:string, property:string, value:any):AccountActions => dispatch(setWalletInfo(walletName, property, value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

function connectMetaMask(setWalletInfo:Function) {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(async () => {
      const web3 = new Web3(window.ethereum)
      setWalletInfo('metamask', 'enabled', true)
      const accounts = await web3.eth.getAccounts()
      setWalletInfo('metamask', 'accounts', accounts)
      if (accounts.length) setWalletInfo('metamask', 'account', accounts[0])
    })
    .catch((err:any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.')
      } else {
        console.error(err)
      }
    })
}

const MetaMaskLogo = () => (
  <div>
    <img src={metaMaskLogo} style={{ width: '32px' }} alt="MetaMask logo" />
  </div>
)

const MetaMaskStatusConnected = ({ wallets, setWalletInfo }:PropsFromRedux) => {
  const metamaskWallet = wallets.metamask

  if (!metamaskWallet.present) return (
    <div className="no-wallet">
    <p>
      <a href="https://metamask.io/" style={{ color: 'inherit' }}>MetaMask</a> not found
    </p>
  </div>
  )
  if (!wallets.metamask.enabled) return (
    <div className="wallet-enable">
      <button className="wallet-button"
        onClick={() => connectMetaMask(setWalletInfo)}
      >
        Request account access
      </button>
    </div>
  )
  return (
    <WalletDetails wallet={metamaskWallet} />
  )
}
const MetaMaskStatus = connector(MetaMaskStatusConnected)

interface MetaMaskWallet {
  activeWallet: string,
  isLoggedIn: boolean,
}

const MetaMaskWalletConnected = ({ activeWallet, isLoggedIn }:MetaMaskWallet) => (
  <WalletContainer borderColor={ isLoggedIn ? 'green': 'red' } isPrimary={activeWallet === 'metamask'}>
    <MetaMaskLogo />
    <MetaMaskStatus />
  </WalletContainer>
)
const MetaMaskWallet = connect((state: RootState) => ({
  activeWallet: state.funds.activeWallet,
  isLoggedIn: state.funds.wallets.metamask.enabled,
}))(MetaMaskWalletConnected)

export default MetaMaskWallet
