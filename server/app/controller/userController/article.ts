// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/user/article")
// export class UserArticleController {

//   @inject()
//   userArticleService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery: { title = "", orderBy = {}, category = {}, tagIdsArr = [], articleId }, index = 1, size = 10 } = ctx.request.body;
//     const [list, total] = await this.userArticleService.list({ articleId, title, orderBy, index, size, category, tagIdsArr });
//     ctx.body = { list, total };
//   }

//   @post("/content")
//   async content(ctx) {
//     const { articleId } = ctx.request.body;
//     const content = await this.userArticleService.content({ articleId });
//     ctx.body = { "list": content };
//   }

// }
