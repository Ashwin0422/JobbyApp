import {Component} from 'react'
import Cookies from 'js-cookie'
import './style.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: '',
    errorMsg: '',
  }

  onSubmitSuccess = token => {
    Cookies.set('jwtToken', token, {expires: 10})

    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  submitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetail = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetail),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({username: '', password: ''})
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  changeUsername = e => {
    this.setState({username: e.target.value})
  }

  changePassword = e => {
    this.setState({password: e.target.value})
  }

  render() {
    const {username, password, errorMsg, showErrorMsg} = this.state
    return (
      <div className="login-bg">
        <form className="form-el" onSubmit={this.submitForm}>
          <div className="form-logo-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <div className="input-cont">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.changeUsername}
            />
          </div>
          <div className="input-cont">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={this.changePassword}
            />
          </div>
          <button type="submit" className="form-btn">
            Login
          </button>
          {showErrorMsg && <p className="form-error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
