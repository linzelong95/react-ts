// import { NextApiRequest, NextApiResponse } from 'next'
import { AppContext } from 'next/app'

export interface IAppContext extends Omit<AppContext, 'ctx'> {
  ctx: Omit<AppContext['ctx'], 'req'> & {
    req: AppContext['ctx']['req'] & {
      userInfo?: {
        id: number
        account: string
        nickname: string
        username: string
      }
    }
  }
}
