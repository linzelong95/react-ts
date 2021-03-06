import { Controller } from 'egg'
const path = require('path')
const fs = require('fs')
const glob = require('glob')

const PUBLIC_ROOT = path.resolve(__dirname, `../public`)

type ModuleStatics = Record<'js' | 'runtimeJs' | 'css', { path: string; release: string; editor: string }> | null

interface RenderData {
  jsList: string[]
  cssList: string[]
  title: string
  keywords: string
  description: string
  favicon: string
  initialState: {
    sentry: { dns: string }
    release?: string
    showWaterMark: boolean
    user?: {
      account: string
      nickname: string
      roleName: 'admin' | 'user'
    }
  }
}

function getModuleStatics(moduleName: string): ModuleStatics {
  const appManifestPath = path.resolve(__dirname, `../manifest/${moduleName}.manifest.json`)
  if (!fs.existsSync(appManifestPath)) return null
  return {
    js: require(appManifestPath)[`${moduleName}.js`],
    runtimeJs: require(appManifestPath)[`${moduleName}/runtime~${moduleName}.js`],
    css: require(appManifestPath)[`${moduleName}.css`],
  }
}
export default class HomeController extends Controller {
  public async index(): Promise<unknown> {
    const { ctx, config } = this
    const { sentry, env, backSysNames, locals, cluster = {} } = config
    const { request, state, path } = ctx
    if (/^\/(public|api)/.test(path)) return
    const { host } = request?.header || {}
    const [, moduleName] = path.split('/')
    if (backSysNames.includes(moduleName) && !state?.user) {
      ctx.redirect(`/account/login?redirect=${encodeURIComponent(path)}`)
      return
    }
    const moduleStatics = getModuleStatics(moduleName)
    if (!moduleStatics?.js?.path) return
    const baseStatics = getModuleStatics('base')
    const renderData: RenderData = {
      jsList: [],
      cssList: moduleStatics?.css?.path ? [moduleStatics.css.path] : [],
      initialState: { user: state.user || {}, sentry, release: moduleStatics.js.release, showWaterMark: false },
      title: 'blog',
      keywords: 'blog',
      description: 'This is a blog',
      favicon: '',
      ...locals, // title,keywords,description,favicon
    }
    const isSameHost = host.endsWith(String(cluster?.listen?.port || ''))
    if (env !== 'prod' && moduleStatics.js.path.startsWith('http') && isSameHost) {
      // TODO:确保react、react-dom在最前面
      glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).forEach((path) => {
        renderData.jsList.push(`/public/${path.split('/').slice(-2).join('/')}`)
      })
    } else if (baseStatics?.js?.path) {
      renderData.jsList.unshift(baseStatics.js.path)
    }
    if (baseStatics?.css?.path) renderData.cssList.unshift(baseStatics.css.path)
    if (moduleStatics.js?.path) {
      renderData.jsList.push(moduleStatics.js.path)
      if (moduleStatics.runtimeJs?.path) renderData.jsList.push(moduleStatics.runtimeJs.path)
    }
    return ctx.render('index.ejs', renderData)
  }
}
