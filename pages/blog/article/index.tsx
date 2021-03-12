import React, { memo, useCallback, useMemo } from 'react'
import { Avatar, Row, Col, Button, List, Tag, Input, Tooltip, Menu, Divider, message, Spin } from 'antd'
import { TagsOutlined, HomeOutlined, GithubOutlined, CheckOutlined } from '@ant-design/icons'
import { articleServices, tagServices, sortServices } from '@ssr/blog/services'
import { useService } from '@ssr/common/hooks'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import type { IArticle, ITag, ISort } from '@ssr/blog/types'
import type { NextPage } from 'next'
import type { FC } from 'react'
import type { SearchProps } from 'antd/lib/input'
import styles from './index.module.scss'

interface ArticleProps {
  articleInfo: IArticle['getListRes']
}

type FilterLinkProps = Partial<{
  done: boolean
  search: string
  page: number
  size: number
  orderName: 'default' | 'createDate'
  categoryIds: string
  categoryId: number
  tagIds: string
  tagId: number
  pathname: string
}>

function formattedMultipleIdQuery(queryName: string, queryValue: string, extraId: number): string {
  if (typeof extraId === 'undefined') return queryValue ? `${queryName}=${queryValue}` : ''
  let ids = queryValue?.split?.(',') || []
  const hasExisted = ids.includes(String(extraId))
  ids = hasExisted ? ids.filter((id) => +id !== extraId) : ids.concat(String(extraId))
  return ids.length ? `${queryName}=${ids.join(',')}` : ''
}

function getQueryString(params: Omit<FilterLinkProps, 'done' | 'pathname'>): string {
  const { search, page, size, orderName, categoryIds, categoryId, tagIds, tagId } = params
  const categoryIdsStr = formattedMultipleIdQuery('categoryIds', categoryIds, categoryId)
  const tagIdsStr = formattedMultipleIdQuery('tagIds', tagIds, tagId)
  const queries = [
    search && `search=${search}`,
    page && `page=${page}`,
    size && `size=${size}`,
    orderName === 'createDate' && `orderName=${orderName}&orderBy=ASC`,
    categoryIdsStr,
    tagIdsStr,
  ].filter(Boolean)
  return queries.length ? `?${queries.join('&')}` : ''
}

const FilterLink: FC<FilterLinkProps> = memo((props) => {
  const { children, done, pathname, ...restProps } = props
  if (done) return <span>{children}</span>
  return (
    <Link href={`${pathname}${getQueryString(restProps)}`}>
      <a>{children}</a>
    </Link>
  )
})

const Article: NextPage<ArticleProps, Promise<ArticleProps>> = memo((props) => {
  const { articleInfo } = props
  const router = useRouter()
  const { pathname, query } = router
  const { page = 1, size = 10, orderName = 'default', search = '', categoryIds = '', tagIds = '' } = (query as unknown) as FilterLinkProps

  const getListParams = useMemo<(ISort | ITag)['getListParams']>(() => {
    return {
      page: 1,
      size: 9999,
    }
  }, [])
  const [sortLoading, sortRes, sortErr] = useService(sortServices.getList, getListParams)
  const sortList = useMemo(() => {
    if (sortErr) {
      message.error(sortErr.message || '获取列表失败')
      return []
    }
    return sortRes?.data?.list || []
  }, [sortRes, sortErr])

  const [tagLoading, tagRes, tagErr] = useService(tagServices.getList, getListParams)
  const tagList = useMemo(() => {
    if (tagErr) {
      message.error(tagErr.message || '获取列表失败')
      return []
    }
    return tagRes?.data?.list || []
  }, [tagRes, tagErr])

  const handleSearch = useCallback<SearchProps['onSearch']>(
    (search) => {
      const formattedPathname = `${pathname}${getQueryString({ ...query, search })}`
      router.push(formattedPathname)
    },
    [query, pathname, router],
  )

  return (
    <div className={styles.root}>
      <Head>
        <title>首页-文章列表</title>
        <meta name="description" content="博客文章，网站开发技术分享，共同进步" />
        <meta name="keywords" content="blog,web,spa,ssr,react,egg,next" />
      </Head>
      <div className={styles['nav-search']}>
        <div className={styles.nav}>
          <Menu mode="horizontal" selectedKeys={[orderName]}>
            <Menu.Item key="default">
              <FilterLink {...{ ...query, orderName: 'default' }} pathname={pathname} done={orderName === 'default'}>
                默认
              </FilterLink>
            </Menu.Item>
            <Menu.Item key="createDate">
              <FilterLink {...{ ...query, orderName: 'createDate' }} pathname={pathname} done={orderName === 'createDate'}>
                时间
              </FilterLink>
            </Menu.Item>
          </Menu>
          <div>
            <Tooltip title="默认展示">
              <FilterLink pathname={pathname}>
                <Button type="primary" icon={<HomeOutlined />} shape="circle" size="small" />
              </FilterLink>
            </Tooltip>
          </div>
        </div>
        <div className={styles.search}>
          <Input.Search defaultValue={search} onSearch={handleSearch} enterButton allowClear />
        </div>
      </div>
      <div className={styles['list-filter']}>
        <div className={styles.list}>
          <List
            dataSource={articleInfo?.list || []}
            style={{ background: 'white' }}
            itemLayout="vertical"
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: size,
              total: articleInfo?.total || 0,
              itemRender: (renderPage, renderType, renderOl) => {
                const formattedPage = renderType === 'prev' ? page - 1 : page + 1
                const targetPage = renderType === 'page' ? renderPage : formattedPage
                const name = renderType === 'page' ? renderPage : renderOl
                return (
                  <FilterLink {...query} pathname={pathname} page={targetPage}>
                    {name}
                  </FilterLink>
                )
              },
            }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <span key="createDate">{moment(new Date(item.createDate)).format('YYYY-MM-DD')}</span>,
                  item.tags?.length > 0 && (
                    <span key="tag">
                      {item.tags.map(({ id, name }) => (
                        <Tag key={id}>{name}</Tag>
                      ))}
                    </span>
                  ),
                ].filter(Boolean)}
                extra={<img width={184} alt="article cover" src={item.imageUrl || '/public/assets/images/default/article.jpeg'} />}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {item.isTop === 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      background: 'gray',
                      top: 5,
                      right: -55,
                      width: 150,
                      textAlign: 'center',
                      transform: 'rotate(40deg)',
                      color: 'yellow',
                      overflow: 'hidden',
                    }}
                  >
                    置顶
                  </div>
                )}
                <List.Item.Meta
                  avatar={<Avatar src={item.user?.avatar || '/public/assets/images/default/avatar.jpeg'} />}
                  style={{ marginBottom: 0 }}
                  title={
                    <a href={`/blog/article/detail?id=${item.id}`} target="_blank" rel="noreferrer noopener">
                      <span className="mr10">{item.title}</span>
                      <Tag color="purple">
                        <TagsOutlined />
                        {item.category.sort.name},{item.category.name}
                      </Tag>
                    </a>
                  }
                />
                <span style={{ paddingLeft: 30, fontWeight: 'bold' }}>摘要：</span>
                {item.abstract ? item.abstract : '无'}
              </List.Item>
            )}
          />
        </div>
        <div className={styles.filter}>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={200} src="/public/assets/images/default/avatar.jpeg" />
            <p style={{ fontSize: 25, fontWeight: 'bold', margin: 10 }}>BriefNull</p>
            <Divider style={{ margin: '5px 0px' }}>
              <a href="https://github.com/linzelong95/react-ts">
                <GithubOutlined />
              </a>
            </Divider>
            <span>这个人很懒，什么都没留下</span>
          </div>
          <div>
            <Divider>
              <TagsOutlined style={{ color: 'purple' }} />
            </Divider>
            <div style={{ marginTop: -10, marginBottom: 15 }}>
              <Spin spinning={tagLoading}>
                {tagList.map?.(({ id, name }) => {
                  const colorArr = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
                  const color = colorArr[Math.floor(Math.random() * (colorArr.length - 1))]
                  return (
                    <FilterLink {...query} pathname={pathname} tagId={id} key={id}>
                      <Tag color={color} style={{ margin: 4 }}>
                        {tagIds.split(',').includes(String(id)) && <CheckOutlined />}
                        {name}
                      </Tag>
                    </FilterLink>
                  )
                })}
              </Spin>
            </div>
            <List
              bordered
              loading={sortLoading}
              size="small"
              dataSource={sortList}
              renderItem={(sort) => {
                if (!sort.categories?.length) return null
                return (
                  <List.Item key={sort.id}>
                    <Row style={{ width: '100%' }}>
                      <Col span={7}>
                        <b>{sort.name} : </b>
                      </Col>
                      <Col span={17}>
                        {sort.categories.map(({ id, name }) => {
                          return (
                            <FilterLink {...query} pathname={pathname} categoryId={id} key={id}>
                              <Tag.CheckableTag checked={categoryIds.split(',').includes(String(id))}>{name}</Tag.CheckableTag>
                            </FilterLink>
                          )
                        })}
                      </Col>
                    </Row>
                  </List.Item>
                )
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

Article.getInitialProps = async (context) => {
  const [articleRes] = await articleServices.getList(context.query || {})
  return { articleInfo: articleRes?.data }
}

export default Article
