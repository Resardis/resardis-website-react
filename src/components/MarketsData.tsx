import React from 'react'
import { TAB_MARKETS, TAB_MENU_MARKETS_NAME, TAB_MARKETS_USDT } from '../constants/tabData'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { sortBy, sortDirection, updateTextFilter, selectCurrencyPair } from '../actions'
import { sortingTypes, sortingDirections } from '../constants/actionTypes'
import { Markets, MarketData } from '../reducers/markets'
import { SearchBox } from './shared'
import { number4DP } from '../helpers'

interface StateProps {
  markets: Markets,
  data: MarketData,
  textFilter: string,
  selectedCurrencyPair: string,
}

const getSelectedMarketData = (state: RootState) => {
  const currentMarket = state.activeTabs[TAB_MENU_MARKETS_NAME]
  if (currentMarket === TAB_MARKETS_USDT) return state.markets.dataUSDT
  return state.markets.dataETH
}

const sortAndFilter = (data:MarketData, mods:Markets):MarketData => {

  const runSortBy = (data:MarketData):MarketData => {
    switch(mods.sortBy) {
      case sortingTypes.SORT_BY_CHANGE24:
        return data.sort((a, b) => a[1] > b[1] ? 1 : -1)
      case sortingTypes.SORT_BY_VOLUME:
        return data.sort((a, b) => a[2] > b[2] ? 1 : -1)
      case sortingTypes.SORT_BY_PRICE:
        return data.sort((a, b) => a[3] > b[3] ? 1 : -1)
      default: return data
    }
  }

  const runSortDirection = (data:MarketData):MarketData => {
    if (mods.sortDirection === sortingDirections.SORT_ASC) return data.reverse()
    return data
  }

  const runTextFilter = (data:MarketData):MarketData => {
    if (!mods.textFilter) return(data)
    return data.filter(row => row[0].includes(mods.textFilter))
  }

  return runSortDirection(runSortBy(runTextFilter(data)))
}

const mapStateToProps = (state: RootState):StateProps => {
  // TODO: smarter data selector
  const data = getSelectedMarketData(state)
  return {
    data: sortAndFilter(data, state.markets),
    markets: state.markets,
    textFilter: state.markets.textFilter,
    selectedCurrencyPair: state.markets.selectedCurrencyPair,
  }
}

const mapDispatchToProps = (dispatch:any) => ({
  changeSortBy: (payload:sortingTypes) => dispatch(sortBy(payload)),
  changeSortDirection: () => dispatch(sortDirection()),
  updateTextFilter: (target:string, textFilter:string) => dispatch(updateTextFilter(target, textFilter)),
  selectCurrencyPair: (pair: string) => dispatch(selectCurrencyPair(pair))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const Search = connector(({ textFilter, updateTextFilter }: PropsFromRedux) => (
  <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target={TAB_MARKETS} />
))

const updateSorting = (sortBy: sortingTypes, props: PropsFromRedux) => {
  if (props.markets.sortBy === sortBy) {
    props.changeSortDirection()
  } else {
    props.changeSortBy(sortBy)
  }
}

const MarketsData = (props: PropsFromRedux) => {
  console.log(props)

  return (
    <>
    <table>
      <thead>
        <tr>
          <th>
            <Search />
          </th>
          <th onClick={() => updateSorting(sortingTypes.SORT_BY_CHANGE24, props)}>
            24h change
          </th>
          <th onClick={() => updateSorting(sortingTypes.SORT_BY_VOLUME, props)}>
            24h volume
          </th>
          <th onClick={() => updateSorting(sortingTypes.SORT_BY_PRICE, props)}>
            price (ETH)
          </th>
        </tr>
      </thead>
    </table>

    <div className="container-scroll">

    <table>
      <tbody>
        {props.data.map((row,i) => (
          <tr key={i}
            onClick={() => props.selectCurrencyPair(row[0])}
            style={{ background: props.selectedCurrencyPair === row[0] ? '#76797B' : '' }}
          >
            <td style={{ textAlign: 'left' }}>{row[0]}</td>
            <td style={{ color: row[1] < 0 ? '#D5002A' : '#00AA55'}}>{row[1]}%</td>
            <td>{number4DP(row[2])}</td>
            <td>{number4DP(row[3])}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default connector(MarketsData)


