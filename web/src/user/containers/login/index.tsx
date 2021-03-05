import React, { memo, useCallback } from 'react'
import { LocalStorage } from '@common/constants'
import { useLocalStorage, useService } from '@common/hooks'
import { loginServices } from '@common/services'
import { rsa, serialize } from '@common/utils'
import { Card, Form, Input, Checkbox, Row, Col, Button, message } from 'antd'
import { parse } from 'qs'
import { useDispatch } from 'react-redux'
import { createLoginAction } from '@common/store/actions'
import { useHistory } from 'react-router-dom'
import type { FC } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { LoginParams } from '@common/services/login'
import type { ButtonProps } from 'antd/lib/button'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
}

const Login: FC<RouteComponentProps<{ type: 'login' | 'register' }>> = memo((props) => {
  const { type } = props.match.params
  const history = useHistory()
  const dispatch = useDispatch()
  const [form] = Form.useForm<LoginParams>()
  const [accountLocalStorage, setAccountLocalStorage] = useLocalStorage<{ autoLoginMark: boolean; autoLogin: boolean }>(
    LocalStorage.BLOG_STORE_ACCOUNT,
  )

  const [, captchaRes, , forceRequest] = useService(loginServices.getWebpageCaptcha)

  const handleLogin = useCallback<ButtonProps['onClick']>(() => {
    form
      .validateFields()
      .then(async (values) => {
        const { password, autoLogin, captcha } = values
        message.loading({ content: '正在登录...', key: 'login', duration: 0 })
        const [, verifyCaptchaErr] = await loginServices.verifyCaptcha(captcha)
        if (verifyCaptchaErr) {
          message.error({ content: '验证码错误', key: 'login' })
          return
        }
        const [publicKeyRes, publicKeyErr] = await loginServices.getPublicKey()
        if (publicKeyErr || !publicKeyRes?.data?.item) {
          message.error({ content: '登录失败', key: 'login' })
          return
        }
        const encryptedPassword = rsa(serialize(password), publicKeyRes.data.item)
        const [loginRes, loginErr] = await loginServices.login({ ...values, password: encryptedPassword })
        if (loginErr) {
          message.error({ content: loginErr.message || '登录失败', key: 'login' })
          return
        }
        message.success({ content: '登录成功', key: 'login' })
        setAccountLocalStorage({ autoLogin, autoLoginMark: autoLogin })
        const { redirect } = parse(location.search, { ignoreQueryPrefix: true })
        dispatch(createLoginAction(loginRes.data))
        if (!redirect) {
          history.replace('/center')
          return
        }
        window.location.href = redirect
        // const urlParams = new URL(window.location.href)
        // const redirectUrlParams = new URL(redirect)
        // if (redirectUrlParams.origin !== urlParams.origin) {
        //   window.location.href = '/blog-admin'
        //   return
        // }
        // redirect = redirect.slice(urlParams.origin.length)
        // if (redirect.match(/^\/.*#/)) {
        //   redirect = redirect.slice(redirect.indexOf('#') + 1)
        // }
      })
      .catch(() => {
        message.error('请检查表单是否填写无误')
      })
  }, [form, history, dispatch, setAccountLocalStorage])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 500 }}>
        <div className="mt15 mb20" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={`${__SERVER_ORIGIN__ || ''}/public/assets/images/logo.png`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <span style={{ fontSize: 36, fontWeight: 'bold', marginLeft: 16 }}>briefNull</span>
        </div>
        <Form {...layout} form={form} name="login" initialValues={{ autoLogin: Boolean(accountLocalStorage?.autoLogin) }}>
          <Form.Item label="Account" name="account" rules={[{ required: true, message: 'Please input your account!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>
          {type === 'register' ? (
            <Form.Item label="RePassword" name="repeatedPassword" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password />
            </Form.Item>
          ) : (
            <>
              <Form.Item label="Captcha">
                <Row gutter={8}>
                  <Col span={18}>
                    <Form.Item noStyle name="captcha" rules={[{ required: true, message: 'Please input captcha!' }]}>
                      <Input placeholder="captcha" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <img
                      alt="验证码"
                      src={captchaRes?.data?.item && `data:image/png;base64,${captchaRes.data.item}`}
                      style={{ height: 31, width: '100%', border: '1px solid gray', padding: 3, cursor: 'pointer' }}
                      onClick={forceRequest}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item {...tailLayout} name="autoLogin" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </>
          )}
          <Form.Item {...tailLayout}>
            <Button block type="primary" onClick={handleLogin}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
})

export default Login
