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
import moment from 'moment'
import XLSX from 'xlsx'
import axios from 'axios'
import * as antd from 'antd'
import i18next from 'i18next'
import * as reactI18next from 'react-i18next'
import antd_enUS from 'antd/lib/locale/en_US'
import antd_zhCN from 'antd/lib/locale/zh_CN'
// import * as Sentry from '@sentry/browser'

// 公共样式

// 注入全局变量
;(window as any).React = React
;(window as any).ReactDOM = ReactDOM
;(window as any).ReactRouter = ReactRouter
;(window as any).ReactRouterDOM = ReactRouterDOM
;(window as any).Redux = Redux
;(window as any).ReactRedux = ReactRedux
;(window as any).moment = moment
;(window as any).XLSX = XLSX
;(window as any).axios = axios
;(window as any).antd = antd
;(window as any).i18next = i18next
;(window as any).reactI18next = reactI18next
;(window as any).antd_enUS = antd_enUS
;(window as any).antd_zhCN = antd_zhCN
// ;(window as any).Sentry = Sentry
