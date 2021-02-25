import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { ErrorBoundary, BasicLayout } from '@common/components'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import { renderRoutes } from '@common/utils'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import type { FC } from 'react'
import type { ProviderProps } from 'react-redux'
import type { RouteConfig } from '@common/types'

interface FrameworkOptions {
  // 应用名称
  appName: string
  // 应用基础路径
  basename: string
  // 路由
  routes?: RouteConfig[]
  // store
  store: ProviderProps['store']
}

const Framework: FC<FrameworkOptions> = (props) => {
  const { store, routes, basename } = props
  const { i18n } = useTranslation()

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter basename={basename}>
            <ConfigProvider locale={i18n.language === 'zh-CN' ? zhCN : enUS}>
              <BasicLayout routes={routes} basename={basename}>
                {renderRoutes(routes)}
              </BasicLayout>
            </ConfigProvider>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}

export default hot(Framework)
