// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/admin/message")
// export class AdminMessageController {

//   @inject()
//   adminMessageService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body;
//     const { message = "", orderBy = {}, isTop, isApproved, isRoot, prettyFormat } = conditionQuery;
//     const [list, total] = await this.adminMessageService.list({ message, orderBy, index, size, isTop, isApproved, isRoot });
//     let newList = [...list];
//     if (prettyFormat) {
//       const parentArr = [];
//       const sonArr = [];
//       list.forEach(i => {
//         if (!i.parentId) {
//           parentArr.push({ ...i, children: [] });
//         } else {
//           sonArr.push(i);
//         }
//       });
//       newList = parentArr.map(i => {
//         sonArr.forEach(v => {
//           if (v.parentId === i.id) i.children = [...i.children, v];
//         });
//         return i;
//       });
//     }
//     ctx.body = { list: newList, total };
//   }

//   @post("/insert")
//   async save(ctx): Promise<void> {
//     const { user: { id: userId } } = ctx.state;
//     const { id, message, blog = "", fromMail = "无", toMail = "无", parentId = 0, fromId = userId, toId, isApproved = 1 } = ctx.request.body;
//     const params: any = { id, message, parentId, isApproved, blog, fromMail, toMail };
//     if (fromId) params.from = { id: fromId };
//     if (toId) params.to = { id: toId };
//     console.log(params)
//     const flag = await this.adminMessageService.save(params);
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
//     const idsArr = items.map(i => i.id);
//     const parentIdsArr = [];
//     items.forEach(i => {
//       if (i.parentId === 0) parentIdsArr.push(i.id);
//     });
//     const flag = await this.adminMessageService.delete({ idsArr, parentIdsArr });
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `删除失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `删除成功`, flag };
//   }

//   @post("/approve")
//   async approve(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminMessageService.approve(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `操作失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `评论已通过`, flag };
//   }

//   @post("/disapprove")
//   async disapprove(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminMessageService.disapprove(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `操作失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `评论已设置为不通过`, flag };
//   }

//   @post("/top")
//   async top(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminMessageService.top(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `置顶失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `置顶成功`, flag };
//   }

//   @post("/untop")
//   async untop(ctx): Promise<void> {
//     const { items } = ctx.request.body;
//     const ids = items.map(i => i.id);
//     const flag = await this.adminMessageService.untop(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `取置失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `取置成功`, flag };
//   }

// }
