import type { ReactNode } from 'react'
import type { RouteProps } from 'react-router-dom'

export interface RouteConfig extends Omit<RouteProps, 'path' | 'children' | 'render'> {
  path?: string
  redirect?: string
  routes?: RouteConfig[]
  wrappers?: ReactNode[]
}
