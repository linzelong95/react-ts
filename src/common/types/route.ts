import type { ReactNode } from 'react'
import type { RouteProps } from 'react-router-dom'

export interface RouteConfig extends Omit<RouteProps, 'path' | 'children' | 'render'> {
  path?: string
  redirect?: string
  routes?: RouteConfig[]
  wrappers?: ReactNode[]
  authPoints?: string[]
  authOperator?: 'or' | 'and'
}

// blog.super_admin-is
// blog.personal_admin-is

// 标签管理模块
// blog.tab-all // all rights
// blog.tab-r // read
// blog.tab-a // add
// blog.tab-u // update
// blog.tab-d // delete
