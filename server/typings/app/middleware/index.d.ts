// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportNext from '../../../app/middleware/next';
import ExportPassport from '../../../app/middleware/passport';
import ExportRequest from '../../../app/middleware/request';
import ExportResponse from '../../../app/middleware/response';

declare module 'egg' {
  interface IMiddleware {
    next: typeof ExportNext;
    passport: typeof ExportPassport;
    request: typeof ExportRequest;
    response: typeof ExportResponse;
  }
}
