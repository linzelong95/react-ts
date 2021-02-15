// import { provide, controller, post, inject } from "midway";

// @provide()
// @controller("/admin/reply")
// export class AdminReplyController {

//   @inject()
//   adminReplyService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body;
//     const { reply = "", orderBy = {}, category = {}, articleIdsArr = [], isTop, isApproved, isRoot, prettyFormat } = conditionQuery;
//     const [list, total] = await this.adminReplyService.list({ reply, orderBy, index, size, category, articleIdsArr, isTop, isApproved, isRoot });
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
//   @post("/update")
//   async save(ctx): Promise<void> {
//     const { user: { id: userId } } = ctx.state;
//     const { id, reply, parentId = 0, fromId = userId, toId = userId, articleId, isApproved = 1 } = ctx.request.body;
//     const flag = await this.adminReplyService.save({ id, reply, parentId, from: { id: fromId }, to: { id: toId }, isApproved, article: { id: articleId } });
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
//     const flag = await this.adminReplyService.delete({ idsArr, parentIdsArr });
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
//     const flag = await this.adminReplyService.approve(ids);
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
//     const flag = await this.adminReplyService.disapprove(ids);
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
//     const flag = await this.adminReplyService.top(ids);
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
//     const flag = await this.adminReplyService.untop(ids);
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `取置失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `取置成功`, flag };
//   }

// }
