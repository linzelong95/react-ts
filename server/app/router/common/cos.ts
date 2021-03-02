import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/cos')

  newRouter.post('/auth', controller.commonController.cosController.auth)
}
