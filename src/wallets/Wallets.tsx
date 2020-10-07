import React from 'react'
import metaMaskLogo from '../assets/metamask.jpg';
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { BalancesType } from '../reducers/funds'

declare global {
  interface Window {
    web3:any;
    ethereum:any;
  }
}

interface StateProps {
  isWalletEnabled: boolean,
  accountAddress: string,
  assetSelected: string,
  balances: BalancesType,
}

const mapStateToProps = (state: RootState):StateProps => ({
  isWalletEnabled: state.funds.isWalletEnabled,
  accountAddress: state.funds.accountAddress,
  assetSelected: state.funds.assetSelected,
  balances: state.funds.balances,
})

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

function connectMetaMask() {
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

interface WalletContainer {
  borderColor: string,
  children: React.ReactNode,
}

const WalletContainer = ({borderColor, children}:WalletContainer) => (
  <div className="wallet-container">
    <div className={`wallet-main border-${borderColor}`}>
      {children}
    </div>
  </div>
)

const MetaMaskLogo = () => (
  <div>
    <img src={metaMaskLogo} style={{ width: '32px' }} alt="MetaMask logo" />
  </div>
)

const PleaseInstallProvider = () => (
  <WalletContainer borderColor="red">
    <div className="no-wallet">
      <p>
        No Ethereum provider found
      </p>
      <p>
        Please consider trying <a href="https://metamask.io/" style={{ color: 'inherit' }}>MetaMask</a>
      </p>
    </div>
  </WalletContainer>
)

const PleaseEnableProvider = () => (
  <WalletContainer borderColor="red">
    <MetaMaskLogo />
    <div className="wallet-enable">
      <button className="wallet-button"
        onClick={() => connectMetaMask()}
      >
        Request account access
      </button>
    </div>
  </WalletContainer>
)

const Wallets = ({
  isWalletEnabled,
  accountAddress,
  assetSelected,
  balances,
}:PropsFromRedux) => {

  if (typeof window.ethereum === 'undefined') {
    return <PleaseInstallProvider />
  }

  if (!isWalletEnabled) {
    return <PleaseEnableProvider />
  }

  return (
    <WalletContainer borderColor="green">
      <MetaMaskLogo />
      <div className="wallet-data">
        <div className="wallet-account">{accountAddress}</div>
        <div className="wallet-balance">{assetSelected} {balances[assetSelected].balance}</div>
      </div>
    </WalletContainer>
  )
}

export default connector(Wallets)
