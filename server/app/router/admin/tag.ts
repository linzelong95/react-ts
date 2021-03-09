import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/tag')

  newRouter.post('/list', controller.adminController.tag.list)
  newRouter.post('/save', controller.adminController.tag.save)
  newRouter.post('/delete', controller.adminController.tag.delete)
  newRouter.post('/lock', controller.adminController.tag.lock)
  newRouter.post('/unlock', controller.adminController.tag.unlock)
}
