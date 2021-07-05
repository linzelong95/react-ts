import { Suspense, createElement, isValidElement, cloneElement } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Spin } from 'antd'
import { NotFound } from '@common/components'
import { v4 as uuid } from 'uuid'
import type { CElement } from 'react'
import type { SwitchProps, RedirectProps, RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

type CommonParams = {
  basename: string
  allRoutes?: RouteConfig[]
  // 隐藏头部、菜单、脚部
  hideAll?: boolean
  // 只隐藏头部
  hideHeader?: boolean // 优先级高于hideAll
  // 只隐藏尾部
  hideFooter?: boolean // 优先级高于hideAll
  // 只隐藏菜单
  hideMenu?: boolean // 优先级高于hideAll
}

type RenderRoute = (
  params: {
    route: RouteConfig
    props: RouteComponentProps
  } & CommonParams,
) => JSX.Element

type RenderRoutes = (
  params: {
    routes?: RouteConfig[]
    redirectComponent?: CElement<RedirectProps, Redirect>
    useNotFoundComponent?: boolean
  } & CommonParams,
) => CElement<SwitchProps, Switch>

const renderRoute: RenderRoute = (params) => {
  const { route, props, allRoutes, basename, ...restParams } = params
  const { component: Component, routes, redirect, path, wrappers } = route
  const redirectComponent = redirect && (
    <Redirect key={`${uuid()}-redirect`} exact from={path} to={redirect} />
  )
  const useNotFoundComponent = !Component || Boolean(routes?.length)
  const children = renderRoutes({
    routes,
    basename,
    allRoutes,
    redirectComponent,
    useNotFoundComponent,
  })
  const formativeProps =
    path === '/' && Component
      ? { basename, routes: allRoutes, ...restParams, ...props }
      : { ...props }
  let ret = Component ? (
    <Suspense fallback={<Spin size="large" style={{ marginTop: 50 }} />}>
      {isValidElement(Component) ? (
        cloneElement(Component as any, formativeProps, children)
      ) : (
        <Component {...formativeProps}>{children}</Component>
      )}
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

export const renderRoutes: RenderRoutes = (params) => {
  const {
    routes = [],
    allRoutes,
    redirectComponent,
    useNotFoundComponent = true,
    ...resParams
  } = params
  return (
    <Switch key={uuid()}>
      {routes.map((route) => {
        const { menuKey, path, exact, strict, sensitive } = route
        if (path.startsWith('http')) return null
        return (
          <Route
            key={menuKey}
            {...{ path, exact, strict, sensitive }}
            render={(props) =>
              renderRoute({
                route,
                props,
                allRoutes: allRoutes || route.routes,
                ...resParams,
              })
            }
          />
        )
      })}
      {redirectComponent}
      {useNotFoundComponent && <Route key={`${uuid()}-not-found`} component={NotFound} />}
    </Switch>
  )
}

export function flatRoutes(
  routes: RouteConfig[] = [],
  userAuthPoints?: string[],
): Omit<RouteConfig, 'routes'>[] {
  return routes.reduce((flattedRoutes, route) => {
    const { authPoints, authOperator = 'or' } = route
    if (Array.isArray(authPoints) && Array.isArray(userAuthPoints)) {
      const isPass: boolean =
        (authOperator === 'or' &&
          userAuthPoints.some((userAuthPoint) => authPoints.includes(userAuthPoint))) ||
        (authOperator === 'and' &&
          authPoints.length > 0 &&
          authPoints.every((authPoint) => userAuthPoints.includes(authPoint)))
      if (!isPass) return flattedRoutes
    }
    flattedRoutes = [...flattedRoutes, route, ...flatRoutes(route.routes, userAuthPoints)]
    return flattedRoutes
  }, [])
}
