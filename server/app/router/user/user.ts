import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/account')

  newRouter.get('/list', controller.userController.user.list)
}
