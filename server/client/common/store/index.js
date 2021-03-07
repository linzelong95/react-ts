import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { initialUserState } from './reducers/user'

function initializeStore(state) {
  const store = createStore(reducers, { user: initialUserState, ...state }, applyMiddleware(ReduxThunk))
  return store
}

export default initializeStore
