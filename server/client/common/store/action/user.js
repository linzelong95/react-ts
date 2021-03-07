import axios from 'axios'

const LOGOUT = 'LOGOUT'

const createLogoutAction = () => ({ type: LOGOUT })

function logout() {
  return (dispatch) => {
    axios
      .post('/logout')
      .then(() => {
        dispatch(createLogoutAction())
      })
      .catch(() => { })
  }
}

export { LOGOUT, logout }
