// import { provide } from 'midway';
// import { getRepository } from "typeorm";
// import { Tag } from "../../entity/Tag";
// import { OrderByCondition } from "../../interface";

// @provide()
// export class UserTagService {

//   repository = getRepository(Tag);

//   async list(options) {
//     const { index, size, name, isEnable, orderBy, sortIdsArr } = options;
//     const orderByMap: OrderByCondition = {};
//     if (orderBy.name && ["name", "isEnable", "sort", "createDate", "updateDate"].includes(orderBy.name)) orderByMap[`tag.${orderBy.name}`] = orderBy.by;
//     if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name)) orderByMap["tag.createDate"] = "ASC";
//     return await this.repository
//       .createQueryBuilder("tag")
//       .innerJoinAndSelect("tag.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
//       .where("tag.name like :name", { name: `%${name}%` })
//       .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : "1=1")
//       .orderBy(orderByMap)
//       .skip((index - 1) * size)
//       .take(size)
//       .getManyAndCount();
//   }

// }
