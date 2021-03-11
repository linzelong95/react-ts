// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg'
import ExportHome from '../../../app/controller/home'
import ExportAccountControllerAccount from '../../../app/controller/accountController/account'
import ExportAdminControllerArticle from '../../../app/controller/adminController/article'
import ExportAdminControllerCategory from '../../../app/controller/adminController/category'
import ExportAdminControllerMessage from '../../../app/controller/adminController/message'
import ExportAdminControllerReply from '../../../app/controller/adminController/reply'
import ExportAdminControllerSort from '../../../app/controller/adminController/sort'
import ExportAdminControllerTag from '../../../app/controller/adminController/tag'
import ExportCommonControllerCos from '../../../app/controller/commonController/cos'
import ExportUploadControllerUpload from '../../../app/controller/uploadController/upload'
import ExportUserControllerArticle from '../../../app/controller/userController/article'
import ExportUserControllerCourse from '../../../app/controller/userController/course'
import ExportUserControllerMessage from '../../../app/controller/userController/message'
import ExportUserControllerReply from '../../../app/controller/userController/reply'
import ExportUserControllerSort from '../../../app/controller/userController/sort'
import ExportUserControllerTag from '../../../app/controller/userController/tag'
import ExportUserControllerUser from '../../../app/controller/userController/user'

declare module 'egg' {
  interface IController {
    home: ExportHome
    accountController: {
      account: ExportAccountControllerAccount
    }
    adminController: {
      article: ExportAdminControllerArticle
      category: ExportAdminControllerCategory
      message: ExportAdminControllerMessage
      reply: ExportAdminControllerReply
      sort: ExportAdminControllerSort
      tag: ExportAdminControllerTag
    }
    commonController: {
      cos: ExportCommonControllerCos
    }
    uploadController: {
      upload: ExportUploadControllerUpload
    }
    userController: {
      article: ExportUserControllerArticle
      course: ExportUserControllerCourse
      message: ExportUserControllerMessage
      reply: ExportUserControllerReply
      sort: ExportUserControllerSort
      tag: ExportUserControllerTag
      user: ExportUserControllerUser
    }
  }
}
