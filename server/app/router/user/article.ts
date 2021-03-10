import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/user/article')

  newRouter.get('/list', controller.userController.article.list)
  newRouter.get('/content', controller.userController.article.content)
}
