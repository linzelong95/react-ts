import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/course')

  newRouter.post('/list', controller.userController.course.list)
}
