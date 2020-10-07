import React from 'react'
import { TabbedNav } from './shared'
import {
  TAB_MENU_FUNDS,
  TAB_MENU_FUNDS_NAME,
  TAB_FUNDS_ASSETS,
  TAB_FUNDS_TRANSFER,
  TAB_FUNDS_MARKET_HISTORY,
} from '../constants/tabData'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { Assets, Transfer, MarketHistory } from './'

interface StateProps {
  activeTab: string,
}

const mapStateToProps = (state: RootState):StateProps => ({
  activeTab: state.activeTabs[TAB_MENU_FUNDS_NAME]
})

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const Funds = ({ activeTab }:PropsFromRedux) => (
  <div className="funds main-tab main-tab-funds">
    <TabbedNav items={TAB_MENU_FUNDS} tabbedNavigationName={TAB_MENU_FUNDS_NAME} />
    {activeTab === TAB_FUNDS_ASSETS && (
      <Assets />
    )}
     {activeTab === TAB_FUNDS_TRANSFER && (
      <Transfer />
    )}
    {activeTab === TAB_FUNDS_MARKET_HISTORY && (
      <MarketHistory />
    )}
  </div>
)

export default connector(Funds)
