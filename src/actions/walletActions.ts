import {
    SET_ACTIVE_WALLET,
    SET_WALLET_INFO,
    SET_ACCOUNT_ADDRESS,
    SET_ASSET_BALANCE,
    SELECT_ASSET,
    CLEAR_ASSETS_BALANCE,
    SetActiveWallet,
    SetWalletInfo,
    AccountAddressAction,
    AssetBalanceAction,
    SelectAssetAction,
    AssetBalanceActionPayload,
    ClearAssetsBalanceAction,
} from '../constants/actionTypes'

export const setActiveWallet = (payload:string):SetActiveWallet => ({
  type: SET_ACTIVE_WALLET,
  payload
})

export const setWalletInfo = (walletName:string, property:string, value:any):SetWalletInfo => ({
  type: SET_WALLET_INFO,
  payload: {
    walletName,
    property,
    value,
  }
})

export const setAccountAddress = (payload:string):AccountAddressAction => ({
  type: SET_ACCOUNT_ADDRESS,
  payload,
})

export const setAssetBalance = (payload:AssetBalanceActionPayload):AssetBalanceAction => ({
  type: SET_ASSET_BALANCE,
  payload,
})

export const selectAsset = (payload:string):SelectAssetAction => ({
  type: SELECT_ASSET,
  payload,
})

export const clearAssetsBalance = ():ClearAssetsBalanceAction => ({
  type: CLEAR_ASSETS_BALANCE,
})

export type AccountActions = SetActiveWallet |
  SetWalletInfo |
  AccountAddressAction |
  AssetBalanceAction |
  SelectAssetAction |
  ClearAssetsBalanceAction

