// import { provide, controller, post, inject } from "midway";
// import { getClientIP } from "../../../utils/utils"

// @provide()
// @controller("/user/message")
// export class UserMessageController {

//   @inject()
//   userMessageService;

//   @post("/list")
//   async list(ctx): Promise<void> {
//     const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body;
//     const { message = "", orderBy = {}, isTop, isApproved, prettyFormat } = conditionQuery;
//     const [list, total] = await this.userMessageService.list({ message, orderBy, index, size, isTop, isApproved });
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
//     console.log(111111, getClientIP(ctx.req))
//     const { id, message, blog = "", fromMail = "无", toMail = "无", parentId = 0, fromId, toId, isApproved = 0 } = ctx.request.body;
//     const params: any = { id, message, parentId, isApproved, blog, fromMail, toMail };
//     if (fromId) params.from = { id: fromId };
//     if (toId) params.to = { id: toId };
//     const flag = await this.userMessageService.save(params);
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
//     const flag = await this.userMessageService.delete({ idsArr, parentIdsArr });
//     if (!flag) {
//       ctx.status = 400;
//       ctx.body = { message: `删除失败`, flag };
//       return;
//     }
//     ctx.status = 200;
//     ctx.body = { message: `删除成功`, flag };
//   }
// }
