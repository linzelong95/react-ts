import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from '@common/utils'
import { hot } from 'react-hot-loader/root'
import { ErrorBoundary } from '@common/components'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import type { FC } from 'react'
import type { ProviderProps } from 'react-redux'
import type { RouteConfig } from '@common/types'

interface FrameworkOptions {
  // 应用基础路径
  basename?: string
  // 路由
  routes?: RouteConfig[]
  // store
  store: ProviderProps['store']
  // 隐藏头部和菜单
  hideAll?: boolean
  // 只隐藏头部
  hideHeader?: boolean // 优先级高于hideAll
  // 只隐藏尾部
  hideFooter?: boolean // 优先级高于hideAll
  // 只隐藏菜单
  hideMenu?: boolean // 优先级高于hideAll
}

const Framework: FC<FrameworkOptions> = (props) => {
  const { store, basename = '/', ...restProps } = props
  const { i18n } = useTranslation()

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter basename={basename}>
            <ConfigProvider locale={i18n.language === 'zh-CN' ? zhCN : enUS}>
              {renderRoutes({
                basename,
                ...restProps,
              })}
            </ConfigProvider>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}

export default hot(Framework)
