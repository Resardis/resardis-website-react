import { combineReducers } from 'redux'
import activeTabsReducer from './activeTabs'
import marketsReducer from './markets'
import userDataReducer from './userData'
import fundsWindowReducer from './fundsWindow'
import selectedScreenReducer from './selectedScreen'
import fundsReducer from './funds'
import contractReducer from './contract'

const rootReducer = combineReducers({
  activeTabs: activeTabsReducer,
  markets: marketsReducer,
  userData: userDataReducer,
  fundsWindow: fundsWindowReducer,
  selectedScreen: selectedScreenReducer,
  funds: fundsReducer,
  contract: contractReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
