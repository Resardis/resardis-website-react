import { combineReducers } from 'redux'
import activeTabsReducer from './activeTabs'
import marketsReducer from './markets'
import userDataReducer from './userData'

const rootReducer = combineReducers({
  activeTabs: activeTabsReducer,
  markets: marketsReducer,
  userData: userDataReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
