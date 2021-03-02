import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import reduxLogger from 'redux-logger'
import reducers from './reducers'
import { initialUserState } from './reducers/user'
import type { ReducersMapObject } from 'redux'
import type { ProviderProps } from 'react-redux'

// export default createStore(reducers, { user: initialUserState }, applyMiddleware(ReduxThunk))

export default function getCombinedStore(
  reducerMap?: ReducersMapObject,
  stateMap?: Record<string, Record<string, any>>,
): ProviderProps['store'] {
  const combinedReducers = combineReducers({ ...reducers, ...reducerMap })
  const middlewareArr = [applyMiddleware(ReduxThunk)]
  if (__IS_DEV_MODE__) middlewareArr.push(applyMiddleware(reduxLogger))
  return createStore(combinedReducers, { user: initialUserState, ...stateMap }, compose(...middlewareArr))
}
