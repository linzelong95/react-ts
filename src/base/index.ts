/**
 * 不需要频繁打包的基础模块(js、css)
 * 如 React, ReactDOM, Moment, 编辑器，UI库等库
 */
import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactRouter from 'react-router'
import * as ReactRouterDOM from 'react-router-dom'
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import XLSX from 'xlsx'
import axios from 'axios'
// import * as antd from 'antd'
// import zhCN from 'antd/lib/locale-provider/zh_CN'
// import * as Sentry from '@sentry/browser'

// 公共样式

// moment 设置语言
moment.locale('zh-cn')

// 注入全局变量
;(window as any).React = React
;(window as any).ReactDOM = ReactDOM
;(window as any).ReactRouter = ReactRouter
;(window as any).ReactRouterDOM = ReactRouterDOM
;(window as any).Redux = Redux
;(window as any).ReactRedux = ReactRedux
;(window as any)._ = _
;(window as any).moment = moment
;(window as any).XLSX = XLSX
;(window as any).axios = axios
// ;(window as any).antd = antd
// ;(window as any).antd_LOCALE_ZHCN = zhCN
// ;(window as any).Sentry = Sentry
