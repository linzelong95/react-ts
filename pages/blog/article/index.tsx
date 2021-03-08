import React, { memo, isValidElement, useCallback } from 'react'
import { Avatar, Row, Col, Button, List, Tag, Input, Tooltip, Tabs, Divider } from 'antd'
import { TagsOutlined, HomeOutlined, GithubOutlined } from '@ant-design/icons'
import { articleServices, tagServices, sortServices } from '@ssr/blog/services'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'
import type { IArticle, ITag, ISort } from '@ssr/blog/types'
import type { NextPage } from 'next'

interface ArticleProps {
  articleInfo: IArticle['getListRes']
  tagInfo: ITag['getListRes']
  sortInfo: ISort['getListRes']
}

const FilterLink = memo(({ children, query, lang, sort, order, page, selected }: any) => {
  if (selected) return <span>{children}</span>
  let queryString = `?query=${query}`
  if (lang) queryString += `&lang=${lang}`
  if (sort) queryString += `&sort=${sort}&order=${order}`
  if (page) queryString += `&page=${page}`
  queryString += `&per_page=10`
  return <Link href={`/search${queryString}`}>{isValidElement(children) ? children : <a>{children}</a>}</Link>
})

const Article: NextPage<ArticleProps, Promise<ArticleProps>> = memo((props) => {
  const { articleInfo, tagInfo, sortInfo } = props
  const router = useRouter()
  const { page, orderName = 'default' } = (router.query as unknown) as { page: number; orderName: string }

  const handleSearch = useCallback(() => {
    router.push('/blog/article')
  }, [router])

  const showDataByDefaultWay = useCallback(async () => {
    // router.push('/blog/article')
    const [articleRes] = await articleServices.getList()
    console.log(articleRes)
  }, [])

  return (
    <div className="root">
      <div className="nav-search">
        <div className="tab">
          <div>
            <Tabs activeKey={orderName as any} size="small">
              <Tabs.TabPane tab="default" key="default" />
              <Tabs.TabPane tab="createDate" key="createDate" />
            </Tabs>
          </div>
          <div>
            <Tooltip title="默认展示">
              <Button type="primary" icon={<HomeOutlined />} shape="circle" size="small" onClick={showDataByDefaultWay} />
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
              // onChange: pageChange,
              // onShowSizeChange: pageChange,
              // pageSizeOptions: ['10', '20', '30', '40'],
              defaultPageSize: 10,
              total: articleInfo?.total || 0,
              itemRender: (renderPage, renderType, renderOl) => {
                const formattedPage = renderType === 'prev' ? page - 1 : page + 1
                const targetPage = renderType === 'page' ? renderPage : formattedPage
                const name = renderType === 'page' ? renderPage : renderOl
                return (
                  <FilterLink {...router.query} page={targetPage}>
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
                  <span key="tag">
                    {item.tags?.map?.(({ id, name }) => (
                      <Tag key={id}>{name}</Tag>
                    ))}
                  </span>,
                ]}
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
                <FilterLink {...router.query} page={name} key={id}>
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
                        {sort.categories.map((category) => {
                          return (
                            <Tag.CheckableTag checked={false} key={category.id}>
                              {category.name}
                            </Tag.CheckableTag>
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
        .list-filter .filter,
        .nav-search .search {
          background: white;
          padding: 16px;
          width: 300px;
          min-width: 0;
          flex-shrink: 0;
          margin-left: 16px;
        }
        .nav-search {
          display: flex;
          margin-bottom: 16px;
        }
        .nav-search .tab {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          background: white;
        }
      `}</style>
    </div>
  )
})

Article.getInitialProps = async (context) => {
  const { index } = context.query || {}
  console.log(index)
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
