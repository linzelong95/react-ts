import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/account')

  newRouter.post('/login', controller.accountController.account.login)
  newRouter.post('/logout', controller.accountController.account.logout)
  newRouter.post('/register', controller.accountController.account.register)
  newRouter.post('/getCaptcha', controller.accountController.account.getCaptcha)
  newRouter.post('/getPublicKey', controller.accountController.account.getPublicKey)
  newRouter.post('/verifyCaptcha', controller.accountController.account.verifyCaptcha)
}
