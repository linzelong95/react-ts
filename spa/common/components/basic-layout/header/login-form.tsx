import React, { useCallback, memo, useState, useEffect } from 'react'
import { Form, Input, Checkbox, Modal, message, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { accountServices } from '@common/services'
import { useLocalStorage } from '@common/hooks'
import type { FC } from 'react'
import type { ModalProps } from 'antd/es/modal'
import type { IAccount } from '@common/types'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
}

interface LoginFormProps extends Omit<ModalProps, 'title' | 'okText' | 'onCancel'> {
  isForRegister: boolean
  onLogin: (params: IAccount['loginParams']) => void
  onRegister: (params: any) => void
  onClose: () => void
}

const LoginForm: FC<LoginFormProps> = memo((props) => {
  const { isForRegister, visible, onLogin, onRegister, onClose, ...restProps } = props
  const [captcha, setCaptcha] = useState<string>('')
  const [form] = Form.useForm<IAccount['loginParams']>()
  const { t } = useTranslation()
  const [accountLocalStorage] = useLocalStorage<{ autoLoginMark: boolean; autoLogin: boolean }>(
    'BLOG_STORE_ACCOUNT',
  )

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onClose()
  }, [form, onClose])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        if (isForRegister) {
          onRegister(values)
        } else {
          onLogin(values)
        }
        form.resetFields()
        onClose()
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [form, isForRegister, onLogin, onRegister, onClose])

  const getRefreshedCaptcha = useCallback<
    (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void
  >(async () => {
    const [captchaRes, captchaErr] = await accountServices.getWebpageCaptcha()
    if (captchaErr || !captchaRes?.data?.item) {
      message.error('获取验证码失败')
      return
    }
    setCaptcha(captchaRes.data.item)
  }, [])

  useEffect(() => {
    getRefreshedCaptcha()
  }, [getRefreshedCaptcha])

  return (
    <Modal
      visible={visible}
      title={
        <>
          <UserOutlined style={{ marginRight: 10 }} />
          {t(`common.${isForRegister ? 'register' : 'login'}`)}
        </>
      }
      okText={t(`common.${isForRegister ? 'register' : 'login'}`)}
      onCancel={handleCancel}
      onOk={handleOk}
      {...restProps}
    >
      <Form
        {...layout}
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
        {isForRegister ? (
          <Form.Item
            label="RePassword"
            name="repeatedPassword"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
        ) : (
          <>
            <Form.Item label="Captcha">
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
                    src={`data:image/png;base64,${captcha}`}
                    style={{
                      height: 31,
                      width: '100%',
                      border: '1px solid gray',
                      padding: 3,
                      cursor: 'pointer',
                    }}
                    onClick={getRefreshedCaptcha}
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              {...tailLayout}
              name="autoLogin"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
})

export default LoginForm
