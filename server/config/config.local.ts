import { EggAppConfig, PowerPartial } from 'egg'

export const rsaPublicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/8YDeYSsOqS65mhjQIp0c0RgB
i+Po+ECONRs6GIh4H2h5f4WG5a8y/PcvhC9Bg06xHC+Zn9wj9OmYZ9cJl0cklhkn
gA018Azuv+aul53KJxEfD9eqgevdP1+BtqDFYdMfjy0EVTZXzSxO+Wl7/2NtAmE/
AuywA3t/EolsPMvFVQIDAQAB
-----END PUBLIC KEY-----
`

export default () => {
  const config: PowerPartial<EggAppConfig> = {}

  config.rsaPublicKey = rsaPublicKey

  config.cos = {
    bucket: 'brief',
    appId: '1302086393',
    region: 'ap-shenzhen-fsi',
    cosUrl: 'https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com',
    secretId: 'xxx', // 保密
    secretKey: 'xxx', // 保密
  }

  config.mysql = {
    host: '120.78.139.146',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'myblog',
  }

  return config
}
