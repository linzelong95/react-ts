import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  router.redirect('/', '/blog/article', 302)
  // router.get('/watermark', controller.common.watermark.handle)  // 水印图片接口
  router.get('/*', controller.home.index)
}
