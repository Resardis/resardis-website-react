import React from 'react'
import { TabbedNav } from './shared'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import {
  TAB_MENU_SELECTEDMARKET,
  TAB_MENU_SELECTEDMARKET_NAME,
  TAB_SELECTEDMARKET_ORDERS,
  TAB_SELECTEDMARKET_DEPTH,
  TAB_SELECTEDMARKET_HISTORY,
} from '../constants/tabData'
import { Markets, OrdersData } from '../reducers/markets'
import Orders from './SelectedMarketOrders'
import History from './SelectedMarketHistory'
import '../css/SelectedMarket.css'

interface StateProps {
  activeTab: string,
  orders: OrdersData,
  baseCurrency: string,
  quoteCurrency: string,
  selectedCurrencyPair: string,
}

const getSelectedMarketData = (markets:Markets):OrdersData => {
  return markets.ordersData
}

const mapStateToProps = (state: RootState):StateProps => {
  const activeTab = state.activeTabs[TAB_MENU_SELECTEDMARKET_NAME]

  if (!state.markets.selectedCurrencyPair) return {
    activeTab,
    orders: [],
    selectedCurrencyPair: '',
    baseCurrency: '',
    quoteCurrency: ''
  }

  const [ baseCurrency, quoteCurrency ] = state.markets.selectedCurrencyPair.split('/')

  return {
    activeTab,
    orders: getSelectedMarketData(state.markets),
    selectedCurrencyPair: state.markets.selectedCurrencyPair,
    baseCurrency,
    quoteCurrency,
  }
}

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface DepthProps {
  orders: OrdersData,
}
const Depth = ({ orders }:DepthProps) => (
  <div className="container">
    <div className="container-inner-box">
    </div>
  </div>
)

const ContentConnected = ({ activeTab, orders, baseCurrency, selectedCurrencyPair, quoteCurrency }:PropsFromRedux) => {
  switch (activeTab) {
    case TAB_SELECTEDMARKET_ORDERS:
      return <Orders
        selectedCurrencyPair={selectedCurrencyPair}
        baseCurrency={baseCurrency}
        quoteCurrency={quoteCurrency}
      />
    case TAB_SELECTEDMARKET_DEPTH:
      return <Depth orders={orders} />
    case TAB_SELECTEDMARKET_HISTORY:
      return <History selectedCurrencyPair={selectedCurrencyPair} />
    default:
      return null
  }
}

const Content = connector(ContentConnected)

const SelectedMarket = () => (
  <div className="selected-market main-tab">
    <TabbedNav items={TAB_MENU_SELECTEDMARKET} tabbedNavigationName={TAB_MENU_SELECTEDMARKET_NAME} />
    <Content />
  </div>
)

export default connect()(SelectedMarket)
