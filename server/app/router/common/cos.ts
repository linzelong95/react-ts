import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/cos')

  newRouter.post('/auth', controller.commonController.cos.auth)
}
