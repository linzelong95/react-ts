import React, { memo, useMemo, useCallback, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Divider, Tag, Comment, List, Button, Input, message } from 'antd'
import { GithubOutlined, TagsOutlined, SyncOutlined } from '@ant-design/icons'
import { useService } from '@ssr/common/hooks'
import moment from 'moment'
import { replyServices, articleServices } from '@ssr/blog/services'
import Head from 'next/head'
import type { IArticle, IReply } from '@ssr/blog/types'
import type { IUser } from '@ssr/common/types'
import type { StoreState } from '@ssr/common/store/types'
import type { NextPage } from 'next'
import type { ReactNode } from 'react'
import type { ButtonProps } from 'antd/lib/button'
import type { TextAreaProps } from 'antd/lib/input'
import styles from './index.module.scss'
import 'braft-editor/dist/index.css'

interface ArticleDetailProps {
  detailInfo: IArticle['getDetailRes']
}
type HandleReplyItems = (
  type: 'remove' | 'approve' | 'disapprove' | 'top' | 'unTop',
  record: IReply['listItem'],
) => void

const ArticleDetail: NextPage<ArticleDetailProps, Promise<ArticleDetailProps>> = memo((props) => {
  const { detailInfo = {} as IArticle['getDetailRes'] } = props
  const replyBoxRef = useRef<HTMLDivElement>(null)
  const replyTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const [replyContent, setReplyContent] = useState<string>()
  const [repliedTo, setRepliedTo] = useState<IUser['listItem'] & { replyId: number }>(null)
  const currentUser = useSelector<StoreState, StoreState['user']>((state) => state.user)

  const getListParams = useMemo<IReply['getListParams']>(() => {
    return {
      page: 1,
      size: 9999,
      articleIds: detailInfo.id,
    }
  }, [detailInfo])
  const [replyLoading, replyRes, replyErr, replyForceRequest] = useService(
    replyServices.getList,
    getListParams,
  )
  const [replyTotal, replyList] = useMemo(() => {
    if (replyErr) {
      message.error(replyErr.message || '获取评论列表失败')
      return [0, []]
    }
    return [replyRes?.data?.total || 0, replyRes?.data?.list || []]
  }, [replyRes, replyErr])

  const replyContentChange = useCallback<TextAreaProps['onChange']>(
    (event) => {
      if (repliedTo?.id) {
        const mentionRegexp = new RegExp(`^@${repliedTo.nickname}\\s+`)
        if (!mentionRegexp.test(event.target.value)) {
          setReplyContent('')
          setRepliedTo(null)
          return
        }
      }
      setReplyContent(event.target.value)
    },
    [repliedTo],
  )

  const handleComment = useCallback<ButtonProps['onClick']>(async () => {
    if (!currentUser?.account) {
      message.warn('登录后才能评论')
      return
    }
    const reply = replyContent.trim()
    if (!reply) {
      message.warn('评论内容不能为空')
      return
    }
    const parentId = repliedTo?.replyId
    const toId = repliedTo?.id || detailInfo.user.id
    message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
    const [, saveErr] = await replyServices.save({
      toId,
      parentId,
      reply,
      articleId: detailInfo.id,
    })
    if (saveErr) {
      message.error({ content: saveErr.message || '提交失败', key: 'saveData' })
      return
    }
    message.success({ content: '操作成功', key: 'saveData' })
    setRepliedTo(null)
    setReplyContent('')
    replyForceRequest()
  }, [currentUser, replyContent, repliedTo, detailInfo, replyForceRequest])

  const prepareForReplying = useCallback<(item: IReply['listItem']) => void>(
    (item) => {
      if (!currentUser?.account) {
        message.warn('登录后才能评论')
        return
      }
      replyBoxRef?.current?.scrollIntoView?.({ behavior: 'smooth' })
      setRepliedTo({ ...item.from, replyId: item.parentId || item.id })
      setReplyContent(`@${item.from.nickname} `)
      replyTextAreaRef?.current?.focus()
    },
    [currentUser],
  )

  const handleReplyItems = useCallback<HandleReplyItems>(
    async (type, record) => {
      const handlingItems = [record].map((item) => ({ id: item.id, parentId: item.parentId }))
      const [, err] = await replyServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      replyForceRequest()
    },
    [replyForceRequest],
  )

  const getCommentComponent = useCallback<(item: IReply['listItem']) => ReactNode>(
    (item) => {
      const { roleName } = currentUser
      const { id, createDate, from, isApproved, to, reply, parentId, children } = item
      return (
        <Comment
          key={id}
          actions={[
            <span key="createDate">{moment(new Date(createDate)).format('YYYY-MM-DD')}</span>,
            <a key="reply" onClick={() => prepareForReplying(item)}>
              回复
            </a>,
            currentUser.id === from?.id && (
              <a
                key="delete"
                onClick={() => handleReplyItems('remove', item)}
                style={{ color: 'red', marginLeft: 10 }}
              >
                删除
              </a>
            ),
          ]}
          author={
            <span>
              {from.nickname}
              {parentId > 0 && (
                <span className="ml5">
                  &nbsp;回复&nbsp;
                  {to.nickname}
                </span>
              )}
            </span>
          }
          avatar={from?.avatar || '/public/assets/images/default/avatar.jpeg'}
          content={
            isApproved || roleName === 'admin' ? (
              <span style={{ color: isApproved === 0 ? 'lightgray' : '' }}>{reply}</span>
            ) : (
              '（该评论待审核）'
            )
          }
        >
          {children?.map?.((item) => getCommentComponent(item))}
        </Comment>
      )
    },
    [currentUser, handleReplyItems, prepareForReplying],
  )

  return (
    <div className={styles.root}>
      <Head>
        <title>{detailInfo.title}</title>
        <meta name="description" content="博客文章，网站开发技术分享，共同进步" />
        <meta name="keywords" content="blog,web,spa,ssr,react,egg,next" />
      </Head>
      <div className={styles['article-reply']}>
        <div className={styles.article}>
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
                  const colorArr = [
                    'magenta',
                    'red',
                    'volcano',
                    'orange',
                    'gold',
                    'lime',
                    'green',
                    'cyan',
                    'blue',
                    'geekblue',
                    'purple',
                  ]
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
          <img
            className={styles.cover}
            src={detailInfo.imageUrl || '/public/assets/images/default/article/jpeg'}
          />
          <div
            className={styles['rich-text-container']}
            dangerouslySetInnerHTML={{ __html: detailInfo.content }}
          />
        </div>
        <div className={styles.reply} ref={replyBoxRef}>
          <Input.TextArea
            rows={4}
            value={replyContent}
            ref={replyTextAreaRef}
            onChange={replyContentChange}
          />
          <div className={styles['comment-btn']}>
            <Button size="small" type="primary" onClick={handleComment}>
              发表评论
            </Button>
          </div>
          {replyList.length > 0 && (
            <>
              <Divider orientation="left">
                <b style={{ color: '#1890FF', fontSize: 20 }}>{replyTotal}</b>
                <span style={{ margin: '0px 10px' }}>条留言</span>
                <SyncOutlined style={{ color: '#1890FF' }} onClick={replyForceRequest} />
              </Divider>
              <List
                loading={replyLoading}
                itemLayout="horizontal"
                dataSource={replyList}
                renderItem={getCommentComponent}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles['author-recommend']}>
        <div style={{ textAlign: 'center' }}>
          <Avatar
            size={200}
            src={detailInfo.user.avatar || '/public/assets/images/default/avatar.jpeg'}
          />
          <p style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }}>{detailInfo.user.nickname}</p>
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

ArticleDetail.getInitialProps = async ({ query }) => {
  const id = query?.id as string
  const [articleRes] = await articleServices.getDetail({ id })
  return { detailInfo: articleRes?.data }
}

export default ArticleDetail
