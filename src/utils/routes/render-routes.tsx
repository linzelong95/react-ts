import React, { createElement } from 'react'
import { Redirect, Route, Switch, SwitchProps } from 'react-router-dom'
import { NotFound } from '@common/components'
import { v4 as uuid } from 'uuid'
import type { RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

type RenderRoutes = (
  routes: RouteConfig[],
  extraParams?: { redirectComponent?: JSX.Element; useNotFoundComponent?: boolean },
) => React.CElement<SwitchProps, Switch>

function renderRoute(route: RouteConfig, props: RouteComponentProps<any>): JSX.Element {
  const { component: Component, redirect, path, wrappers } = route
  const newProps = { ...props } // 可以注入额外的属性，如果需要的话
  const redirectComponent = redirect && <Redirect key={`${uuid()}-redirect`} exact from={path} to={redirect} />
  const children = renderRoutes(route.routes, { redirectComponent, useNotFoundComponent: !Component || Boolean(route.routes?.length) })
  let ret = Component ? <Component {...newProps}>{children}</Component> : children
  if (wrappers?.length) {
    let len = wrappers.length - 1
    while (len >= 0) {
      ret = createElement(wrappers[len] as any, newProps, ret)
      len -= 1
    }
  }
  return ret
}

const renderRoutes: RenderRoutes = (routes = [], extraParams = {}) => {
  const { redirectComponent, useNotFoundComponent = true } = extraParams
  return (
    <Switch key={uuid()}>
      {routes.map((route, index) => {
        const { path, exact, strict, sensitive } = route
        return (
          <Route
            key={`${uuid()}-${path || index}`}
            {...{ path, exact, strict, sensitive }}
            render={(props: RouteComponentProps<any>) => renderRoute(route, props)}
          />
        )
      })}
      {redirectComponent}
      {useNotFoundComponent && <Route key={`${uuid()}-not-found`} component={NotFound} />}
    </Switch>
  )
}

export { renderRoutes }
