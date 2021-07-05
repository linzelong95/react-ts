import { render } from 'react-dom'
import { ReducersMapObject } from 'redux'
// import { init } from '@sentry/browser'
import Framework from './framework'
import getCombinedStore from '@common/store'
import { NotFound } from '@common/components'
import type { RouteConfig } from '@common/types'

interface RenderAppProps {
  // 应用基础路径
  basename?: string
  // 路由
  routes?: RouteConfig[]
  // 隐藏头部和菜单
  hideAll?: boolean
  // 只隐藏头部
  hideHeader?: boolean // 优先级高于hideAll
  // 只隐藏尾部
  hideFooter?: boolean // 优先级高于hideAll
  // 只隐藏菜单
  hideMenu?: boolean // 优先级高于hideAll
  // redux reducer
  reducerMap?: ReducersMapObject
  // redux state
  initialStateMap?: Record<string, Record<string, any>>
}

function renderApp(options: RenderAppProps): void {
  const { reducerMap = {}, initialStateMap = {}, ...frameworkOptions } = options
  const { basename = '/' } = frameworkOptions
  const { pathname } = window.location

  if (!pathname.startsWith(basename) && !(window as any).__LOCK__) {
    render(<NotFound />, document.querySelector('#root'))
    return
  }

  console.log(`当前渲染 App 路径为：${basename}`)

  // 开发环境下，可能同时启动多个模块，但NotFound最多只需要渲染一次
  if (__IS_DEV_MODE__) (window as any).__LOCK__ = basename

  const store = getCombinedStore(reducerMap, initialStateMap)

  // 初始化 sentry
  // const dsn = (window as any).__INITIAL_STATE__.sentry.dsn
  // const release = (window as any).__INITIAL_STATE__.release
  // if (dsn && release) init({ dsn, release })

  render(
    <Framework key={basename} {...frameworkOptions} store={store} />,
    document.querySelector('#root'),
  )
}

export default renderApp
