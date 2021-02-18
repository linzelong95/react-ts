import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { initialUserState } from './reducers/user'

export default createStore(reducers, { user: initialUserState }, applyMiddleware(ReduxThunk))
