import React, { createElement } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { NotFound } from '@common/components'
import { v4 as uuid } from 'uuid'
import type { CElement } from 'react'
import type { SwitchProps, RedirectProps, RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

function renderRoute(route: RouteConfig, props: RouteComponentProps): JSX.Element {
  const { component: Component, routes, redirect, path, wrappers } = route
  const redirectComponent = redirect && <Redirect key={`${uuid()}-redirect`} exact from={path} to={redirect} />
  const children = renderRoutes(routes, { redirectComponent, useNotFoundComponent: !Component || Boolean(routes?.length) })
  let ret = Component ? <Component {...props}>{children}</Component> : children
  if (wrappers?.length) {
    let len = wrappers.length - 1
    while (len >= 0) {
      ret = createElement(wrappers[len] as any, props, ret)
      len -= 1
    }
  }
  return ret
}

type RenderRoutes = (
  routes: RouteConfig[],
  extraParams?: { redirectComponent?: CElement<RedirectProps, Redirect>; useNotFoundComponent?: boolean },
) => CElement<SwitchProps, Switch>

const renderRoutes: RenderRoutes = (routes = [], extraParams = {}) => {
  const { redirectComponent, useNotFoundComponent = true } = extraParams
  return (
    <Switch key={uuid()}>
      {routes.map((route, index) => {
        const { path, exact, strict, sensitive } = route
        const key = `${uuid()}-${path || index}`
        return <Route key={key} {...{ path, exact, strict, sensitive }} render={(props) => renderRoute(route, props)} />
      })}
      {redirectComponent}
      {useNotFoundComponent && <Route key={`${uuid()}-not-found`} component={NotFound} />}
    </Switch>
  )
}

export default renderRoutes
