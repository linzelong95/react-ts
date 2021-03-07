const axios = require('axios')
const config = require('../config')

const {
  github: { client_id, client_secret, request_token_url },
} = config

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const { code } = ctx.query
      if (!code) {
        ctx.body = 'code not exsit'
        return
      }
      const result = await axios({
        method: 'GET',
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      })
      console.log(result.data)
      if (result.status === 200 && !(result.data && result.data.error)) {
        ctx.session.githubAuth = result.data
        const { access_token, token_type } = result.data
        const userInfoRes = await axios({
          url: 'http://api.github.com/user',
          method: 'GET',
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        })
        ctx.session.userInfo = userInfoRes.data
        ctx.redirect((ctx.session && ctx.session.callbackUrl) || '/')
        ctx.session.callbackUrl = ''
      } else {
        ctx.body = `request token failed ${result.message}`
      }
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    if (ctx.path === '/prepare-auth') {
      const { url } = ctx.query
      ctx.session.callbackUrl = url
      ctx.redirect(config.github.OAUTH_URL)
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    if (ctx.path === '/logout') {
      ctx.session.userInfo = null
      ctx.body = 'logout success'
    } else {
      await next()
    }
  })
}
