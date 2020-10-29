import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { TAB_MENU_FUNDS_NAME } from '../constants/tabData'
import { BalancesType } from '../reducers/funds'
import { AllPairsData } from '../reducers/markets'
import { SearchBox } from './shared'
import { wei2ether } from '../helpers'
import '../css/Assets.css'
import { BigNumber } from 'bignumber.js'
import { tokenNames } from '../constants/networks'
import { selectCurrencyPair, selectScreen } from '../actions'
import { SelectScreenAction, sortingDirections, sortingTypes } from '../constants/actionTypes'

interface StateProps {
  activeTab: string,
  textFilter: string,
  totalBalanceBTC: BigNumber,
  totalBalanceUSD: Number,
  balances: BalancesType,
  marketData: AllPairsData,
}

const mapStateToProps = (state: RootState):StateProps => ({
  activeTab: state.activeTabs[TAB_MENU_FUNDS_NAME],
  textFilter: state.funds.textFilter,
  totalBalanceBTC: state.funds.totalBalanceBTC,
  totalBalanceUSD: state.funds.totalBalanceUSD,
  balances: state.funds.balances,
  marketData: state.markets.data,
})

const mapDispatchToProps = (dispatch:any) => ({
  selectScreen: (screen: string):SelectScreenAction => dispatch(selectScreen(screen)),
  selectCurrencyPair: (pair:string) => dispatch(selectCurrencyPair(pair)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const assetsHeader = [
  { name: 'Assets', sortable: sortingTypes.SORT_BY_NAME },
  { name: 'Ticker', sortable: sortingTypes.SORT_BY_TICKER },
  { name: 'Resardis Balance', sortable: sortingTypes.SORT_BY_RESARDIS_BALANCE },
  { name: 'Side Chain Balance', sortable: sortingTypes.SORT_BY_SIDECHAIN_BALANCE },
  { name: 'In Order', sortable: sortingTypes.SORT_BY_BALANCE_IN_USE },
  { name: '24h Change', sortable: sortingTypes.SORT_BY_CHANGE24 },
  { name: 'USDT', sortable: sortingTypes.SORT_BY_PRICE_USD },
  { name: 'ETH', sortable: sortingTypes.SORT_BY_PRICE_ETH },
  { name: 'Trade', sortable: sortingTypes.NO_SORT },
]


const sortAndFilter = (
  data:BalancesType,
  textFilter:string,
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
  hideEmptyBalances:boolean,
) => {

  const runSortBy = (data:BalancesType, keys:Array<string>) => {
    const [ plus, minus ] = sortDirection === sortingDirections.SORT_ASC ? [ 1, -1 ] : [ -1, 1 ]

    switch(sortBy) {
      case sortingTypes.SORT_BY_NAME:
        return keys.sort((a, b) => tokenNames[a] > tokenNames[b] ? plus : minus)
      case sortingTypes.SORT_BY_TICKER:
        return keys.sort((a, b) => a > b ? plus : minus)
      case sortingTypes.SORT_BY_RESARDIS_BALANCE:
        return keys.sort((a, b) => data[a].resardis.gt(data[b].resardis) ? plus : minus)
      case sortingTypes.SORT_BY_SIDECHAIN_BALANCE:
        return keys.sort((a, b) => data[a].sidechain.gt(data[b].sidechain) ? plus : minus)
      case sortingTypes.SORT_BY_BALANCE_IN_USE:
        return keys.sort((a, b) => data[a].resardisInUse.gt(data[b].resardisInUse) ? plus : minus)
        default: return keys
    }
  }

  const runTextFilter = (data:BalancesType, keys:Array<string>) => {
    if (!textFilter) return(keys)

    return keys.filter(key =>
      key.toUpperCase().includes(textFilter.toUpperCase()) ||
      tokenNames[key].toUpperCase().includes(textFilter.toUpperCase())
    )
  }

  const hideEmpty = (data:BalancesType) => {
    const keys = Object.keys(data)

    if (!hideEmptyBalances) return(keys)

    return keys.filter(key =>
      data[key].resardis.gt(0) || data[key].sidechain.gt(0) || data[key].mainnet.gt(0)
    )
  }

  return runSortBy(data, runTextFilter(data, hideEmpty(data)))
}


const Assets = ({
  selectCurrencyPair,
  selectScreen,
  balances,
  totalBalanceBTC,
  totalBalanceUSD,
  marketData,
}:PropsFromRedux) => {
  const [ sortBy, setSortby ] = useState(sortingTypes.SORT_BY_NAME)
  const [ sortDirection, setSortDirection ] = useState(sortingDirections.SORT_ASC)
  const [ textFilter, setTextFilter ] = useState('')
  const [ hideEmptyBalances, setHideEmptyBalances ] = useState(false)

  const flipSortDirection = () => {
    setSortDirection(sortDirection === sortingDirections.SORT_DESC ?
      sortingDirections.SORT_ASC : sortingDirections.SORT_DESC
    )
  }
  const updateTextFilter = (target:string, value:string) => {
    setTextFilter(value)
  }
  const toggleHidingEmptyBalances = () => setHideEmptyBalances(!hideEmptyBalances)

  return (
  <div>
    <div className="row py-2 justify-content-left align-items-center assets-top-header">
        <div className="col col-md-auto">
          <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target="-" />
        </div>
        <div className="col col-md-auto">
          <div className="input-group input-group-lg assets-hide-zero">
            <div className="input-group-prepend">
              <div className="input-group-text">
                <input
                  className="mr-2 align-text-bottom"
                  type="checkbox"
                  onChange={() => toggleHidingEmptyBalances()}
                  checked={hideEmptyBalances}
                />
                <span>Hide 0 Balances</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-auto">
          <span className="assets-total">
            Total Balance: {totalBalanceUSD.toFixed()} USD / {totalBalanceBTC.toFixed()} BTC
          </span>
        </div>
    </div>
    <div className="assets-table-wrapper">
      <table className="table table-borderless table-dark table-striped table-hover table-sm">
        <thead>
          <tr>
            {assetsHeader.map(header => (
              <th
                scope="col"
                key={header.name}
                onClick={() => {
                  sortBy === header.sortable ? flipSortDirection() : setSortby(header.sortable)
                }}
              >
                {header.name}
              </th>
            )
            )}
          </tr>
        </thead>
        <tbody>
        {sortAndFilter(balances, textFilter, sortBy, sortDirection, hideEmptyBalances).map(symbol => {
            //console.log(balances[symbol])
            const tokenMarketData = marketData[`${symbol}/ETH`] ? marketData[`${symbol}/ETH`] : []
            const hasMarketData = tokenMarketData.length > 0

            return (
            <tr key={symbol}>
              <td style={{ textAlign: 'left' }}>{tokenNames[symbol]}</td>
              <td>{symbol}</td>
              <td>{wei2ether(balances[symbol].resardis)}</td>
              <td>{wei2ether(balances[symbol].sidechain)}</td>
              <td>{wei2ether(balances[symbol].resardisInUse)}</td>
              {hasMarketData ? (
                <>
                <td style={{ color: tokenMarketData[1] < 0 ? '#D5002A' : '#00AA55'}}>{tokenMarketData[1]}%</td>
                <td>?</td>
                <td>{tokenMarketData[3].toFixed(8)}</td>
                </>
              ) : (
                <>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
                </>
              )}
              <td>
                <button
                  className="btn btn-secondary btn-sm text-capitalize trade-button"
                  onClick={() => {
                    selectScreen('Market')
                    selectCurrencyPair(`${symbol}/ETH`)
                    console.log('trade', symbol)
                  }}
                >
                  trade
                </button>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  </div>

  // <div className="container">

  //   <div className="assets-top-header">
  //     <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target="-" />

  //     <div className="assets-hide-zero">
  //       <input
  //         type="checkbox"
  //         onChange={() => toggleHidingEmptyBalances()}
  //         checked={hideEmptyBalances}
  //       />
  //       Hide 0 Balances
  //     </div>
  //     <div className="assets-total">
  //       Total Balance: {totalBalanceUSD.toFixed()} USD / {totalBalanceBTC.toFixed()} BTC
  //     </div>
  //   </div>

  //   <table className="assets-table">
  //     <thead>
  //       <tr>
  //         {assetsHeader.map(header => (
  //           <th
  //             key={header.name}
  //             onClick={() => {
  //               sortBy === header.sortable ? flipSortDirection() : setSortby(header.sortable)
  //             }}
  //           >
  //             {header.name}
  //           </th>
  //         )
  //         )}
  //       </tr>
  //     </thead>
  //   </table>

  //   <div className="container-scroll">

  //   <table className="assets-table">
  //     <tbody>
  //     {sortAndFilter(balances, textFilter, sortBy, sortDirection, hideEmptyBalances).map(symbol => {
  //         //console.log(balances[symbol])
  //         const tokenMarketData = marketData[`${symbol}/ETH`] ? marketData[`${symbol}/ETH`] : []
  //         const hasMarketData = tokenMarketData.length > 0

  //         return (
  //         <tr key={symbol}>
  //           <td style={{ textAlign: 'left' }}>{tokenNames[symbol]}</td>
  //           <td>{symbol}</td>
  //           <td>{wei2ether(balances[symbol].resardis)}</td>
  //           <td>{wei2ether(balances[symbol].sidechain)}</td>
  //           <td>{wei2ether(balances[symbol].resardisInUse)}</td>
  //           {hasMarketData ? (
  //             <>
  //             <td style={{ color: tokenMarketData[1] < 0 ? '#D5002A' : '#00AA55'}}>{tokenMarketData[1]}%</td>
  //             <td>?</td>
  //             <td>{tokenMarketData[3].toFixed(8)}</td>
  //             </>
  //           ) : (
  //             <>
  //             <td>N/A</td>
  //             <td>N/A</td>
  //             <td>N/A</td>
  //             </>
  //           )}
  //           <td>
  //             <button
  //               className="trade-button"
  //               onClick={() => {
  //                 selectScreen('Market')
  //                 selectCurrencyPair(`${symbol}/ETH`)
  //                 console.log('trade', symbol)
  //               }}
  //             >
  //               trade
  //             </button>
  //           </td>
  //         </tr>
  //       )})}
  //     </tbody>
  //   </table>
  //   </div>
  //   <div style={{ minHeight: '12px' }}></div>
  // </div>
)}

export default connector(Assets)
