// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/admin/cate")
// export class AdminCategoryController {

//   @inject()
//   adminCategoryService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [], id }, index = 1, size = 10 } = ctx.request.body;
//     const [list, total] = await this.adminCategoryService.list({ isEnable, name, orderBy, index, size, sortIdsArr, id });
//     ctx.body = { list, total };
//   }

//   @post("/insert")
//   @post("/update")
//   async save(ctx): Promise<void> {
//     const { id, name, isEnable, sortId } = ctx.request.body;
//     const flag = await this.adminCategoryService.save({ id, name, isEnable, sort: { id: sortId } });
//     const action = id ? "更新" : "添加";
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `${action}失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `${action}成功`, flag };
//   }

//   @post("/delete")
//   async delete(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminCategoryService.delete(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `删除失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `删除成功`, flag };
//   }

//   @post("/lock")
//   async lock(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminCategoryService.lock(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `禁用失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `禁用成功`, flag };
//   }

//   @post("/unlock")
//   async unlock(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminCategoryService.unlock(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `启用失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `启用成功`, flag };
//   }

// }
