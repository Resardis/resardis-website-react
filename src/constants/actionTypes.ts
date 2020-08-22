export const ACTIVATE_TAB = 'ACTIVATE_TAB'
export const SORT_BY = 'SORT_BY'
export const SORT_DIRECTION = 'SORT_DIRECTION'
export const TEXT_FILTER = 'TEXT_FILTER'
export const SELECT_CURRENCY_PAIR = 'SELECT_CURRENCY_PAIR'

export interface ActivationPayload {
  [tabbedNavigationName:string]: string,
}

export interface ActivateTabAction {
  type: typeof ACTIVATE_TAB,
  payload: ActivationPayload,
}

export enum sortingTypes {
  NO_SORT = 'NO_SORT',
  SORT_BY_CHANGE24 = 'SORT_BY_CHANGE24',
  SORT_BY_VOLUME = 'SORT_BY_VOLUME',
  SORT_BY_PRICE = 'SORT_BY_PRICE',
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

