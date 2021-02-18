// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/user/course")
// export class UserCourseController {

//     @inject()
//     userArticleService;

//     @post("/list")
//     async list(ctx): Promise<void> {
//         const { conditionQuery: { title = "", orderBy = { name: "createDate", by: "DESC" }, category = {}, tagIdsArr = [], articleId }, index = 1, size = 10 } = ctx.request.body;
//         const [list, total] = await this.userArticleService.list({ articleId, title, orderBy, index, size, category, tagIdsArr });
//         ctx.body = { list, total };
//     }
// }
