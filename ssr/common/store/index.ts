import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import reduxLogger from 'redux-logger'
import reducers from '@common/store/reducers'
import { isClient } from '@common/utils'
import type { ReducersMapObject } from 'redux'
import type { ProviderProps } from 'react-redux'

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getCombinedStore(stateMap?: Record<string, Record<string, any>>, reducerMap?: ReducersMapObject): ProviderProps['store'] {
  const combinedReducers = combineReducers({ ...reducers, ...reducerMap })
  const middlewareArr = [applyMiddleware(ReduxThunk)]
  console.log(1111111, process.env.NODE_ENV)
  if (__IS_DEV_MODE__) middlewareArr.push(applyMiddleware(reduxLogger))
  return createStore(combinedReducers, stateMap, compose(...middlewareArr))
}

export default function getStore(stateMap?: Record<string, Record<string, any>>, reducerMap?: ReducersMapObject): ProviderProps['store'] {
  if (isClient) {
    if (!window[__NEXT_REDUX_STORE__]) window[__NEXT_REDUX_STORE__] = getCombinedStore(stateMap, reducerMap)
    return window[__NEXT_REDUX_STORE__]
  }
  return getCombinedStore(stateMap, reducerMap)
}
