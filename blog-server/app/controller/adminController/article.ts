// import { Controller } from 'egg'

// export default class AdminArticleController extends Controller {
//   @inject()
//   adminArticleService

//   @post('/list')
//   async list(ctx): Promise<void> {
//     const user = ctx.state.user
//     const {
//       conditionQuery: { title = '', orderBy = {}, category = {}, tagIdsArr = [], articleId },
//       index = 1,
//       size = 10,
//     } = ctx.request.body
//     const [list, total] = await this.adminArticleService.list({ title, orderBy, index, size, category, tagIdsArr, user, articleId })
//     ctx.body = { list, total }
//   }

//   @post('/content')
//   async content(ctx) {
//     const { articleId } = ctx.request.body
//     const content = await this.adminArticleService.content({ articleId })
//     ctx.body = { list: content }
//   }

//   @post('/insert')
//   @post('/update')
//   async save(ctx): Promise<void> {
//     const user = ctx.state.user
//     const { id, title, abstract, isTop, category, tags, content, imageUrl } = ctx.request.body
//     const flag = await this.adminArticleService.save({ id, title, abstract, isTop, category, user, tags, content, imageUrl })
//     const action = id ? '更新' : '添加'
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `${action}失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `${action}成功`, flag }
//   }

//   @post('/delete')
//   async delete(ctx): Promise<void> {
//     const { items } = ctx.request.body
//     const ids = items.map((i) => i.id)
//     const flag = await this.adminArticleService.delete(ids)
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `删除失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `删除成功`, flag }
//   }

//   @post('/lock')
//   async lock(ctx): Promise<void> {
//     const { items } = ctx.request.body
//     const ids = items.map((i) => i.id)
//     const flag = await this.adminArticleService.lock(ids)
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `禁用失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `禁用成功`, flag }
//   }

//   @post('/unlock')
//   async unlock(ctx): Promise<void> {
//     const { items } = ctx.request.body
//     const ids = items.map((i) => i.id)
//     const flag = await this.adminArticleService.unlock(ids)
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `启用失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `启用成功`, flag }
//   }

//   @post('/top')
//   async top(ctx): Promise<void> {
//     const { items } = ctx.request.body
//     const ids = items.map((i) => i.id)
//     const flag = await this.adminArticleService.top(ids)
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `置顶失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `置顶成功`, flag }
//   }

//   @post('/untop')
//   async untop(ctx): Promise<void> {
//     const { items } = ctx.request.body
//     const ids = items.map((i) => i.id)
//     const flag = await this.adminArticleService.untop(ids)
//     if (!flag) {
//       ctx.status = 400
//       ctx.body = { message: `取置失败`, flag }
//       return
//     }
//     ctx.status = 200
//     ctx.body = { message: `取置成功`, flag }
//   }
// }
