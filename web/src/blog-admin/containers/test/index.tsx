/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, Dispatch, useCallback } from 'react'
import { connect } from 'react-redux'
import { StoreState, UserAction, UserActionType } from '@common/store/types'
import { useTranslation } from 'react-i18next'

interface AppProps {
  user: StoreState['user']
  onClearUser: (flag?: boolean) => void
}

function App(props: AppProps): JSX.Element {
  // const history = useHistory()
  const { user, onClearUser } = props

  const { i18n } = useTranslation()

  // const logout = useCallback(() => {
  //   onClearUser()
  // }, [])

  return <div>111133</div>
}

export default connect<Pick<AppProps, 'user'>, Pick<AppProps, 'onClearUser'>, Omit<AppProps, 'user' | 'onClearUser'>, StoreState>(
  (state: StoreState) => ({
    user: state.user,
  }),
  (dispatch: Dispatch<UserAction>) => ({
    onClearUser: (flag?: boolean) => dispatch({ type: UserActionType.LOGOUT }),
  }),
)(App)
