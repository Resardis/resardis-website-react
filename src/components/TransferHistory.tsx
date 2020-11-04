import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../reducers'
import { BalancesType } from '../reducers/funds'
import { wei2ether } from '../helpers'
import '../scss/Transfer.scss'
import { AccountActions, selectAsset } from '../actions/walletActions'
import shortid from 'shortid'
import { BigNumber } from 'bignumber.js'
import { getMyDeposits } from '../gqlQueries/Transfer'
import { sortingDirections, sortingTypes } from '../constants/actionTypes'
import { useQuery } from '@apollo/client'
import { tokenNames, getTokenNameFromAddress, getNetworkNameFromAddress } from '../constants/networks'

interface StateProps {
  accountAddress: string,
  balances: BalancesType,
}

const mapStateToProps = (state: RootState):StateProps => ({
  accountAddress: state.funds.accountAddress,
  balances: state.funds.balances,
})

const mapDispatchToProps = (dispatch:any) => ({
  selectAsset: (asset:string):AccountActions => dispatch(selectAsset(asset)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type TransferHistoryType = {
  target:string,
  tokenName:string,
  token:string,
  amount:string,
  networkName:string,
}

type TransferHistoryListType = Array<TransferHistoryType>

const sortAndFilter = (
  data:TransferHistoryListType,
  sortBy:sortingTypes,
  sortDirection:sortingDirections,
) => {

  const runSortBy = (data:TransferHistoryListType) => {
    const [ plus, minus ] = sortDirection === sortingDirections.SORT_ASC ? [ 1, -1 ] : [ -1, 1 ]

    switch(sortBy) {
      case sortingTypes.SORT_BY_DATE:
        return data.sort((a, b) => 1)
      case sortingTypes.SORT_BY_NETWORK:
        return data.sort((a, b) => a.networkName > b.networkName ? plus : minus)
      case sortingTypes.SORT_BY_ASSET:
        return data.sort((a, b) => a.tokenName > b.tokenName ? plus : minus)
      case sortingTypes.SORT_BY_TICKER:
        return data.sort((a, b) => a.token > b.token ? plus : minus)
      case sortingTypes.SORT_BY_AMOUNT:
        return data.sort((a, b) => new BigNumber(a.amount).gt(new BigNumber(b.amount)) ? plus : minus)
        default: return data
    }
  }

  return runSortBy(data)
}

const transferHistoryHeader = [
  { name: 'Date', sortable: sortingTypes.SORT_BY_DATE },
  { name: 'Network', sortable: sortingTypes.SORT_BY_NETWORK },
  { name: 'Asset', sortable: sortingTypes.SORT_BY_ASSET },
  { name: 'Ticker', sortable: sortingTypes.SORT_BY_TICKER },
  { name: 'Amount', sortable: sortingTypes.SORT_BY_AMOUNT },
  { name: 'From', sortable: sortingTypes.SORT_BY_SOURCE },
]

const TransferHistoryTable = ({ transfers }:{ transfers: any }) => {
  const [ sortBy, setSortby ] = useState(sortingTypes.SORT_BY_NAME)
  const [ sortDirection, setSortDirection ] = useState(sortingDirections.SORT_ASC)

  const flipSortDirection = () => {
    setSortDirection(sortDirection === sortingDirections.SORT_DESC ?
      sortingDirections.SORT_ASC : sortingDirections.SORT_DESC
    )
  }

  return (
    <>
    <table className="table table-borderless table-dark table-striped table-hover table-sm transfer-table">
      <thead>
        <tr>
          {transferHistoryHeader.map(header => (
            <th
              scope="col"
              key={header.name}
              onClick={() => {
                if (sortBy === header.sortable) {
                  flipSortDirection()
                } else {
                  setSortby(header.sortable)
                }
              }}
            >
              {header.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortAndFilter(transfers, sortBy, sortDirection).map((row:TransferHistoryType) => (
          <tr key={shortid()}>
            <td>-</td>
            <td>{row.target}</td>
            <td>{row.tokenName}</td>
            <td>{row.token}</td>
            <td>{wei2ether(new BigNumber(row.amount))}</td>
            <td>{row.networkName}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

const getTransferTokenDetails = (deposit:any) => {
  const token = getTokenNameFromAddress(deposit.token)
  const networkName = getNetworkNameFromAddress(deposit.token)
  const tokenName = token in tokenNames ? tokenNames[token] : '???'
  return { token, networkName, tokenName }
}

// deposits {
//   id
//   token
//   user
//   amount
//   balance
// }

const TransferHistoryConnected = (props:PropsFromRedux) => {
  const { loading, error, data } = useQuery(getMyDeposits(props.accountAddress), { pollInterval: 1000 })

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error! {error.message}</span>

  const transfers = [
    ...data.deposits.map((deposit:any) => ({
      date: '-',
      target: 'Resardis',
      amount: deposit.amount,
      ...getTransferTokenDetails(deposit),
    })),
    ...data.withdraws.map((deposit:any) => ({
      date: '-',
      target: 'Chain',
      amount: deposit.amount,
      ...getTransferTokenDetails(deposit),
    })),
  ]

  return (
    <div>
      <h2 className="mb-3">Transfer History</h2>
      <TransferHistoryTable transfers={transfers} />
    </div>
  )
}


export default connector(TransferHistoryConnected)
