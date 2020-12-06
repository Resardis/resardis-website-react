import { BigNumber } from 'bignumber.js'
import { PairData } from '../reducers/markets'
import { Network } from '../constants/networks'

export const ACTIVATE_TAB = 'ACTIVATE_TAB'
export const SORT_BY = 'SORT_BY'
export const SORT_DIRECTION = 'SORT_DIRECTION'
export const TEXT_FILTER = 'TEXT_FILTER'
export const SELECT_CURRENCY_PAIR = 'SELECT_CURRENCY_PAIR'
export const OPEN_FUNDS_WINDOW = 'OPEN_FUNDS_WINDOW'
export const CLOSE_FUNDS_WINDOW = 'CLOSE_FUNDS_WINDOW'
export const SELECT_SCREEN = 'SELECT_SCREEN'
export const SET_IS_WALLET_ENABLED = 'SET_WALLET_ENABLED'
export const SET_ACCOUNT_ADDRESS = 'SET_ACCOUNT_ADDRESS'
export const SET_ASSET_BALANCE = 'SET_ASSET_BALANCE'
export const SELECT_ASSET = 'SELECT_ASSET'
export const UPDATE_CURRENCY_PAIR_DATA = 'UPDATE_CURRENCY_PAIR_DATA'
export const SET_CONTRACT_API = 'SET_CONTRACT_API'
export const ADD_ACTIVE_OFFER = 'ADD_ACTIVE_OFFER'
export const REMOVE_ACTIVE_OFFER = 'REMOVE_ACTIVE_OFFER'
export const CLEAR_ASSETS_BALANCE = 'CLEAR_ASSETS_BALANCE'
export const ADD_MY_ORDER = 'ADD_MY_ORDER'
export const SELECT_ORDER = 'SELECT_ORDER'

export interface ActivationPayload {
  [tabbedNavigationName:string]: string,
}

export interface ContractPayload {
  contractAPI: Object|null,
}

export interface ActivateTabAction {
  type: typeof ACTIVATE_TAB,
  payload: ActivationPayload,
}

export enum sortingTypes {
  NO_SORT = 'NO_SORT',
  SORT_BY_PAIR = 'SORT_BY_PAIR',
  SORT_BY_TYPE = 'SORT_BY_TYPE',
  SORT_BY_SIDE = 'SORT_BY_SIDE',
  SORT_BY_TOTAL = 'SORT_BY_TOTAL',
  SORT_BY_CHANGE24 = 'SORT_BY_CHANGE24',
  SORT_BY_VOLUME = 'SORT_BY_VOLUME',
  SORT_BY_PRICE = 'SORT_BY_PRICE',
  SORT_BY_PRICE_ETH = 'SORT_BY_PRICE_ETH',
  SORT_BY_PRICE_USD = 'SORT_BY_PRICE_USD',
  SORT_BY_NAME = 'SORT_BY_NAME',
  SORT_BY_TICKER = 'SORT_BY_TICKER',
  SORT_BY_RESARDIS_BALANCE = 'SORT_BY_RESARDIS_BALANCE',
  SORT_BY_SIDECHAIN_BALANCE = 'SORT_BY_SIDECHAIN_BALANCE',
  SORT_BY_BALANCE_IN_USE = 'SORT_BY_BALANCE_IN_USE',
  SORT_BY_DATE = 'SORT_BY_DATE',
  SORT_BY_ASSET = 'SORT_BY_ASSET',
  SORT_BY_AMOUNT = 'SORT_BY_AMOUNT',
  SORT_BY_NETWORK = 'SORT_BY_NETWORK',
  SORT_BY_SOURCE = 'SORT_BY_SOURCE',
  SORT_BY_AVAILABLE = 'SORT_BY_AVAILABLE',
  SORT_BY_AVERAGE = 'SORT_BY_AVERAGE',
  SORT_BY_FEE = 'SORT_BY_FEE',
  SORT_BY_STATUS = 'SORT_BY_STATUS',
  SORT_BY_FILLED = 'SORT_BY_FILLED',
  SORT_BY_EXECUTED = 'SORT_BY_EXECUTED',
}

export enum sortingDirections {
  SORT_DESC = 'SORT_DESC',
  SORT_ASC = 'SORT_ASC',
}

export interface SortByAction {
  type: typeof SORT_BY,
  payload: sortingTypes,
}

export interface SortDirectionAction {
  type: typeof SORT_DIRECTION,
}

export interface TextFilterPayload {
  target: string,
  textFilter: string,
}

export interface TextFilterAction {
  type: typeof TEXT_FILTER,
  payload: TextFilterPayload,
}

export interface SelectCurrencyPairAction {
  type: typeof SELECT_CURRENCY_PAIR,
  payload: string,
}

export interface OpenFundsWindowAction {
  type: typeof OPEN_FUNDS_WINDOW,
}

export interface CloseFundsWindowAction {
  type: typeof CLOSE_FUNDS_WINDOW,
}

export interface SelectScreenAction {
  type: typeof SELECT_SCREEN,
  payload: string,
}

export interface SetIsWalletEnabled {
  type: typeof SET_IS_WALLET_ENABLED,
  payload: boolean,
}

export interface AccountAddressAction {
  type: typeof SET_ACCOUNT_ADDRESS,
  payload: string,
}

export type AssetBalanceActionPayload = {
  symbol: string,
  source: string,
  balance: BigNumber,
}

export interface AssetBalanceAction {
  type: typeof SET_ASSET_BALANCE,
  payload: AssetBalanceActionPayload,
}

export interface SelectAssetAction {
  type: typeof SELECT_ASSET,
  payload: string,
}

export interface UpdateCurrencyPairDataAction {
  type: typeof UPDATE_CURRENCY_PAIR_DATA,
  payload: PairData,
}

export interface SetContractAPIAction {
  type: typeof SET_CONTRACT_API,
  payload: ContractPayload,
}

export interface AddActiveOfferIDAction {
  type: typeof ADD_ACTIVE_OFFER,
  payload: number,
}

export interface RemoveActiveOfferIDAction {
  type: typeof REMOVE_ACTIVE_OFFER,
  payload: number,
}

export interface ClearAssetsBalanceAction {
  type: typeof CLEAR_ASSETS_BALANCE,
}

export type MyOrderType = {
  offerID: number,
  timestamp: number,
  pair: string,
  type: string,
  side: string,
  price: BigNumber,
  amount: BigNumber,
  filled: BigNumber,
  average: BigNumber,
  total: BigNumber,
  fee: BigNumber,
}

export interface SelectCurrencyPairAction {
  type: typeof SELECT_CURRENCY_PAIR,
  payload: string,
}

export type MyOrdersListType = {
  [key:string]: MyOrderType,
}

export interface AddMyOrderAction {
  type: typeof ADD_MY_ORDER,
  payload: MyOrderType,
}

export interface SelectOrderAction {
  type: typeof SELECT_ORDER,
  payload: MyOrderType,
}
