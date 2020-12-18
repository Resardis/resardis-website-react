import React, { ReactNode } from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import { BalancesType, Wallet } from '../reducers/funds'
import { AccountActions } from '../actions/walletActions'
import { setActiveWallet } from '../actions/walletActions'
import { Network } from '../constants/networks'

import MetaMaskWallet from './MetaMaskWallet'
import PortisWallet from './PortisWallet'
import FortmaticWallet from './FortmaticWallet'
import TorusWallet from './TorusWallet'

import { initContractAndBalances } from '../components/EthereumProvider'

declare global {
  interface Window {
    web3:any;
    ethereum:any;
  }
}

interface StateProps {
  activeWallet: string,
  accountAddress: string,
  wallets: any,
  assetSelected: string,
  balances: BalancesType,
  network: Network,
}

const mapStateToProps = (state: RootState):StateProps => ({
  activeWallet: state.funds.activeWallet,
  accountAddress: state.funds.accountAddress,
  wallets: state.funds.wallets,
  assetSelected: state.funds.assetSelected,
  balances: state.funds.balances,
  network: state.contract.network,
})

const mapDispatchToProps = (dispatch:any) => ({
  setActiveWallet: (wallet:string):AccountActions => dispatch(setActiveWallet(wallet)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface OwnProps {
  wallet: Wallet,
  children?: React.ReactNode,
}

type Props = PropsFromRedux & OwnProps


interface WalletContainer {
  borderColor: string,
  isPrimary: boolean,
  children: React.ReactNode,
}

export const WalletContainer = ({borderColor, isPrimary, children}:WalletContainer) => (
  <div className={'wallet-container' + (isPrimary ? ' wallet-primary' : '')}>
    <div className={`wallet-main border-${borderColor}`}>
      {children}
    </div>
  </div>
)

export const WalletDetailsConnected = ({ activeWallet, setActiveWallet, wallet, children, balances, assetSelected, network }:Props) => {
  return (
    <div className="wallet-data" style={{ flexGrow: 1 }}>
      <div className="wallet-account">{wallet.account}</div>
      <div className="wallet-balance">{assetSelected} {balances[assetSelected].balance}</div>

      <div style={{ textAlign: 'right' }}>
        {activeWallet === wallet.name ? (
          <span>Active wallet</span>
        ) : (
          <button className="wallet-button wallet-button-small"
            onClick={() => {
              initContractAndBalances(wallet.account, network, wallet.web3)
              setActiveWallet(wallet.name)
            }}
          >
            Make wallet active
          </button>
        )}

        {children}
      </div>
    </div>
  )
}

export const WalletDetails = connector(WalletDetailsConnected)

const Wallets = () => (
  <div>
    <MetaMaskWallet />
    <PortisWallet />
    <FortmaticWallet />
    <TorusWallet />
  </div>
)

export default Wallets
