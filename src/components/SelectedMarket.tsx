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
import Orders from './SelectedMarketOrders'
import Depth from './SelectedMarketDepth'
import History from './SelectedMarketHistory'
import '../scss/SelectedMarket.scss'
import { Network } from '../constants/networks'

interface StateProps {
  activeTab: string,
  selectedCurrencyPair: string,
  network: Network,
}

const mapStateToProps = (state: RootState):StateProps => {
  const activeTab = state.activeTabs[TAB_MENU_SELECTEDMARKET_NAME]

  if (!state.markets.selectedCurrencyPair) return {
    activeTab,
    selectedCurrencyPair: '',
    network: state.contract.network,
  }

  return {
    activeTab,
    selectedCurrencyPair: state.markets.selectedCurrencyPair,
    network: state.contract.network,
  }
}

const mapDispatchToProps = (dispatch:any) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const ContentConnected = ({ activeTab, selectedCurrencyPair, network }:PropsFromRedux) => {
  switch (activeTab) {
    case TAB_SELECTEDMARKET_ORDERS:
      return <Orders
        selectedCurrencyPair={selectedCurrencyPair}
        network={network}
      />
    case TAB_SELECTEDMARKET_DEPTH:
      return <Depth
        selectedCurrencyPair={selectedCurrencyPair}
        network={network}
      />
    case TAB_SELECTEDMARKET_HISTORY:
      return <History
        selectedCurrencyPair={selectedCurrencyPair}
        network={network}
      />
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
