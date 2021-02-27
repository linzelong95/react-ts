import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/admin/reply')

  newRouter.post('/list', controller.adminController.reply.list)
  newRouter.post('/save', controller.adminController.reply.save)
  newRouter.post('/delete', controller.adminController.reply.delete)
  newRouter.post('/top', controller.adminController.reply.top)
  newRouter.post('/unTop', controller.adminController.reply.unTop)
  newRouter.post('/approve', controller.adminController.reply.approve)
  newRouter.post('/disapprove', controller.adminController.reply.disapprove)
}
