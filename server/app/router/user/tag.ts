import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/tag')

  newRouter.post('/list', controller.userController.tag.list)
}