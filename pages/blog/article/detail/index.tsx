import React, { memo } from 'react'
import { articleServices } from '@ssr/blog/services'
import { Avatar, Divider, Tag } from 'antd'
import { GithubOutlined, TagsOutlined } from '@ant-design/icons'
// import { useService } from '@ssr/common/hooks'
// import moment from 'moment'
import Head from 'next/head'
import type { IArticle } from '@ssr/blog/types'
import type { NextPage } from 'next'
import styles from './index.module.scss'
import 'braft-editor/dist/index.css'

interface ArticleProps {
  detailInfo: IArticle['getDetailRes']
}

const Article: NextPage<ArticleProps, Promise<ArticleProps>> = memo((props) => {
  const { detailInfo = {} as IArticle['getDetailRes'] } = props

  return (
    <div className={styles.root}>
      <Head>
        <title>{detailInfo.title}</title>
        <meta name="description" content="博客文章，网站开发技术分享，共同进步" />
        <meta name="keywords" content="blog,web,spa,ssr,react,egg,next" />
      </Head>
      <div className={styles['content-reply']}>
        <h1 className={styles.title}>{detailInfo.title}</h1>
        <div className={styles.catalog}>
          <span>
            归属：
            <Tag color="purple">
              <TagsOutlined className="mr5" />
              {detailInfo.category.sort.name}, {detailInfo.category.name}
            </Tag>
          </span>
          {detailInfo.tags?.length > 0 && (
            <span className="ml20">
              标签：
              {detailInfo.tags.map(({ id, name }) => {
                const colorArr = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
                const color = colorArr[Math.floor(Math.random() * (colorArr.length - 1))]
                return (
                  <Tag color={color} key={id}>
                    {name}
                  </Tag>
                )
              })}
            </span>
          )}
        </div>
        {detailInfo.abstract && <p className={styles.abstract}>摘要：{detailInfo.abstract}</p>}
        <img className={styles.cover} src={'/public/assets/images/default/article.jpeg'} />
        {/* <img className={styles.cover} src={detailInfo.imageUrl || '/public/assets/images/default/article/jpeg'} /> */}
        <div className={styles['rich-text-container']} dangerouslySetInnerHTML={{ __html: detailInfo.content }} />
      </div>
      <div className={styles['author-recommend']}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={200} src={detailInfo.user.avatar || '/public/assets/images/default/avatar.jpeg'} />
          <p style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }}>{detailInfo.user.nickName}</p>
          <Divider style={{ margin: '5px 0px' }}>
            {detailInfo.user?.github && (
              <a href={detailInfo.user?.github} target="_blank" rel="noreferrer">
                <GithubOutlined />
              </a>
            )}
          </Divider>
          <span>这个人很懒，什么都没留下</span>
        </div>
      </div>
    </div>
  )
})

Article.getInitialProps = async ({ query }) => {
  const id = query?.id as string
  const [articleRes] = await articleServices.getDetail({ id })
  return { detailInfo: articleRes?.data }
}

export default Article
