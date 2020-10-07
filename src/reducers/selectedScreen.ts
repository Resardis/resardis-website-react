import { SELECT_SCREEN, SelectScreenAction } from '../constants/actionTypes'

const initialScreen: string = 'Market'
//const initialScreen: string = 'Funds'

const selectedScreenReducer = (state:string = initialScreen, action:SelectScreenAction):string => {
  switch(action.type) {
    case SELECT_SCREEN:
      return action.payload
    default:
      return state
  }
}

export default selectedScreenReducer