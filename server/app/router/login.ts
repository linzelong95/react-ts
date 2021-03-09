import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app
  const newRouter = router.namespace('/api/account')

  newRouter.get('/info', controller.accountController.account.info)
  newRouter.post('/login', controller.accountController.account.login)
  newRouter.post('/logout', controller.accountController.account.logout)
  newRouter.post('/register', controller.accountController.account.register)
  newRouter.get('/getCaptcha', controller.accountController.account.getCaptcha)
  newRouter.get('/getPublicKey', controller.accountController.account.getPublicKey)
  newRouter.post('/verifyCaptcha', controller.accountController.account.verifyCaptcha)
}
