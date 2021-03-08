import React, { Suspense, createElement } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Spin } from 'antd'
import { NotFound } from '@common/components'
import { v4 as uuid } from 'uuid'
import type { CElement } from 'react'
import type { SwitchProps, RedirectProps, RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

function renderRoute(route: RouteConfig, props: RouteComponentProps, allRoutes: RouteConfig[], basename: string): JSX.Element {
  const { component: Component, routes, redirect, path, wrappers } = route
  const redirectComponent = redirect && <Redirect key={`${uuid()}-redirect`} exact from={path} to={redirect} />
  const useNotFoundComponent = !Component || Boolean(routes?.length)
  const children = renderRoutes(routes, basename, allRoutes, { redirectComponent, useNotFoundComponent })
  const formativeProps = path === '/' && Component ? { ...props, basename, routes: allRoutes } : { ...props }
  let ret = Component ? (
    <Suspense
      fallback={
        <div style={{ width: '100%', height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      }
    >
      <Component {...formativeProps}>{children}</Component>
    </Suspense>
  ) : (
    children
  )
  if (wrappers?.length) {
    let len = wrappers.length - 1
    while (len >= 0) {
      ret = createElement(wrappers[len] as any, formativeProps, ret)
      len -= 1
    }
  }
  return ret
}

type RenderRoutes = (
  routes: RouteConfig[],
  basename?: string,
  allRoutes?: RouteConfig[],
  extraParams?: { redirectComponent?: CElement<RedirectProps, Redirect>; useNotFoundComponent?: boolean },
) => CElement<SwitchProps, Switch>

export const renderRoutes: RenderRoutes = (routes = [], basename, allRoutes, extraParams = {}) => {
  const { redirectComponent, useNotFoundComponent = true } = extraParams
  return (
    <Switch key={uuid()}>
      {routes.map((route) => {
        const { menuKey, path, exact, strict, sensitive } = route
        if (path.startsWith('http')) return null
        return (
          <Route
            key={menuKey}
            {...{ path, exact, strict, sensitive }}
            render={(props) => renderRoute(route, props, allRoutes || route.routes, basename)}
          />
        )
      })}
      {redirectComponent}
      {useNotFoundComponent && <Route key={`${uuid()}-not-found`} component={NotFound} />}
    </Switch>
  )
}

export function flatRoutes(routes: RouteConfig[] = [], userAuthPoints?: string[]): Omit<RouteConfig, 'routes'>[] {
  return routes.reduce((flattedRoutes, route) => {
    const { authPoints, authOperator = 'or' } = route
    if (Array.isArray(authPoints) && Array.isArray(userAuthPoints)) {
      const isPass: boolean =
        (authOperator === 'or' && userAuthPoints.some((userAuthPoint) => authPoints.includes(userAuthPoint))) ||
        (authOperator === 'and' && authPoints.length > 0 && authPoints.every((authPoint) => userAuthPoints.includes(authPoint)))
      if (!isPass) return flattedRoutes
    }
    flattedRoutes = [...flattedRoutes, route, ...flatRoutes(route.routes, userAuthPoints)]
    return flattedRoutes
  }, [])
}
