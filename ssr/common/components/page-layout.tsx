import React, { useCallback, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout, Avatar, Menu, Dropdown, Modal, message, Tag } from 'antd'
import { UserOutlined, CopyrightOutlined, CommentOutlined, HomeOutlined } from '@ant-design/icons'
import { LocalStorage } from '@ssr/common/constants'
import { useLocalStorage } from '@ssr/common/hooks'
import { accountServices } from '@ssr/common/services'
import { Container } from '@ssr/common/components'
import { createLogoutAction } from '@ssr/common/store/actions'
import type { StoreState } from '@ssr/common/store/types'
import type { FC } from 'react'

const { Header, Footer, Content } = Layout

const PageLayout: FC<unknown> = memo((props) => {
  const { children } = props
  const { asPath } = useRouter()
  const dispatch = useDispatch()
  const userInfo = useSelector<StoreState, StoreState['user']>((state) => state.user)
  const [accountLocalStorage, setAccountLocalStorage] = useLocalStorage<{
    autoLoginMark: boolean
    autoLogin: boolean
  }>(LocalStorage.BLOG_STORE_ACCOUNT)

  const logout = useCallback<() => void>(async () => {
    const [, err] = await accountServices.logout()
    if (err) {
      message.error('退出登录失败')
      return
    }
    setAccountLocalStorage({ ...accountLocalStorage, autoLoginMark: false })
    dispatch(createLogoutAction())
  }, [accountLocalStorage, setAccountLocalStorage, dispatch])

  const goToCenter = useCallback<() => void>(() => {
    Modal.info({ title: '感谢使用，暂未开发' })
  }, [])

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-wrap"></div>}>
          <div className="header-left">
            <Link href="/blog">
              <a>
                <img className="logo" alt="logo" src="/public/assets/images/logo/blog.png" />
              </a>
            </Link>
            <Menu theme="dark" selectedKeys={[asPath]} mode="horizontal">
              <Menu.Item key="/blog/article" icon={<HomeOutlined />}>
                <Link href="/blog/article">
                  <a>首页</a>
                </Link>
              </Menu.Item>
              <Menu.Item key="/blog/message" icon={<CommentOutlined />}>
                <Link href="/blog/message">
                  <a>留言</a>
                </Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="header-right">
            <a href="/b-blog">
              <Tag>管理端</Tag>
            </a>
            {userInfo?.account ? (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={goToCenter}>个人中心</Menu.Item>
                    <Menu.Item onClick={logout}>退出登录</Menu.Item>
                  </Menu>
                }
              >
                <Avatar
                  size={40}
                  src={userInfo.avatar || '/public/assets/images/default/avatar.jpeg'}
                  className="avatar-icon"
                />
              </Dropdown>
            ) : (
              <a href={`/account/login?redirect=${encodeURIComponent(asPath)}`}>
                <Avatar size={40} icon={<UserOutlined />} className="avatar-icon" />
              </a>
            )}
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer className="footer">
        briefNull
        <CopyrightOutlined className="copyright-icon" />
        2021 All Rights Reserved
      </Footer>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          min-height: 100%;
        }
        .ant-layout-header {
          padding: 0;
          height: 55px;
          line-height: 55px;
        }
        .ant-layout-content {
          display: flex;
        }
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .logo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
          cursor: pointer;
        }
        .ant-menu.ant-menu-dark .ant-menu-item-selected,
        .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
          background: #555555;
        }
        .avatar-icon {
          cursor: pointer;
        }
        .footer {
          text-align: center;
        }
        .copyright-icon {
          margin: 0 8px;
        }
        @media (max-width: 600px) {
          .ant-menu-dark.ant-menu-horizontal > .ant-menu-item,
          .ant-menu-dark.ant-menu-horizontal > .ant-menu-submenu {
            padding: 0 10px;
          }
        }
      `}</style>
    </Layout>
  )
})

export default PageLayout
