import { memo, useCallback, useEffect, useMemo } from 'react'
import { LocalStorage } from '@common/constants'
import { useLocalStorage, useService, useMobile } from '@common/hooks'
import { accountServices } from '@common/services'
import { rsa, serialize } from '@common/utils'
import { Card, Form, Input, Checkbox, Row, Col, Button, message } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { createLoginAction } from '@common/store/actions'
import { useHistory, Link } from 'react-router-dom'
import type { FC } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { StoreState } from '@common/store/types'
import type { IAccount } from '@common/types'
import type { ButtonProps } from 'antd/lib/button'

const Login: FC<RouteComponentProps<never>> = memo(() => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [form] = Form.useForm<IAccount['loginParams']>()
  const isMobile = useMobile({ includeTraditionalSmallViewPort: true })
  const userInfo = useSelector<StoreState, StoreState['user']>((state) => state.user)
  const [accountLocalStorage, setAccountLocalStorage] = useLocalStorage<{
    autoLoginMark: boolean
    autoLogin: boolean
  }>(LocalStorage.BLOG_STORE_ACCOUNT)

  const [, captchaRes, , forceRequest] = useService(accountServices.getWebpageCaptcha)

  const goToPage = useCallback<(id: number) => void>(
    (id) => {
      const queries = new URLSearchParams(window.location.search)
      let redirectUrl = queries.get('redirect')
      if (!redirectUrl) {
        history.replace(`/profile/${id}`)
        return
      }
      // const urlParams = new URL(window.location.href)
      // const redirectUrlParams = new URL(redirect)
      // if (redirectUrlParams.origin !== urlParams.origin) {
      //   window.location.href = '/b-blog'
      //   return
      // }
      // redirect = redirect.slice(urlParams.origin.length)
      // if (redirect.match(/^\/.*#/)) {
      //   redirect = redirect.slice(redirect.indexOf('#') + 1)
      // }
      try {
        redirectUrl = decodeURIComponent(redirectUrl)
      } finally {
        window.location.href = redirectUrl
      }
    },
    [history],
  )

  const handleLogin = useCallback<ButtonProps['onClick']>(
    (event) => {
      event.preventDefault()
      form
        .validateFields()
        .then(async (values) => {
          const { password, autoLogin, captcha } = values
          message.loading({ content: '正在登录...', key: 'login', duration: 0 })
          const [, verifyCaptchaErr] = await accountServices.verifyCaptcha(captcha)
          if (verifyCaptchaErr) {
            forceRequest()
            message.error({ content: '验证码错误', key: 'login' })
            return
          }
          const [publicKeyRes, publicKeyErr] = await accountServices.getPublicKey()
          if (publicKeyErr || !publicKeyRes?.data?.item) {
            message.error({ content: '登录失败', key: 'login' })
            return
          }
          const encryptedPassword = rsa(serialize(password), publicKeyRes.data.item)
          const [loginRes, loginErr] = await accountServices.login({
            ...values,
            password: encryptedPassword,
          })
          if (loginErr) {
            message.error({ content: loginErr.message || '登录失败', key: 'login' })
            return
          }
          message.success({ content: '登录成功，正在为您跳转', key: 'login' })
          setAccountLocalStorage({ autoLogin, autoLoginMark: autoLogin })
          dispatch(createLoginAction(loginRes.data))
          goToPage(loginRes.data.id)
        })
        .catch(() => {
          message.error('请检查表单是否填写无误')
        })
    },
    [form, dispatch, goToPage, forceRequest, setAccountLocalStorage],
  )

  useEffect(() => {
    if (userInfo?.account) return goToPage(userInfo.id)
    ;(async () => {
      const [loginRes] = await accountServices.login({ autoLogin: true })
      if (!loginRes?.data?.account) return
      dispatch(createLoginAction(loginRes.data))
      goToPage(loginRes.data.id)
    })()
  }, [userInfo, dispatch, goToPage])

  const specialWrapperCol = useMemo<{ offset: number; span: number }>(() => {
    return isMobile ? { offset: 0, span: 24 } : { offset: 5, span: 16 }
  }, [isMobile])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: 500,
          ...(isMobile
            ? {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {}),
        }}
        bodyStyle={isMobile ? { width: '100%' } : undefined}
      >
        <div
          className="mt15 mb20"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <img
            src={`${__SERVER_ORIGIN__ || ''}/public/assets/images/logo.png`}
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <span style={{ fontSize: 36, fontWeight: 'bold', marginLeft: 16 }}>briefNull</span>
        </div>
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          form={form}
          name="login"
          initialValues={{ autoLogin: Boolean(accountLocalStorage?.autoLogin) }}
        >
          <Form.Item
            label="Account"
            name="account"
            rules={[{ required: true, message: 'Please input your account!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Captcha" required>
            <Row gutter={8}>
              <Col span={18}>
                <Form.Item
                  noStyle
                  name="captcha"
                  rules={[{ required: true, message: 'Please input captcha!' }]}
                >
                  <Input placeholder="captcha" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <img
                  alt="验证码"
                  src={captchaRes?.data?.item && `data:image/png;base64,${captchaRes.data.item}`}
                  style={{
                    height: 31,
                    width: '100%',
                    border: '1px solid gray',
                    padding: 3,
                    cursor: 'pointer',
                  }}
                  onClick={forceRequest}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item wrapperCol={specialWrapperCol} name="autoLogin" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={specialWrapperCol}>
            <Button block type="primary" onClick={handleLogin}>
              登录
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={specialWrapperCol}>
            <Row>
              <Col span={14}>
                其他方式
                <GithubOutlined className="font24 ml10 cursor-pointer" />
              </Col>
              <Col span={10} className="text-right">
                <Link to="/register">注册账户</Link>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
})

export default Login
