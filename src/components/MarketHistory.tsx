import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import {
  TAB_MENU_FUNDS_NAME,
} from '../constants/tabData'

interface StateProps {
  activeTab: string,
  textFilter: string,
}

const mapStateToProps = (state: RootState):StateProps => ({
  activeTab: state.activeTabs[TAB_MENU_FUNDS_NAME],
  textFilter: state.funds.textFilter,
})

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const MarketHistory = ({ activeTab }:PropsFromRedux) => (
  <div>
    <div>
      <div>{activeTab}</div>
      <div style={{ minHeight: '12px' }}></div>
    </div>
  </div>
)

export default connector(MarketHistory)
