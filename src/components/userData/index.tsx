import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../reducers'
import {
  TAB_USERDATA,
  TAB_MENU_USERDATA_NAME,
  TAB_USERDATA_OPEN_ORDERS,
  TAB_USERDATA_ORDER_HISTORY,
  TAB_USERDATA_FUNDS,
  TAB_USERDATA_TRADE_HISTORY,
} from '../../constants/tabData'
import { ReactComponent as CalendarIcon } from '../../svg/calendar_today.svg'
import { updateTextFilter } from '../../actions'
import { SearchBox } from '../shared'
import { sortingDirections, sortingTypes } from '../../constants/actionTypes'
import { BigNumber } from 'bignumber.js'
import { MyOrdersListType } from '../../constants/actionTypes'

import Funds from './Funds'
import OpenOrders from './OpenOrders'
import OrderHistory from './OrderHistory'
import TradeHistory from './TradeHistory'
import shortid from 'shortid'

type HeaderItemType = {
  display: string | React.ReactNode,
  sortable: sortingTypes,
}

type Headers = Array<HeaderItemType>

type HeadersAll = {
  [key:string]: Headers
}

interface StateProps {
  activeTab: string,
  textFilter: string,
  headers: Headers,
  isWalletEnabled: boolean,
}

let headersAll:HeadersAll

export type ActiveOffers = {
  [key:string]: boolean,
}

const mapStateToProps = (state: RootState):StateProps => ({
  activeTab: state.activeTabs[TAB_MENU_USERDATA_NAME],
  textFilter: state.userData.textFilter,
  headers: headersAll[state.activeTabs[TAB_MENU_USERDATA_NAME]],
  isWalletEnabled: state.funds.isWalletEnabled,
})

const mapDispatchToProps = (dispatch:any) => ({
  updateTextFilter: (target:string, textFilter:string) => dispatch(updateTextFilter(target, textFilter)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

export const Loading = () => (
  <tr>
    <td>
      <span>Loading...</span>
    </td>
  </tr>
)

export const Error = (error:any) => (
  <tr>
    <td>
      <span>Error! {error.message}</span>
    </td>
  </tr>
)

const DateHeader = () => (
  <div className="date-header">
    <CalendarIcon width="15px" height="15px" fill="#8E9091" style={{ marginRight: '4px' }} />
    Date
  </div>
)

const Cancel = () => <button className="cancel-all-button">Cancel all</button>

const Search = connector(({ textFilter, updateTextFilter }: PropsFromRedux) => (
  <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target={TAB_USERDATA} />
))

headersAll = {
  [TAB_USERDATA_OPEN_ORDERS]: [
    { display: <DateHeader />, sortable: sortingTypes.SORT_BY_DATE },
    { display: 'Pair', sortable: sortingTypes.SORT_BY_PAIR },
    { display: 'Type', sortable: sortingTypes.SORT_BY_TYPE },
    { display: 'Side', sortable: sortingTypes.SORT_BY_SIDE },
    { display: 'Price', sortable: sortingTypes.SORT_BY_PRICE },
    { display: 'Amount', sortable: sortingTypes.SORT_BY_AMOUNT },
    { display: 'Filled', sortable: sortingTypes.SORT_BY_FILLED },
    { display: 'Total', sortable: sortingTypes.SORT_BY_TOTAL },
    { display: <Cancel />, sortable: sortingTypes.NO_SORT },
  ],
  [TAB_USERDATA_FUNDS]: [
    { display: <Search />, sortable: sortingTypes.NO_SORT },
    { display: 'Available', sortable: sortingTypes.SORT_BY_AVAILABLE },
    { display: 'In Order', sortable: sortingTypes.SORT_BY_BALANCE_IN_USE },
    { display: 'Total', sortable: sortingTypes.SORT_BY_TOTAL },
  ],
  [TAB_USERDATA_ORDER_HISTORY]: [
    { display: 'Date', sortable: sortingTypes.SORT_BY_DATE },
    { display: 'Pair', sortable: sortingTypes.SORT_BY_PAIR },
    { display: 'Type', sortable: sortingTypes.SORT_BY_TYPE },
    { display: 'Side', sortable: sortingTypes.SORT_BY_SIDE },
    { display: 'Average', sortable: sortingTypes.SORT_BY_AVERAGE },
    { display: 'Price', sortable: sortingTypes.SORT_BY_PRICE },
    { display: 'Executed', sortable: sortingTypes.SORT_BY_EXECUTED },
    { display: 'Amount', sortable: sortingTypes.SORT_BY_AMOUNT },
    { display: 'Status', sortable: sortingTypes.SORT_BY_STATUS },
  ],
  [TAB_USERDATA_TRADE_HISTORY]: [
    { display: 'Date', sortable: sortingTypes.SORT_BY_DATE },
    { display: <Search />, sortable: sortingTypes.NO_SORT },
    { display: 'Type', sortable: sortingTypes.SORT_BY_TYPE },
    { display: 'Side', sortable: sortingTypes.SORT_BY_SIDE },
    { display: 'Average', sortable: sortingTypes.SORT_BY_AVERAGE },
    { display: 'Price', sortable: sortingTypes.SORT_BY_PRICE },
    { display: 'Amount', sortable: sortingTypes.SORT_BY_AMOUNT },
    { display: 'Fee', sortable: sortingTypes.SORT_BY_FEE },
  ],
}

export const sortAndFilter = (
  data:MyOrdersListType,
  textFilter:string,
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
  activeOffers: ActiveOffers,
  showOrders: string,
) => {
  const runSortBy = (data:MyOrdersListType, keys:Array<string>) => {
    const [ plus, minus ] = sortDirection === sortingDirections.SORT_ASC ? [ 1, -1 ] : [ -1, 1 ]

    switch(sortBy) {
      case sortingTypes.SORT_BY_DATE:
        return keys.sort((a, b) => (data[a].timestamp > data[b].timestamp) ? plus : minus)
      case sortingTypes.SORT_BY_TYPE:
        return keys.sort((a, b) => (data[a].type > data[b].type) ? plus : minus)
      case sortingTypes.SORT_BY_SIDE:
        return keys.sort((a, b) => (data[a].side > data[b].side) ? plus : minus)
      case sortingTypes.SORT_BY_PRICE:
        return keys.sort((a, b) => new BigNumber(data[a].price).gt(new BigNumber(data[b].price)) ? plus : minus)
      case sortingTypes.SORT_BY_AMOUNT:
        return keys.sort((a, b) => new BigNumber(data[a].amount).gt(new BigNumber(data[b].amount)) ? plus : minus)
      case sortingTypes.SORT_BY_FILLED:
        return keys.sort((a, b) => new BigNumber(data[a].filled).gt(new BigNumber(data[b].filled)) ? plus : minus)
      case sortingTypes.SORT_BY_AVERAGE:
        return keys.sort((a, b) => new BigNumber(data[a].average).gt(new BigNumber(data[b].average)) ? plus : minus)
      case sortingTypes.SORT_BY_TOTAL:
        return keys.sort((a, b) => new BigNumber(data[a].total).gt(new BigNumber(data[b].total)) ? plus : minus)

      default: return keys
    }
  }

  const runTextFilter = (data:MyOrdersListType, keys:Array<string>) => {
    if (!textFilter) return(keys)

    return keys.filter(key =>
      data[key].pair.toUpperCase().includes(textFilter.toUpperCase())
    )
  }

  const runActiveFilter = (data:MyOrdersListType) => {
    const keys = Object.keys(data)

    if (showOrders === 'active') return keys.filter((id:string) => (id in activeOffers && activeOffers[id]))
    if (showOrders === 'closed') return keys.filter((id:string) => (id in activeOffers && !activeOffers[id]))

    return keys
  }

  return runSortBy(data, runTextFilter(data, runActiveFilter(data)))
}

const NoWallet = () => {
  const buttonId = shortid()

  if (typeof window.ethereum === 'undefined') return (
    <div className="no-wallet-info">
      <p>No wallet found</p>
      <p>Please consider trying <a href="https://metamask.io/" style={{ color: '#FBB03B' }}>MetaMask</a>?</p>
    </div>
  )

  return (
    <div className="no-wallet-info">
      <p>Wallet found, but it seems to be locked?</p>
      <p><button className="enable-wallet-button" id={buttonId} onClick={() => {

        const buttonElement = document.getElementById(buttonId)

        window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => window.location.reload(true))
        .catch((err:any) => {
          if (err.code === 4001) {
            if (buttonElement) buttonElement.innerHTML = 'Request denied?'
          } else {
            if (buttonElement) buttonElement.innerHTML = 'Error occurred:' + err.message
          }
        })
      }
      }>
        Enable wallet
      </button></p>
    </div>
  )

}

const Table = ({ headers, activeTab, isWalletEnabled }:PropsFromRedux) => {
  const [ sortBy, setSortby ] = useState(sortingTypes.SORT_BY_NAME)
  const [ sortDirection, setSortDirection ] = useState(sortingDirections.SORT_ASC)

  const flipSortDirection = () => {
    setSortDirection(sortDirection === sortingDirections.SORT_DESC ?
      sortingDirections.SORT_ASC : sortingDirections.SORT_DESC
      )
    }


  if (!isWalletEnabled) return (
    <NoWallet />
  )

  return (
  <>
    <table className="user-data-table">
      <thead>
        <tr>
          {headers.map((header:HeaderItemType) => (
            <th
              key={shortid()}
              onClick={() => {
                if (sortBy === header.sortable) {
                  console.log('flip')
                 flipSortDirection()
                } else {
                  console.log(header.sortable)
                  setSortby(header.sortable)
                }
              }}
            >
              {header.display}
            </th>
          ))}
        </tr>
      </thead>
    </table>
    <div className="container-scroll">
      <table className="user-data-table">
        <tbody>
          {activeTab === TAB_USERDATA_OPEN_ORDERS ?
            <OpenOrders sortBy={sortBy} sortDirection={sortDirection} />
          : activeTab === TAB_USERDATA_ORDER_HISTORY ?
            <OrderHistory sortBy={sortBy} sortDirection={sortDirection} />
          : activeTab === TAB_USERDATA_FUNDS ?
            <Funds sortBy={sortBy} sortDirection={sortDirection} />
          :
            <TradeHistory sortBy={sortBy} sortDirection={sortDirection} />
          }
        </tbody>
      </table>
    </div>
  </>
)}

export default connector((props:PropsFromRedux) => (
  <Table {...props } />
))

