import React from 'react'
import { TAB_MARKETS, TAB_MENU_MARKETS_NAME, TAB_MARKETS_DAI } from '../constants/tabData'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { sortBy, sortDirection, updateTextFilter, selectCurrencyPair, updateCurrencyPairData } from '../actions'
import { sortingTypes, sortingDirections } from '../constants/actionTypes'
import { PairData, MarketData } from '../reducers/markets'
import { SearchBox } from './shared'
import { number4DP, wei2ether } from '../helpers'
import { useQuery } from '@apollo/client'
import { getTokenNameFromAddress } from '../constants/networks'
import { ethers } from 'ethers'
import { getPairs } from '../gqlQueries/MarketsData'
import { BigNumber } from 'bignumber.js'
import shortid from 'shortid'

interface StateProps {
  //markets: Markets,
  selectedQuoteCurrency: string,
  textFilter: string,
  selectedCurrencyPair: string,
  columnSortBy: sortingTypes,
  columnSortDirection: sortingDirections,
}

const getSelectedQuoteCurrency = (state: RootState):string => {
  return state.activeTabs[TAB_MENU_MARKETS_NAME] === TAB_MARKETS_DAI ? 'DAI' : 'ETH'
}

const sortAndFilter = (data:MarketData, props:PropsFromRedux):MarketData => {
  const runSortBy = (data:MarketData):MarketData => {
    const [ plus, minus ] = props.columnSortDirection === sortingDirections.SORT_ASC ? [ 1, -1 ] : [ -1, 1 ]

    switch(props.columnSortBy) {
      case sortingTypes.SORT_BY_CHANGE24:
        return data.sort((a, b) => a[1] > b[1] ? plus : minus)
      case sortingTypes.SORT_BY_VOLUME:
        return data.sort((a, b) => a[2] > b[2] ? plus : minus)
      case sortingTypes.SORT_BY_PRICE:
        return data.sort((a, b) => a[3] > b[3] ? plus : minus)
      default: return data
    }
  }

  const runTextFilter = (data:MarketData):MarketData => {
    if (!props.textFilter) return(data)
    return data.filter(row => row[0].includes(props.textFilter))
  }

  const filterByQuote = (data:MarketData):MarketData => {
    return data.filter(row => {
      const [ , quote ] = row[0].split('/')
      return quote === props.selectedQuoteCurrency
    })
  }

  return runSortBy(runTextFilter(filterByQuote(data)))
}

const mapStateToProps = (state: RootState):StateProps => {
  // TODO: smarter data selector
  return {
    selectedQuoteCurrency: getSelectedQuoteCurrency(state),
    //markets: state.markets,
    textFilter: state.markets.textFilter,
    columnSortBy: state.markets.sortBy,
    columnSortDirection: state.markets.sortDirection,
    selectedCurrencyPair: state.markets.selectedCurrencyPair,
  }
}

const mapDispatchToProps = (dispatch:any) => ({
  changeSortBy: (payload:sortingTypes) => dispatch(sortBy(payload)),
  changeSortDirection: () => dispatch(sortDirection()),
  updateTextFilter: (target:string, textFilter:string) => dispatch(updateTextFilter(target, textFilter)),
  selectCurrencyPair: (pair:string) => dispatch(selectCurrencyPair(pair)),
  updateCurrencyPairData: (pairData:PairData) => dispatch(updateCurrencyPairData(pairData)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const Search = connector(({ textFilter, updateTextFilter }: PropsFromRedux) => (
  <SearchBox value={textFilter} updateTextFilter={updateTextFilter} target={TAB_MARKETS} />
))

const updateSorting = (sortBy: sortingTypes, props: PropsFromRedux) => {
  if (props.columnSortBy === sortBy) {
    props.changeSortDirection()
  } else {
    props.changeSortBy(sortBy)
  }
}

const MarketsData = (props: PropsFromRedux) => {
  type Pairs = {
    [key:string]: {
      [key:string]: {
        price: BigNumber,
        volume: BigNumber,
      }
    },
  }

  type Order = {
    pair: string,
    takeAmt: BigNumber,
    giveAmt: BigNumber,
    payGem: string,
    buyGem: string,
  }

  const pairs:Pairs = {
    last24takes: {},
    previous24takes: {},
  }

  const marketData:MarketData = []
  // pair: {
  //   price <- last order
  //   volume <- += takeAmt
  // }

  let last24Start = Date.now() / 1000 - 86400
  let prev24End = last24Start
  let prev24Start = last24Start - 86400 * 2

  // temp!

  last24Start = 1598948029
  prev24End = 1498948029
  prev24Start = 129898165

  const { loading, error, data } = useQuery(getPairs(last24Start, prev24Start, prev24End), { pollInterval: 1000 })

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error! {error.message}</span>

  const dataPoints = ['last24takes', 'previous24takes']

  dataPoints.forEach((set:string) => {
    if (!(set in data)) return

    data[set].forEach((order:Order) => {
      const tokenBuy = getTokenNameFromAddress(order.buyGem)
      const tokenSell = getTokenNameFromAddress(order.payGem)

      const pair = (order.buyGem === ethers.constants.AddressZero) ?
        `${tokenSell}/${tokenBuy}` : `${tokenBuy}/${tokenSell}`

      const takeAmt = new BigNumber(order.takeAmt)
      const giveAmt = new BigNumber(order.giveAmt)

      if (order.pair in pairs[set]) {
        // query sorts orders, so the first seen is the one to take price from
        if (!('price' in pairs[set])) {
          pairs[set][pair]['price'] = giveAmt.div(takeAmt)
          pairs[set][pair].volume = pairs[set][pair].volume.plus(takeAmt)
        }
      } else {
        pairs[set][pair] = {
          volume: takeAmt,
          price: giveAmt.div(takeAmt)
        }
      }
    })
  })

  Object.keys(pairs.last24takes).forEach(pair => {
    let pchange = 0

    if (pair in pairs.previous24takes) {
      const change24:BigNumber = pairs['last24takes'][pair].price.minus(pairs.previous24takes[pair].price)
      console.log('converting pchange', change24, change24.div(pairs['last24takes'][pair].price))
      pchange = change24.div(pairs['last24takes'][pair].price).toNumber()
    }

    const pairData:[string, number, number, BigNumber] = [
      pair,
      pchange,
      pairs['last24takes'][pair].volume.div(1e+18).toNumber(),
      pairs['last24takes'][pair].price,
    ]
    // this is for displaying in UI
    marketData.push(pairData)
    // this is for making prices available in redux
    props.updateCurrencyPairData(pairData)
  })

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
        {sortAndFilter(marketData, props).map(row => (
          <tr key={shortid()}
            onClick={() => props.selectCurrencyPair(row[0])}
            style={{
              background: props.selectedCurrencyPair === row[0] ? '#76797B' : '',
              cursor: 'pointer'
            }}
          >
            <td style={{ textAlign: 'left' }}>{row[0]}</td>
            <td style={{ color: row[1] < 0 ? '#D5002A' : '#00AA55'}}>{row[1]}%</td>
            <td>{number4DP(row[2])}</td>
            <td>{row[3].toFixed(8)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  )
}

export default connector(MarketsData)


