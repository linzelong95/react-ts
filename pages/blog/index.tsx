import React, { memo, useCallback } from 'react'
import { Avatar, Row, Col, Button, List, Tag, Input, Tooltip, Menu, Divider } from 'antd'
import { TagsOutlined, HomeOutlined, GithubOutlined } from '@ant-design/icons'
import { articleServices, tagServices, sortServices } from '@ssr/blog/services'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { IArticle, ITag, ISort } from '@ssr/blog/types'
import type { NextPage } from 'next'
import type { FC } from 'react'
import type { SearchProps } from 'antd/lib/input'

interface ArticleProps {
  articleInfo: IArticle['getListRes']
  tagInfo: ITag['getListRes']
  sortInfo: ISort['getListRes']
}

function formattedMultipleIdQuery(queryName: string, queryValue: string, extraId: number): string {
  if (typeof extraId === 'undefined') return queryValue ? `${queryName}=${queryValue}` : ''
  let ids = queryValue?.split?.(',') || []
  const hasExisted = ids.includes(String(extraId))
  ids = hasExisted ? ids.filter((id) => +id !== extraId) : ids.concat(String(extraId))
  return ids.length ? `${queryName}=${ids.join(',')}` : ''
}

type FilterLinkProps = Partial<{
  done: boolean
  search: string
  page: number
  size: number
  orderName: 'default' | 'date'
  categoryIds: string
  categoryId: number
  tagIds: string
  tagId: number
  pathname: string
}>

function getQueryString(params: Omit<FilterLinkProps, 'done' | 'pathname'>): string {
  const { search, page, size, orderName, categoryIds, categoryId, tagIds, tagId } = params
  const categoryIdsStr = formattedMultipleIdQuery('categoryIds', categoryIds, categoryId)
  const tagIdsStr = formattedMultipleIdQuery('tagIds', tagIds, tagId)
  const queries = [
    search && `search=${search}`,
    page && `page=${page}`,
    size && `size=${size}`,
    orderName === 'date' && `orderName=${orderName}&orderBy=ASC`,
    categoryIdsStr,
    tagIdsStr,
  ].filter(Boolean)
  return queries.length ? `?${queries.join('&')}` : ''
}

const FilterLink: FC<FilterLinkProps> = memo((props) => {
  const { children, done, pathname, ...restProps } = props
  if (done) return <span>{children}</span>
  console.log(999999999999, `${pathname}${getQueryString(restProps)}`)
  return (
    <Link href={`${pathname}${getQueryString(restProps)}`}>
      <a>{children}</a>
    </Link>
  )
})

const Article: NextPage<ArticleProps, Promise<ArticleProps>> = memo((props) => {
  const { articleInfo, tagInfo, sortInfo } = props
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { page = 1, orderName = 'default' } = (query as unknown) as FilterLinkProps

  console.log('=====================', pathname, asPath, query)

  const handleSearch = useCallback<SearchProps['onSearch']>(
    (search) => {
      const formattedPathname = `${pathname}${getQueryString({ ...query, search })}`
      window.location.href = formattedPathname
    },
    [query, pathname],
  )

  return (
    <div className="root">
      <div className="nav-search">
        <div className="tab">
          <Menu mode="horizontal" selectedKeys={[orderName || 'default']}>
            <Menu.Item key="default">
              <FilterLink {...query} pathname={pathname} orderName="default" done={orderName === 'default'}>
                默认
              </FilterLink>
            </Menu.Item>
            <Menu.Item key="date">
              <FilterLink {...query} pathname={pathname} orderName="date" done={orderName === 'date'}>
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
        <div className="search">
          <Input.Search placeholder="Enter something" onSearch={handleSearch} enterButton allowClear />
        </div>
      </div>
      <div className="list-filter">
        <div className="list">
          <List
            dataSource={articleInfo?.list || []}
            style={{ background: 'white' }}
            itemLayout="vertical"
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: 10,
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
                  <span key="date">{moment(new Date(item.createDate)).format('YYYY-MM-DD')}</span>,
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
                    <a href={`/blog/article/${item.id}`} target="_blank" rel="noreferrer noopener">
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
        <div className="filter">
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
            {tagInfo?.list?.map?.(({ id, name }) => {
              const colorArr = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
              const color = colorArr[Math.floor(Math.random() * (colorArr.length - 1))]
              return (
                <FilterLink {...query} pathname={pathname} tagId={id} key={id}>
                  <Tag color={color} style={{ margin: 4 }}>
                    {name}
                  </Tag>
                </FilterLink>
              )
            })}
          </div>
          <div className="mt20">
            <List
              bordered
              size="small"
              dataSource={sortInfo?.list || []}
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
                            <FilterLink {...router.query} pathname={pathname} categoryId={id} key={id}>
                              <Tag.CheckableTag checked={false}>{name}</Tag.CheckableTag>
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
      <style jsx>{`
        .root {
          margin-top: 16px;
        }
        .list-filter {
          display: flex;
        }
        .list-filter .list {
          background: white;
          padding: 16px;
          flex: 1;
        }
        .list-filter .filter {
          background: white;
          padding: 16px;
          width: 300px;
          min-width: 0;
          flex-shrink: 0;
          margin-left: 16px;
        }
        .nav-search {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .nav-search .tab {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 0 0;
          background: white;
        }
        .nav-search .search {
          background: white;
          padding: 8px 16px;
          width: 300px;
          min-width: 0;
          flex-shrink: 0;
          margin-left: 16px;
        }
      `}</style>
    </div>
  )
})

Article.getInitialProps = async (context) => {
  console.log(1111111111, context.query || {})
  const [articleRes] = await articleServices.getList()
  const [tagRes] = await tagServices.getList({ index: 1, size: 999 })
  const [sortRes] = await sortServices.getList({ index: 1, size: 999 })
  return {
    articleInfo: articleRes?.data,
    tagInfo: tagRes?.data,
    sortInfo: sortRes?.data,
  } as ArticleProps
}

export default Article
