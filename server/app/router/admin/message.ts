import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/message')

  newRouter.post('/list', controller.adminController.message.list)
  newRouter.post('/save', controller.adminController.message.save)
  newRouter.post('/delete', controller.adminController.message.delete)
  newRouter.post('/top', controller.adminController.message.top)
  newRouter.post('/unTop', controller.adminController.message.unTop)
  newRouter.post('/approve', controller.adminController.message.approve)
  newRouter.post('/disapprove', controller.adminController.message.disapprove)
}
