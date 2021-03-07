import { useCallback, memo } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout, Input, Avatar, Menu, Dropdown } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { Container } from '@client/common/components'
import { logout } from '@client/common/store/action/user'
import type { FC } from 'react'

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

  const handleLogout = (e) => {
    e.preventDefault()
    onLogout()
  }

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-wrap"></div>}>
          <div className="header-left">
            <Link href="/">
              <GithubOutlined className="github-icon" />
            </Link>
            <Input.Search placeholder="input search text" onSearch={onSearch} style={{ width: 300 }} />
          </div>
          <div className="header-right">
            {user && user.id ? (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="logout">
                      <a onClick={handleLogout}>登出</a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Avatar size={40} src={user.avatar_url} className="avatar-icon" />
              </Dropdown>
            ) : (
              <a href={`/prepare-auth?url=${router.asPath}`}>
                <Avatar size={40} icon={<UserOutlined />} className="avatar-icon" />
              </a>
            )}
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Footer</Footer>
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
        .github-icon {
          color: white;
          font-size: 40px;
          margin-right: 16px;
          cursor: pointer;
        }
        .avatar-icon {
          cursor: pointer;
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
