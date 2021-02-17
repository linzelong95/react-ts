import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/sort')

  newRouter.post('/list', controller.adminController.sort.list)
  newRouter.post('/insert', controller.adminController.sort.save)
  newRouter.post('/update', controller.adminController.sort.save)
  newRouter.post('/delete', controller.adminController.sort.delete)
  newRouter.post('/lock', controller.adminController.sort.lock)
  newRouter.post('/unlock', controller.adminController.sort.unlock)
}
