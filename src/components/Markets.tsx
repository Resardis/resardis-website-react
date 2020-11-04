import React from 'react'
import { TabbedNav } from './shared'
import { TAB_MENU_MARKETS, TAB_MENU_MARKETS_NAME } from '../constants/tabData'
import MarketsData from './MarketsData'
import '../scss/Markets.scss'

const Markets = () => (
  <div className="markets main-tab">
    <TabbedNav items={TAB_MENU_MARKETS} tabbedNavigationName={TAB_MENU_MARKETS_NAME} />
    <MarketsData />
  </div>
)

export default (Markets)
