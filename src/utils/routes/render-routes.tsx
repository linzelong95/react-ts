import React, { createElement, Fragment } from 'react'
import { Redirect, Route, Switch, SwitchProps } from 'react-router-dom'
import { NotFound } from '@common/components'
import type { RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

function renderRoutes(routes: RouteConfig[] = [], redirectComponent?: JSX.Element): React.CElement<SwitchProps, Switch> {
  return (
    <Switch>
      {routes.map((route, index) => {
        const { path, exact, strict, sensitive } = route
        return (
          <Route
            key={path || index}
            {...{ path, exact, strict, sensitive }}
            render={(props: RouteComponentProps<any>) => render({ route, props })}
          />
        )
      })}
      {redirectComponent}
      <Route component={NotFound} />
    </Switch>
  )
}

function render({ route, props }: { route: RouteConfig; props: RouteComponentProps<any> }): JSX.Element {
  const { component, redirect, path, wrappers } = route
  const newProps = { ...props, route }
  const redirectComponent = redirect && <Redirect exact from={path} to={redirect} />
  let ret = createElement(component || Fragment, component ? newProps : null, [renderRoutes(route.routes, redirectComponent)])
  if (wrappers) {
    let len = wrappers.length - 1
    while (len >= 0) {
      ret = createElement(wrappers[len] as any, newProps, ret)
      len -= 1
    }
  }
  return ret
}

export { renderRoutes }
