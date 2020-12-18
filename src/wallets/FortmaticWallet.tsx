import React from 'react'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import '../css/Wallet.css'
import Web3 from 'web3'
import { AccountActions } from '../actions/walletActions'
import { setWalletInfo } from '../actions/walletActions'
import { ReactComponent as FortmaticLogo } from '../assets/fortmatic-horizontal-white.svg'
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

const logIn = (fm:any, setWalletInfo:Function) => {
  fm.user.login()
  .then(async () => {
    await fm.user.isLoggedIn()

    setWalletInfo('fortmatic', 'isLoggedIn', true)

    const web3 = new Web3(fm.getProvider())

    web3.eth.getAccounts((error, accounts) => {
      if (error)
        setWalletInfo('fortmatic', 'error', error)
      else
        setWalletInfo('fortmatic', 'accounts', accounts)
    })
  })
  .catch((error:any) => setWalletInfo('fortmatic', 'error', error))
}

const logOut = (fm:any, setWalletInfo:Function) => {
  fm.user.logout()
  setWalletInfo('fortmatic', 'isLoggedIn', false)
  setWalletInfo('fortmatic', 'accounts', [])
}

const FortmaticStatusConnected = ({ wallets, setWalletInfo }:PropsFromRedux) => {
  const fortmaticWallet = wallets.fortmatic

  if (fortmaticWallet.isLoggedIn) return (
    <WalletDetails wallet={fortmaticWallet}>
      <button className="wallet-button wallet-button-small"
         onClick={() => logOut(fortmaticWallet.instance, setWalletInfo)}
      >
        Log Out
      </button>
    </WalletDetails>
  )

  return (
    <div className="wallet-enable">
      <button className="wallet-button"
        onClick={() => logIn(fortmaticWallet.instance, setWalletInfo)}
      >
        Log In
      </button>
    </div>
  )
}
const FortmaticStatus = connector(FortmaticStatusConnected)

interface FortmaticWallet {
  activeWallet: string,
  isLoggedIn: boolean,
}

const FortmaticWalletConnected = ({ activeWallet, isLoggedIn }:FortmaticWallet) => (
  <WalletContainer borderColor={ isLoggedIn ? 'green': 'red' } isPrimary={activeWallet === 'fortmatic'} >
    <FortmaticLogo height="32" width="180" />
    <FortmaticStatus />
  </WalletContainer>
)
const FortmaticWallet = connect((state: RootState) => ({
  activeWallet: state.funds.activeWallet,
  isLoggedIn: state.funds.wallets.fortmatic.isLoggedIn,
}))(FortmaticWalletConnected)

export default FortmaticWallet