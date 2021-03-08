import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/sort')

  newRouter.post('/list', controller.adminController.sort.list)
  newRouter.post('/save', controller.adminController.sort.save)
  newRouter.post('/delete', controller.adminController.sort.delete)
  newRouter.post('/lock', controller.adminController.sort.lock)
  newRouter.post('/unlock', controller.adminController.sort.unlock)
}
