import React, { createElement } from 'react'
import { Redirect, Route, Switch, SwitchProps } from 'react-router-dom'
import { NotFound } from '@common/components'
import { v4 as uuid } from 'uuid'
import type { RouteComponentProps } from 'react-router-dom'
import type { RouteConfig } from '@common/types'

function renderRoutes(routes: RouteConfig[], redirectComponent?: JSX.Element): React.CElement<SwitchProps, Switch> {
  if (!routes?.length) return redirectComponent
  return (
    <Switch key={uuid()}>
      {routes.map((route, index) => {
        const { path, exact, strict, sensitive } = route
        return (
          <Route
            key={`${uuid()}-${path || index}`}
            {...{ path, exact, strict, sensitive }}
            render={(props: RouteComponentProps<any>) => render({ route, props })}
          />
        )
      })}
      {redirectComponent}
      <Route key={`${uuid()}-not-found`} component={NotFound} />
    </Switch>
  )
}

function render({ route, props }: { route: RouteConfig; props: RouteComponentProps<any> }): JSX.Element {
  const { component: Component, redirect, path, wrappers } = route
  const newProps = { ...props } // 可以注入额外的属性，如果需要的话
  const redirectComponent = redirect && <Redirect key={`${uuid()}-redirect`} exact from={path} to={redirect} />
  const children = renderRoutes(route.routes, redirectComponent)
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

export { renderRoutes }
