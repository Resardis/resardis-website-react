import {
  SET_CONTRACT_API,
  ADD_ACTIVE_OFFER,
  REMOVE_ACTIVE_OFFER,
} from '../constants/actionTypes'
import { ContractActions } from '../actions/contractActions'
import { Network } from '../constants/networks'
import { noNetwork } from '../actions/contractActions'

export interface Contract {
  activeOffers: {
    [key:string]: boolean
  },
  contractAPI: object|null,
  network: Network,
}

const initialState: Contract = {
  activeOffers: {},
  contractAPI: null,
  network: noNetwork,
}

const contractReducer = (state:Contract = initialState, action:ContractActions):Contract => {
  const newState = { ...state }

  switch(action.type) {
    case SET_CONTRACT_API:
      return { ...state, contractAPI: action.payload.contractAPI, network: action.payload.network }

    case ADD_ACTIVE_OFFER:
      newState.activeOffers = { ...newState.activeOffers, [action.payload.toString()]: true }
      //console.log('activeOffers +', newState)
      return newState

    case REMOVE_ACTIVE_OFFER:
      newState.activeOffers = { ...newState.activeOffers, [action.payload.toString()]: false }
      //console.log('activeOffers -', newState)
      return newState

    default:
        return state
    }
  }

  export default contractReducer
