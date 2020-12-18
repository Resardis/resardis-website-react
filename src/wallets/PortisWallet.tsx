import React from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import { AccountActions } from '../actions/walletActions'
import { setWalletInfo } from '../actions/walletActions'
import { ReactComponent as PortisLogo } from '../assets/portis_logo.svg'
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

const logOut = (portis:any, setWalletInfo:Function) => {
  portis.logout()
  setWalletInfo('portis', 'isLoggedIn', false)
  setWalletInfo('ports', 'accounts', [])
}

const PortisStatusConnected = ({ wallets, setWalletInfo }:PropsFromRedux) => {
  const portisWallet = wallets.portis

  if (portisWallet.isLoggedIn) return (
    <WalletDetails wallet={portisWallet}>
      <button className="wallet-button wallet-button-small"
        onClick={() => portisWallet.instance.showPortis()}
      >
        Open
      </button>
      <button className="wallet-button wallet-button-small"
         onClick={() => logOut(portisWallet.instance, setWalletInfo)}
      >
        Log Out
      </button>
    </WalletDetails>
  )

  return (
    <div className="wallet-enable">
      <button className="wallet-button"
        onClick={() => portisWallet.instance.showPortis()}
      >
        Log In
      </button>
    </div>
  )
}
const PortisStatus = connector(PortisStatusConnected)

interface PortisWallet {
  activeWallet: string,
  isLoggedIn: boolean,
}

const PortisWalletConnected = ({ activeWallet, isLoggedIn }:PortisWallet) => (
  <WalletContainer borderColor={ isLoggedIn ? 'green': 'red' } isPrimary={activeWallet === 'portis'} >
    <PortisLogo height="32" />
    <PortisStatus />
  </WalletContainer>
)
const PortisWallet = connect((state: RootState) => ({
  activeWallet: state.funds.activeWallet,
  isLoggedIn: state.funds.wallets.portis.isLoggedIn,
}))(PortisWalletConnected)

export default PortisWallet