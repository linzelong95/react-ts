import { Controller } from 'egg'
const path = require('path')
const fs = require('fs')
const glob = require('glob')

const PUBLIC_ROOT = path.resolve(__dirname, `../public`)

function getModuleStatics(moduleName): Record<'js' | 'css', { path: string; release: string; editor: string }> | null {
  const appManifestPath = path.resolve(__dirname, `../manifest/${moduleName}.manifest.json`)
  if (!fs.existsSync(appManifestPath)) return null
  return {
    js: require(appManifestPath)[`${moduleName}.js`],
    css: require(appManifestPath)[`${moduleName}.css`],
  } as Record<'js' | 'css', { path: string; release: string; editor: string }>
}

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
      nickName: string
      roleName: 'admin' | 'user'
    }
  }
}

export default class HomeController extends Controller {
  public async index() {
    const { ctx, config } = this
    const { sentry, env, backgroundSystemNames, cluster } = config
    const { originalUrl, request, state, path } = ctx
    if (/^\/(public|api)/.test(path)) return
    const { referer, host } = request?.header || {}
    const [, moduleName] = path.split('/')
    if (backgroundSystemNames.includes(moduleName) && !state?.user) {
      ctx.redirect(`/user/login?redirect=${referer || originalUrl}`)
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
    }
    if (env !== 'prod') {
      // TODO:确保react、react-dom在最前面
      glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).forEach((path) => {
        const publicPath = host.endsWith(String(cluster?.listen?.port)) ? '/public' : ''
        renderData.jsList.push(`${publicPath}/${path.split('/').slice(-2).join('/')}`) // '/dll/xxx.js'
      })
    }
    renderData.jsList.push(moduleStatics.js.path)
    if (baseStatics?.css?.path) renderData.cssList.unshift(baseStatics.css.path)
    if (env === 'prod' && baseStatics?.js?.path) renderData.jsList.unshift(baseStatics.js.path)
    return ctx.render('index.ejs', renderData) // don't forget 'return'
  }
}
