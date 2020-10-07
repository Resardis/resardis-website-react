import {
  SET_CONTRACT_API,
  ADD_ACTIVE_OFFER,
  REMOVE_ACTIVE_OFFER,
  SetContractAPIAction,
  AddActiveOfferIDAction,
  RemoveActiveOfferIDAction,
} from '../constants/actionTypes'
import { Network } from '../constants/networks'

export const noNetwork:Network = {
  tokens: {},
  name: '',
  contract: '',
}

export const setContractAPI = (contractAPI:object|null, network:Network = noNetwork):SetContractAPIAction => ({
  type: SET_CONTRACT_API,
  payload: {
    contractAPI,
    network,
  }
})

export const addActiveOfferID = (payload: number):AddActiveOfferIDAction => ({
  type: ADD_ACTIVE_OFFER,
  payload,
})

export const removeActiveOfferID = (payload: number):RemoveActiveOfferIDAction => ({
  type: REMOVE_ACTIVE_OFFER,
  payload,
})

export type ContractActions = SetContractAPIAction | AddActiveOfferIDAction | RemoveActiveOfferIDAction