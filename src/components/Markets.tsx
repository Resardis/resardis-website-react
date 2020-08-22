import React from 'react'
import { TabbedNav } from './shared'
import { TAB_MENU_MARKETS, TAB_MENU_MARKETS_NAME } from '../constants/tabData'
import MarketsData from './MarketsData'

const Markets = () => (
  <div className="markets main-tab">
    <TabbedNav items={TAB_MENU_MARKETS} tabbedNavigationName={TAB_MENU_MARKETS_NAME} />
    <div className="container">
      <div className="container container-inner" style={{ marginTop: '6px' }}>
        <MarketsData />
        <div style={{ minHeight: '12px' }}></div>
      </div>
    </div>
  </div>
)

export default (Markets)
