import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  router.redirect('/', '/index/', 302) // 首页
  // 水印图片接口
  // router.get('/watermark', controller.common.watermark.handle)
  router.get('/*', controller.home.index)
}
