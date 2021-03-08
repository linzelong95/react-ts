import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/sort')

  newRouter.post('/list', controller.userController.sort.list)
}
