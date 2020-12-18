import React from 'react'
import logo from '../assets/resardis-logo.png';
import { RootState } from '../reducers'
import { connect, ConnectedProps } from 'react-redux'
import { openFundsWindow, selectScreen } from '../actions'
import { OpenFundsWindowAction, SelectScreenAction } from '../constants/actionTypes'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import ListGroup from 'react-bootstrap/ListGroup'
import '../scss/Header.scss'

interface StateProps {
  isFundsWindowOpen: boolean,
  selectedScreen: string,
  activeWallet: string,
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
  activeWallet: state.funds.activeWallet,
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
  activeWallet,
  selectedScreen,
  openFundsWindow,
  selectScreen
}:Props) => {
  const isActive = (selectedScreen === item.name)
  //todo: disable changin screen to Funds if !isWalletEnabled

  let className =
    isActive ? 'nav-item px-3 text-uppercase' :
    item.action !== 'null' ? 'nav-item px-3 text-uppercase' : 'nav-item header-item-disabled px-3 text-uppercase'

  if (!activeWallet && item.name === 'Funds') className = 'nav-item header-item-disabled px-3 text-uppercase'

  return (
  <ListGroup.Item
    as="li"
    className={className}
    onClick={() => {
      // console.log('==', isActive, isWalletEnabled, item)
      if (isActive) return
      if (item.action === 'screenOrWallet') {
        if (activeWallet)
          selectScreen(item.name)
        else
          openFundsWindow()
      }
      if (item.action === 'screen') selectScreen(item.name)
      if (item.action === 'wallets') openFundsWindow()
    }}
  >
    {item.name}
  </ListGroup.Item>
  )
}

const HeaderItem = connector(HeaderItemConnected)

const Header = () => {
  return (
  <Navbar expand="md" variant="dark" bg="dark">
    <Container fluid>
      <Navbar.Brand href="https://www.resardis.com/">
        <img src={logo} height="43" alt="Resardis" />
        <span className="navbar-brand-name text-uppercase">Resardis</span>
      </Navbar.Brand>
      <Navbar.Toggle as="button" aria-controls="navbar-toggler" />
      <Navbar.Collapse id="navbar-toggler" className="font-weight-bold">
        <ListGroup as="ul" className="navbar-nav ml-auto pt-2">
          {headerItems.map(item => (
            <HeaderItem key={item.name} item={item} />
          ))}
        </ListGroup>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default Header
