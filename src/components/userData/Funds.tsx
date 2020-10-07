import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../../reducers'
import { wei2ether } from '../../helpers'
import { tokenNames } from '../../constants/networks'
import { BalancesType } from '../../reducers/funds'
import { sortingDirections, sortingTypes } from '../../constants/actionTypes'
import { BigNumber } from 'bignumber.js'

interface StateProps {
  balances: BalancesType,
  textFilter: string,
}

interface OwnProps {
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
}

const mapStateToProps = (state: RootState):StateProps => ({
  balances: state.funds.balances,
  textFilter: state.userData.textFilter,
})

const connector = connect(mapStateToProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps



const sortAndFilter = (
  data:BalancesType,
  textFilter:string,
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
) => {

  const runSortBy = (data:BalancesType, keys:Array<string>) => {
    const [ plus, minus ] = sortDirection === sortingDirections.SORT_ASC ? [ 1, -1 ] : [ -1, 1 ]

    switch(sortBy) {
      case sortingTypes.SORT_BY_AVAILABLE:
        return keys.sort((a, b) => data[a].resardis.gt(data[b].resardis) ? plus : minus)
      case sortingTypes.SORT_BY_BALANCE_IN_USE:
        return keys.sort((a, b) => data[a].resardisInUse.gt(data[b].resardisInUse) ? plus : minus)
      case sortingTypes.SORT_BY_TOTAL:
        return keys.sort((a, b) => {
          const totalA:BigNumber = new BigNumber(data[a].resardis).plus(new BigNumber(data[a].resardisInUse))
          const totalB:BigNumber = new BigNumber(data[b].resardis).plus(new BigNumber(data[b].resardisInUse))
          return totalA.gt(totalB) ? plus : minus
        })
      default: return keys
    }
  }

  const runTextFilter = (data:BalancesType) => {
    const keys = Object.keys(data)

    if (!textFilter) return(keys)

    return keys.filter(key =>
      key.toUpperCase().includes(textFilter.toUpperCase()) ||
      tokenNames[key].toUpperCase().includes(textFilter.toUpperCase())
    )
  }

  return runSortBy(data, runTextFilter(data))
}

const Funds = (props:Props) => {
  const rows = sortAndFilter(
    props.balances,
    props.textFilter,
    props.sortBy,
    props.sortDirection,
  )
  .map(symbol => {
    if (props.balances[symbol].resardis.eq(0)) return null

    const balance = props.balances[symbol]

    return (
      <tr key={symbol}>
        <td style={{ textAlign: 'left' }}>{symbol} - {tokenNames[symbol]}</td>
        <td>{wei2ether(balance.resardis, 10)}</td>
        <td>{wei2ether(balance.resardisInUse, 10)}</td>
        <td>{wei2ether(balance.resardis.plus(balance.resardisInUse), 10)}</td>
      </tr>
    )
  }).filter(row => row)

  return rows.length ? (
    <>
      {rows}
    </>
  ):(
    <tr>
      <td>no funds have been uploaded to the contract yet</td>
    </tr>
  )
}

export default connector(Funds)
