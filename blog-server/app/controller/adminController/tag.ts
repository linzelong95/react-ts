// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/admin/tag")
// export class AdminTagController {

//   @inject()
//   adminTagService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [] }, index = 1, size = 10 } = ctx.request.body;
//     const [list, total] = await this.adminTagService.list({ isEnable, name, orderBy, index, size, sortIdsArr });
//     ctx.body = { list, total };
//   }

//   @post("/insert")
//   @post("/update")
//   async save(ctx): Promise<void> {
//     const { id, name, isEnable, sortId } = ctx.request.body;
//     const { flag, entity } = await this.adminTagService.save({ id, name, isEnable, sort: { id: sortId } });
//     const action = id ? "更新" : "添加";
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `${action}失败`, flag, entity };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `${action}成功`, flag, entity };
//   }

//   @post("/delete")
//   async delete(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminTagService.delete(ids);
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
//     const flag = await this.adminTagService.lock(ids);
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
//     const flag = await this.adminTagService.unlock(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `启用失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `启用成功`, flag };
//   }

// }
