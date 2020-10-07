import {
  TEXT_FILTER,
  SET_IS_WALLET_ENABLED,
  SET_ACCOUNT_ADDRESS,
  SET_ASSET_BALANCE,
  SELECT_ASSET,
  CLEAR_ASSETS_BALANCE,
} from '../constants/actionTypes'
import { TableActions  } from '../actions'
import { AccountActions } from '../actions/walletActions'
import { TAB_FUNDS_ASSETS } from '../constants/tabData'
import { networks } from '../constants/networks'
import { BigNumber } from 'bignumber.js'

export type AssetType = Array<[string, string, number, number, number, number, number, number]>
export type BalancesType = {
  [key:string]: {
    [key:string]: BigNumber
  }
}

export interface Funds {
  isWalletEnabled: boolean,
  accountAddress: string,
  textFilter: string,
  hideEmptyBalances: boolean,
  totalBalanceBTC: BigNumber,
  totalBalanceUSD: Number,
  assetSelected: string,
  balances: BalancesType,
}

const createBalances = () => Object.keys(networks)
  .reduce((balances:BalancesType, chainID:string) => {
    const tokens = networks[chainID].tokens

    Object.keys(tokens).forEach(tokenAddress => {
      balances[tokens[tokenAddress]] = {
        mainnet: new BigNumber(0),
        sidechain: new BigNumber(0),
        resardis: new BigNumber(0),
        resardisInUse: new BigNumber(0),
      }
    })

    return balances
  }, {})

const initialState: Funds = {
  isWalletEnabled: false,
  accountAddress: '',
  textFilter: '',
  hideEmptyBalances: false,
  totalBalanceBTC: new BigNumber(0),
  totalBalanceUSD: 2.01,
  balances: createBalances(),
  assetSelected: 'ETH',
}

const fundsReducer = (state:Funds = initialState, action:TableActions|AccountActions):Funds => {
  const newState = { ...state }

  switch(action.type) {
    case TEXT_FILTER:
      if (action.payload.target === TAB_FUNDS_ASSETS)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state

    case SET_IS_WALLET_ENABLED:
      newState.isWalletEnabled = action.payload
      return newState

    case SET_ACCOUNT_ADDRESS:
      newState.accountAddress = action.payload
      return newState

    case SET_ASSET_BALANCE:
      newState.balances = { ...newState.balances }
      newState.balances[action.payload.symbol][action.payload.source] = action.payload.balance
      return newState

    case CLEAR_ASSETS_BALANCE:
      newState.balances = createBalances()
      return newState

    case SELECT_ASSET:
      newState.assetSelected = action.payload
      return newState

    default:
      return state
  }
}

export default fundsReducer
