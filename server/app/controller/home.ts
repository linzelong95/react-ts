import { Controller } from 'egg'
const path = require('path')
const fs = require('fs')

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
    const { sentry } = config
    let currentUrl = ctx.path
    if (/^\/(public|api)/.test(currentUrl)) return
    const moduleName = currentUrl.split('/')[1]
    const moduleStatics = getModuleStatics(moduleName)
    if (!moduleStatics?.js?.path) return
    const baseStatics = getModuleStatics('base')
    const renderData: RenderData = {
      jsList: [moduleStatics.js.path],
      cssList: [],
      initialState: { user: ctx.state.user || {}, sentry, release: moduleStatics.js.release, showWaterMark: false },
      title: 'blog',
      keywords: 'blog',
      description: 'This is a blog',
      favicon: '',
    }
    if (baseStatics?.js?.path) renderData.jsList.unshift(baseStatics.js.path)
    if (baseStatics?.css?.path) renderData.cssList.push(baseStatics.css.path)
    if (moduleStatics?.css?.path) renderData.cssList.push(moduleStatics.css.path)
    ctx.render('index.ejs', renderData)
  }
}
