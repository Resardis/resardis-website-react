import React from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import { AccountActions } from '../actions/walletActions'
import { setWalletInfo } from '../actions/walletActions'
import { ReactComponent as TorusLogo } from '../assets/torus-logo-blue.svg'
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

// TODO: setWalletInfo needs to be able to set {} of properties, not just one
const logOut = async (torusWallet:any, setWalletInfo:Function) => {
  await torusWallet.instance.cleanUp()
  setWalletInfo('torus', 'isLoggedIn', false)
  setWalletInfo('torus', 'accounts', [])
  setWalletInfo('torus', 'error', '')
}

const logIn = async (torusWallet:any, setWalletInfo:Function) => {
  torusWallet.instance.login({})
  .then((accounts:string) => {
    setWalletInfo('torus', 'isLoggedIn', true)
    setWalletInfo('torus', 'accounts', accounts)
    setWalletInfo('torus', 'error', '')
  })
  .catch((error:any) => {
    setWalletInfo('torus', 'error', 'Could not log in: ' + error)
  })
}

const TorusStatusConnected = ({ wallets, setWalletInfo }:PropsFromRedux) => {
  const torusWallet = wallets.torus

  if (torusWallet.isLoggedIn) return (
    <WalletDetails wallet={torusWallet}>
      <button className="wallet-button wallet-button-small"
        onClick={() => torusWallet.instance.showWallet()}
      >
        Open
      </button>
      <button className="wallet-button wallet-button-small"
        onClick={() => logOut(torusWallet, setWalletInfo)}
      >
        Log Out
      </button>
    </WalletDetails>
  )

  return (
    <div className="wallet-enable">
      <button className="wallet-button"
        onClick={() => logIn(torusWallet, setWalletInfo)}
      >
        Log In
      </button>
    </div>
  )
}
const TorusStatus = connector(TorusStatusConnected)

interface TorusWallet {
  activeWallet: string,
  isLoggedIn: boolean,
}

const TorusWalletConnected = ({ activeWallet, isLoggedIn }:TorusWallet) => (
  <WalletContainer borderColor={ isLoggedIn ? 'green': 'red' } isPrimary={activeWallet === 'torus'} >
    <TorusLogo height="32" />
    <TorusStatus />
  </WalletContainer>
)
const TorusWallet = connect((state: RootState) => ({
  activeWallet: state.funds.activeWallet,
  isLoggedIn: state.funds.wallets.torus.isLoggedIn,
}))(TorusWalletConnected)

export default TorusWallet