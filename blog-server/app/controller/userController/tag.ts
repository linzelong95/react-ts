// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/user/tag")
// export class userTagController {

//   @inject()
//   userTagService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [] }, index = 1, size = 10 } = ctx.request.body;
//     const [list, total] = await this.userTagService.list({ isEnable, name, orderBy, index, size, sortIdsArr });
//     ctx.body = { list, total };
//   }

// }
