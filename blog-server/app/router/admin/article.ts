import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/article')

  newRouter.post('/list', controller.adminController.article.list)
  newRouter.post('/content', controller.adminController.article.content)
  newRouter.post('/insert', controller.adminController.article.save)
  newRouter.post('/update', controller.adminController.article.save)
  newRouter.post('/delete', controller.adminController.article.delete)
  newRouter.post('/lock', controller.adminController.article.lock)
  newRouter.post('/unlock', controller.adminController.article.unlock)
  newRouter.post('/top', controller.adminController.article.top)
  newRouter.post('/unTop', controller.adminController.article.unTop)
}
