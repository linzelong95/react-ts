import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/cate')

  newRouter.post('/list', controller.adminController.category.list)
  newRouter.post('/save', controller.adminController.category.save)
  newRouter.post('/delete', controller.adminController.category.delete)
  newRouter.post('/lock', controller.adminController.category.lock)
  newRouter.post('/unlock', controller.adminController.category.unlock)
}
