import { useCallback, memo } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout, Input, Avatar, Menu, Dropdown } from 'antd'
import { UserOutlined, CopyrightOutlined } from '@ant-design/icons'
import { Container } from '@client/common/components'
import { logout } from '@client/common/store/action/user'
import type { FC } from 'react'
import type { MenuItemProps } from 'antd/lib/menu'

const { Header, Footer, Content } = Layout

interface PageLayoutProps {
  user: any
  onLogout: () => void
}

const PageLayout: FC<PageLayoutProps> = memo((props) => {
  const { children, user, onLogout } = props

  const router = useRouter()
  const onSearch = useCallback(() => {
    console.log(111)
  }, [])

  const handleLogout = useCallback<MenuItemProps['onClick']>(() => {
    onLogout()
  }, [])

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-wrap"></div>}>
          <div className="header-left">
            <Link href="/blog">
              <img className="logo" alt="logo" src="/public/assets/images/logo/blog.png" />
            </Link>
            <Input.Search placeholder="input search text" onSearch={onSearch} style={{ width: 300 }} />
          </div>
          <div className="header-right">
            {user?.id ? (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="logout" onClick={handleLogout}>
                      登出
                    </Menu.Item>
                  </Menu>
                }
              >
                <Avatar size={40} src={user.avatar || '/public/assets/images/default/avatar.jpeg'} className="avatar-icon" />
              </Dropdown>
            ) : (
              <a href={`/user/login?redirect=${router.asPath}`}>
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
        .ant-layout-content {
          display: flex;
        }
        .ant-layout-header {
          padding: 0;
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
        .avatar-icon {
          cursor: pointer;
        }
        .footer {
          text-align: center;
        }
        .copyright-icon {
          margin: 0 8px;
        }
      `}</style>
    </Layout>
  )
})

export default connect(
  (state) => ({
    user: state.user,
  }),
  (dispatch) => ({
    onLogout: () => dispatch(logout()),
  }),
)(PageLayout)
