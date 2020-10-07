import {
  SORT_BY,
  SORT_DIRECTION,
  TEXT_FILTER,
  sortingTypes,
  sortingDirections,
  UPDATE_CURRENCY_PAIR_DATA,
  SELECT_CURRENCY_PAIR,
} from '../constants/actionTypes'
import { TableActions } from '../actions'
import { TAB_MARKETS } from '../constants/tabData'
import { BigNumber } from 'bignumber.js'

export type PairData = [string, number, number, BigNumber]
export type MarketData = Array<PairData>

export type AllPairsData = {
  [key:string]:PairData,
}
export type OrdersData = Array<[number, number, number]>

export interface Markets {
  sortBy: sortingTypes,
  sortDirection: sortingDirections,
  textFilter: string,
  selectedCurrencyPair: string,
  data: AllPairsData,
  ordersData: OrdersData,
}

const initialState: Markets = {
  sortBy: sortingTypes.NO_SORT,
  sortDirection: sortingDirections.SORT_ASC,
  textFilter: '',
  selectedCurrencyPair: '',
  data: {
    'MKR/ETH': [ 'MKR/ETH', 0.0, 0.0000, new BigNumber(0.0010) ],
    'ETH/DAI': [ 'ETH/DAI', 1.2, 0.3300, new BigNumber(2.0000) ],
  },
  ordersData: [
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
    [0.0000, 0.0000, 0.0000],
  ],
}

const marketsReducer = (state:Markets = initialState, action:TableActions):Markets => {
  switch(action.type) {
    case SORT_BY:
      return { ...state, sortBy: action.payload }

    case SORT_DIRECTION:
      return {
        ...state,
        sortDirection: state.sortDirection === sortingDirections.SORT_ASC
        ? sortingDirections.SORT_DESC
        : sortingDirections.SORT_ASC
      }

    case TEXT_FILTER:
      if (action.payload.target === TAB_MARKETS)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state

    case SELECT_CURRENCY_PAIR:
      console.log(action)
      return { ...state, selectedCurrencyPair: action.payload }

    case UPDATE_CURRENCY_PAIR_DATA:
//console.log('UPDATE_CURRENCY_PAIR_DATA', action.payload)
      const newState = { ...state }
      newState.data[action.payload[0]] = action.payload
      // Market gets data for all pairs. in case no pair is selected,
      // just pick the first one. For now. And (TODO) establish what should
      // be selected by default
      if (!newState.selectedCurrencyPair) newState.selectedCurrencyPair = action.payload[0]
      return newState

    default:
      return state
  }
}

export default marketsReducer
