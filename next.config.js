const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const CLIENT_ID = 'a3f5d3b1ce674d0304ba'
const CLIENT_SECRET = '64efb6ba5ae83cc8b4e1f6e15e423bb7fde0719f'

const github = {
  request_token_url: 'https://github.com/login/oauth/access_token',
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPE}`,
}

module.exports = {
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${github.client_id}&scope=${SCOPE}`,
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/article',
        permanent: true,
      },
    ]
  },
}
