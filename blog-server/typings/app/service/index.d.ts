// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportAdminServiceArticle from '../../../app/service/adminService/article';
import ExportAdminServiceCategory from '../../../app/service/adminService/category';
import ExportAdminServiceMessage from '../../../app/service/adminService/message';
import ExportAdminServiceReply from '../../../app/service/adminService/reply';
import ExportAdminServiceSort from '../../../app/service/adminService/sort';
import ExportAdminServiceTag from '../../../app/service/adminService/tag';
import ExportUserServiceArticle from '../../../app/service/userService/article';
import ExportUserServiceMessage from '../../../app/service/userService/message';
import ExportUserServiceReply from '../../../app/service/userService/reply';
import ExportUserServiceSort from '../../../app/service/userService/sort';
import ExportUserServiceTag from '../../../app/service/userService/tag';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    adminService: {
      article: AutoInstanceType<typeof ExportAdminServiceArticle>;
      category: AutoInstanceType<typeof ExportAdminServiceCategory>;
      message: AutoInstanceType<typeof ExportAdminServiceMessage>;
      reply: AutoInstanceType<typeof ExportAdminServiceReply>;
      sort: AutoInstanceType<typeof ExportAdminServiceSort>;
      tag: AutoInstanceType<typeof ExportAdminServiceTag>;
    }
    userService: {
      article: AutoInstanceType<typeof ExportUserServiceArticle>;
      message: AutoInstanceType<typeof ExportUserServiceMessage>;
      reply: AutoInstanceType<typeof ExportUserServiceReply>;
      sort: AutoInstanceType<typeof ExportUserServiceSort>;
      tag: AutoInstanceType<typeof ExportUserServiceTag>;
    }
  }
}
