import { Controller } from 'egg'
const path = require('path')
const fs = require('fs')

const MANIFEST_ROOT = path.resolve(__dirname, '../manifest')

interface RenderData {
  jsList: string[]
  cssList: string[]
  title: string
  keywords: string
  description: string
  favicon: string
  initialState: {
    release?: string
    showWaterMark: boolean
  }
}
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this
    let currentUrl = ctx.path
    if (/^\/(public|api)/.test(currentUrl)) return
    if (currentUrl === '/') currentUrl = '/blog-admin'
    const moduleName = currentUrl.split('/')[1]
    const moduleStatics = this.getModuleStatics(moduleName)
    if (!moduleStatics?.js?.path) return
    const baseStatics = this.getModuleStatics('base')
    const renderData: RenderData = {
      jsList: [moduleStatics.js.path],
      cssList: [],
      initialState: { release: moduleStatics.js.release, showWaterMark: false },
      title: 'blog',
      keywords: 'blog',
      description: 'This is a blog',
      favicon: '',
    }
    if (baseStatics?.js?.path) renderData.jsList.unshift(baseStatics.js.path)
    if (baseStatics?.css?.path) renderData.cssList.push(baseStatics.css.path)
    if (moduleStatics?.css?.path) renderData.cssList.push(moduleStatics.css.path)
    return ctx.render('index.ejs', renderData)
  }

  // 获取 App 的静态资源
  getModuleStatics(moduleName): Record<'js' | 'css', { path: string; release: string; editor: string }> | null {
    const appManifestPath = path.resolve(MANIFEST_ROOT, `${moduleName}.manifest.json`)
    if (!fs.existsSync(appManifestPath)) return null
    return {
      js: require(appManifestPath)[`${moduleName}.js`],
      css: require(appManifestPath)[`${moduleName}.css`],
    } as Record<'js' | 'css', { path: string; release: string; editor: string }>
  }
}
