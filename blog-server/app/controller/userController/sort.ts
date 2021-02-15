// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/user/sort")
// export class UserSortController {

//   @inject()
//   userSortService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery: { isEnable, name = "", orderBy: orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
//     const [list, total] = await this.userSortService.list({ isEnable, name, orderBy, index, size });
//     ctx.body = { list, total };
//   }

// }
