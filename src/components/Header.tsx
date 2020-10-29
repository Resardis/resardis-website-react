import React from 'react'
import logo from '../assets/resardis-logo.png';
import { ReactComponent as Menu } from '../svg/menu.svg'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import { openFundsWindow, selectScreen } from '../actions'
import { OpenFundsWindowAction, SelectScreenAction } from '../constants/actionTypes'
import '../scss/Header.scss'

interface StateProps {
  isFundsWindowOpen: boolean,
  selectedScreen: string,
  isWalletEnabled: boolean,
}

interface OwnProps {
  item: {
    name: string,
    action: string,
  }
}

const mapStateToProps = (state: RootState):StateProps => ({
  isFundsWindowOpen: state.fundsWindow.isOpen,
  selectedScreen: state.selectedScreen,
  isWalletEnabled: state.funds.isWalletEnabled,
})

const mapDispatchToProps = (dispatch:any) => ({
  openFundsWindow: ():OpenFundsWindowAction => dispatch(openFundsWindow()),
  selectScreen: (screen: string):SelectScreenAction => dispatch(selectScreen(screen))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps

const headerItems = [{
  name: 'Market',
  action: 'screen'
},{
  name: 'Funds',
  action: 'screen'
},{
  name: 'Account',
  action: 'wallets'
}]

const HeaderItemConnected = ({
  item,
  isWalletEnabled,
  selectedScreen,
  openFundsWindow,
  selectScreen
}:Props) => {
  const isActive = (selectedScreen === item.name)
//todo: disable changin screen to Funds if !isWalletEnabled

  let dataToggle = ""
  let dataTarget = ""

  let className =
    isActive ? 'nav-item px-3 text-uppercase' :
    item.action !== 'null' ? 'nav-item px-3 text-uppercase' : 'nav-item header-item-disabled px-3 text-uppercase'

  if (!isWalletEnabled && item.name === 'Funds') className = 'nav-item header-item-disabled px-3 text-uppercase'
  if (item.name === 'Account') {dataToggle="modal"; dataTarget="#accountmodal"}

  return (
    <li
      className={className}
      data-toggle={dataToggle}
      data-target={dataTarget}
      onClick={() => {
        // console.log('==', isActive, isWalletEnabled, item)
        if (isActive) return
        if (item.action === 'screenOrWallet') {
          if (isWalletEnabled)
            selectScreen(item.name)
          else
            openFundsWindow()
        }
        if (item.action === 'screen') selectScreen(item.name)
        if (item.action === 'wallets') openFundsWindow()
      }}
    >
      {item.name}
    </li>
  )
}

const HeaderItem = connector(HeaderItemConnected)

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark pt-2 pb-2">
      <a className="navbar-brand py-1" href="">
        <img src={logo} height="43" alt="Resardis" /><span className="navbar-brand-name text-uppercase">Resardis</span>
      </a>
      <div className="collapse navbar-collapse font-weight-bold">
        <ul className="navbar-nav ml-auto pt-2">
          {headerItems.map(item => (
            <HeaderItem key={item.name} item={item} />
          ))}
        </ul>
      </div>
      {/* <Menu fill="#C2C3C3" width="64px" height="64px" /> */}
    </nav>
  )
}

export default Header
