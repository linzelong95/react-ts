import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/message')

  newRouter.post('/list', controller.userController.message.list)
  newRouter.post('/save', controller.userController.message.save)
  newRouter.post('/delete', controller.userController.message.delete)
}
