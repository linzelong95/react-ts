import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/reply')

  newRouter.post('/list', controller.userController.reply.list)
  newRouter.post('/save', controller.userController.reply.save)
  newRouter.post('/delete', controller.userController.reply.delete)
}
