import React, { useCallback, memo } from 'react'
import { Form, Input, Checkbox, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type { ModalProps } from 'antd/es/modal'
import type { LoginParams } from '@services/user/login'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

interface LoginFormProps extends Omit<ModalProps, 'title' | 'okText' | 'onCancel'> {
  isForRegister: boolean
  onLogin: (params: LoginParams) => void
  onRegister: (params: any) => void
  onClose: () => void
}

const LoginForm: FC<LoginFormProps> = memo((props) => {
  const { isForRegister, visible, onLogin, onRegister, onClose, ...restProps } = props
  const [form] = Form.useForm<LoginParams>()
  const { t } = useTranslation()

  const handleCancel = useCallback<() => void>(() => {
    form.resetFields()
    onClose()
  }, [form, onClose])

  const handleOk = useCallback<() => void>(() => {
    form
      .validateFields()
      .then((values) => {
        if (isForRegister) {
          onRegister(values)
        } else {
          onLogin(values)
        }
        handleCancel()
      })
      .catch((error) => {
        console.log('Validate Failed:', error)
      })
  }, [form, isForRegister, onLogin, onRegister, handleCancel])

  return (
    <Modal
      visible={visible}
      title={t(`common.${isForRegister ? 'register' : 'login'}`)}
      okText={t(`common.${isForRegister ? 'register' : 'login'}`)}
      onCancel={handleCancel}
      onOk={handleOk}
      {...restProps}
    >
      <Form {...layout} form={form} name="login" initialValues={{ autoLogin: true }}>
        <Form.Item label="Account" name="account" rules={[{ required: true, message: 'Please input your account!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout} name="autoLogin" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default LoginForm
