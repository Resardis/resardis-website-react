import {
  TEXT_FILTER,
  SET_ACTIVE_WALLET,
  SET_WALLET_INFO,
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

export type Wallet = {
  name: string,
  instance: any,
  web3: any,
  [key:string]: any,
}

export type WalletInfoType = {
  walletName: string,
  property: string,
  value: any,
}

export interface Funds {
  activeWallet: string,
  accountAddress: string,
  wallets: {
    [key:string]: Wallet
  },
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
  activeWallet: '',
  accountAddress: '',

  wallets: {
    metamask: {
      name: 'metamask',
      present: false,
      enabled: false,
      instance: null,
      web3: null,
    },
    portis: {
      name: 'portis',
      isLoggedIn: false,
      instance: null,
      web3: null,
    },
    fortmatic: {
      name: 'fortmatic',
      isLoggedIn: false,
      instance: null,
      web3: null,
    },
    torus: {
      name: 'torus',
      isLoggedIn: false,
      instance: null,
      web3: null,
    },
  },

  textFilter: '',
  hideEmptyBalances: false,
  totalBalanceBTC: new BigNumber(0),
  totalBalanceUSD: 0,
  balances: createBalances(),
  assetSelected: 'MATIC',
}

const fundsReducer = (state:Funds = initialState, action:TableActions|AccountActions):Funds => {
  const newState = { ...state }
  switch(action.type) {
    case TEXT_FILTER:
      if (action.payload.target === TAB_FUNDS_ASSETS)
        return { ...state, textFilter: action.payload.textFilter }
      else
        return state

    case SET_ACTIVE_WALLET:
      // console.log('--SET_ACTIVE_WALLET', action.payload)
      newState.activeWallet = action.payload
      newState.accountAddress = newState.wallets[action.payload].account
      return newState

    case SET_WALLET_INFO:
      // console.log('--SET_WALLET_INFO', action.payload)
      const { walletName, property, value } = action.payload
      newState.wallets = { ...newState.wallets, [walletName]: { ...newState.wallets[walletName], [property]: value }}
      if (property === 'accounts') newState.wallets[walletName].account = value.length ? value[0] : ''
      return newState

    case SET_ACCOUNT_ADDRESS:
      newState.accountAddress = action.payload
      return newState

    case SET_ASSET_BALANCE:
      // console.log('--SET_ASSET_BALANCE', )
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
