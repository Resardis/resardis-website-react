import React from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import { BalancesType, Wallet } from '../reducers/funds'
import { AccountActions } from '../actions/walletActions'
import { setActiveWallet } from '../actions/walletActions'
import { Network } from '../constants/networks'
import { wei2ether } from '../helpers'

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

const showBalance = (wallet:any, accountAddress:string, balances:BalancesType, assetSelected:string) => {
  if (wallet.account !== accountAddress) {
    return 'activate wallet to see balance'
  }

  if (!(assetSelected in balances)) {
    console.error('WalletDetailsConnected: showBalance: no assetSelected in balances', assetSelected, balances)
    return null
  }

  if (!('sidechain' in balances[assetSelected])) {
    console.error('WalletDetailsConnected: showBalance: no sidechain in balances[assetSelected]', assetSelected, balances)
    return null
  }

  return `${wei2ether(balances[assetSelected].sidechain, 10)} ${assetSelected}`
}

export const WalletDetailsConnected = ({ activeWallet, setActiveWallet, wallet, children, balances, assetSelected, network, accountAddress }:Props) => {
  // console.log('===',accountAddress, wallet, assetSelected, balances, balances[assetSelected])
  return (
    <div className="wallet-data" style={{ flexGrow: 1 }}>
      {wallet.error && (
        <div className="wallet-error">{wallet.error}</div>
      )}
      <div className="wallet-account">{wallet.account}</div>
      <div className="wallet-balance">
        {showBalance(wallet, accountAddress, balances,assetSelected)}
      </div>

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
