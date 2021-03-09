import React, { memo, useCallback } from 'react'
import { loginServices } from '@common/services'
import { Card, Form, Input, Button, message, Row, Col } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import { useService } from '@common/hooks'
import { serialize } from '@common/utils'
import type { FC } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { ButtonProps } from 'antd/lib/button'
import type { AccountTypeCollection } from '@common/types'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
}

const Register: FC<RouteComponentProps<never>> = memo(() => {
  const history = useHistory()
  const [form] = Form.useForm<AccountTypeCollection['registerParams'] & { captcha: string }>()

  const [, captchaRes, , forceRequest] = useService(loginServices.getWebpageCaptcha)

  const handleLogin = useCallback<ButtonProps['onClick']>(() => {
    form
      .validateFields()
      .then(async (values) => {
        const { captcha, account, password } = values
        message.loading({ content: '正在注册...', key: 'register', duration: 0 })
        const [, verifyCaptchaErr] = await loginServices.verifyCaptcha(captcha)
        if (verifyCaptchaErr) {
          message.error({ content: '验证码错误', key: 'register' })
          return
        }
        const md5Password = serialize(password)
        const [, registerErr] = await loginServices.register({ account, password: md5Password })
        if (registerErr) {
          message.error({ content: registerErr.message || '注册失败', key: 'register' })
          return
        }
        message.success({ content: '注册成功', key: 'register' })
        history.replace('/login')
      })
      .catch(() => {
        message.error('请检查表单是否填写无误')
      })
  }, [form, history])

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 600 }}>
        <div className="mt15 mb20" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={`${__SERVER_ORIGIN__ || ''}/public/assets/images/logo.png`} style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <span style={{ fontSize: 36, fontWeight: 'bold', marginLeft: 16 }}>briefNull</span>
        </div>
        <Form {...layout} form={form} name="register">
          <Form.Item label="Account" name="account" rules={[{ required: true, message: 'Please input your account!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Re Password"
            name="rePassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please input your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
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
          <Form.Item {...tailLayout}>
            <Button block type="primary" onClick={handleLogin}>
              注册
            </Button>
          </Form.Item>
          <Form.Item {...tailLayout} className="text-right">
            <Link to="/login">使用已有账号登录</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
})

export default Register
