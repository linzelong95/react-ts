// import { provide } from 'midway';
// import { getRepository } from "typeorm";
// import { Message } from "../../entity/Message";
// import { OrderByCondition } from "../../interface";

// @provide()
// export class AdminMessageService {

//   repository = getRepository(Message);

//   async list(options) {
//     const { message, orderBy, index, size, isTop, isApproved, isRoot } = options;
//     const orderByMap: OrderByCondition = {};
//     if (orderBy.name && ["isApproved", "isTop", "createDate", "updateDate"].includes(orderBy.name)) orderByMap[`message.${orderBy.name}`] = orderBy.by;
//     if (!orderBy.name || !["isTop"].includes(orderBy.name)) orderByMap["message.isTop"] = "DESC";
//     if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name)) orderByMap["message.createDate"] = "ASC";
//     return await this.repository
//       .createQueryBuilder("message")
//       .leftJoinAndSelect("message.from", "fromUser")
//       .leftJoinAndSelect("message.to", "toUser")
//       .where("message.message like :message", { message: `%${message}%` })
//       .andWhere(isApproved !== undefined ? `message.isApproved=${isApproved}` : "1=1")
//       .andWhere(isTop !== undefined ? `message.isTop=${isTop}` : "1=1")
//       .andWhere(isRoot !== undefined ? isRoot === 0 ? "message.parentId>0" : "message.parentId=0" : "1=1")
//       .orderBy(orderByMap)
//       .skip((index - 1) * size)
//       .take(size)
//       .getManyAndCount();
//   }

//   async save(options) {
//     let flag = true;
//     const replyEntity = this.repository.create({ ...options });
//     await this.repository.save(replyEntity).catch(e => { flag = false });
//     return flag;
//   }

//   async delete(options) {
//     const { idsArr, parentIdsArr } = options;
//     let flag = true;
//     const result = await this.repository
//       .createQueryBuilder()
//       .delete()
//       .from(Message)
//       .where(`id in (${idsArr.join(",")}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(",")})` : ""}`)
//       .execute();
//     if (!result.raw.affectedRows) {
//       flag = false;
//     }
//     return flag;
//   }

//   async approve(ids: number[]) {
//     let flag = true;
//     const result = await this.repository
//       .createQueryBuilder()
//       .update(Message)
//       .set({ isApproved: 1 })
//       .where("id in (:...ids)", { ids })
//       .execute();
//     if (!result.raw.affectedRows) {
//       flag = false;
//     }
//     return flag;
//   }

//   async disapprove(ids: number[]) {
//     let flag = true;
//     const result = await this.repository
//       .createQueryBuilder()
//       .update(Message)
//       .set({ isApproved: 0 })
//       .where("id in (:...ids)", { ids })
//       .execute();
//     if (!result.raw.affectedRows) {
//       flag = false;
//     }
//     return flag;
//   }

//   async top(ids: number[]) {
//     let flag = true;
//     const result = await this.repository
//       .createQueryBuilder()
//       .update(Message)
//       .set({ isTop: 1 })
//       .where("id in (:...ids)", { ids })
//       .execute();
//     if (!result.raw.affectedRows) {
//       flag = false;
//     }
//     return flag;
//   }

//   async untop(ids: number[]) {
//     let flag = true;
//     const result = await this.repository
//       .createQueryBuilder()
//       .update(Message)
//       .set({ isTop: 0 })
//       .where("id in (:...ids)", { ids })
//       .execute();
//     if (!result.raw.affectedRows) {
//       flag = false;
//     }
//     return flag;
//   }

// }
