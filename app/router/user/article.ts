import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/article')

  newRouter.post('/list', controller.userController.article.list)
  newRouter.post('/content', controller.userController.article.content)
}
