import React, { memo } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import type { NextPage } from 'next'

const { publicRuntimeConfig } = getConfig()

interface ArticleProps {
  user: Record<string, string>
}

// export type NextPage<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P>

// export declare type NextComponentType<C extends BaseContext = NextPageContext, IP = {}, P = {}> = ComponentType<P> & {
//   /**
//    * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
//    * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
//    * @param ctx Context of `page`
//    */
//   getInitialProps?(context: C): IP | Promise<IP>;
// };

const Article: NextPage<ArticleProps, ArticleProps['user']> = memo(({ user }) => {
  return (
    <div className="root">
      {!user?.id && (
        <>
          <p>亲，你还没登录hhh哦～</p>
          <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
            点我登录
          </Button>
        </>
      )}
      <style jsx>{`
        .root {
          min-height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
})

// Article.getInitialProps = async ({ ctx, reduxStore }: any) => {
//   const { user } = reduxStore.getState()
//   return { user }
// }

export default connect((state: any) => ({
  user: state.user,
}))(Article)
