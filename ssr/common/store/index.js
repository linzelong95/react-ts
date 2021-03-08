import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'

function initializeStore(state) {
  const store = createStore(reducers, { user: {}, ...state }, applyMiddleware(ReduxThunk))
  return store
}

export default initializeStore
