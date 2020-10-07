import React from 'react'
import logo from '../assets/resardis-logo.png';
import { ReactComponent as Menu } from '../svg/menu.svg'
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import { openFundsWindow, selectScreen } from '../actions'
import { OpenFundsWindowAction, SelectScreenAction } from '../constants/actionTypes'
import '../css/Header.css'

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
},{
  name: 'News',
  action: 'null'
},{
  name: 'Help',
  action: 'null'
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

  let className =
    isActive ? 'header-item-active' :
    item.action !== 'null' ? 'header-item' : 'header-item-disabled'

  if (!isWalletEnabled && item.name === 'Funds') className = 'header-item-disabled'

  return (
    <li
      className={className}
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
    <div className="header">
      <img className="logo" src={logo} alt="Resardis" />
      <ul className="top-nav">
        {headerItems.map(item => (
          <HeaderItem key={item.name} item={item} />
        ))}
      </ul>
      <Menu fill="#C2C3C3" width="64px" height="64px" />
    </div>
  )
}

export default Header
