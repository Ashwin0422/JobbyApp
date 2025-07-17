import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoHomeSharp, IoExit} from 'react-icons/io5'
import {MdWork} from 'react-icons/md'
import './style.css'

const Header = props => {
  const logOutBtnClicked = () => {
    Cookies.remove('jwtToken')
    const {history} = props
    history.replace('/login')
  }

  const navMobile = () => (
    <div className="mobile-main">
      <nav className="nav-mobile-cont">
        <Link to="/" className="link-element">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul>
          <Link to="/" className="link-element">
            <li>
              <IoHomeSharp size={24} />
            </li>
          </Link>
          <Link to="/jobs" className="link-element">
            <li>
              <MdWork size={24} />
            </li>
          </Link>
          <li>
            <button
              type="button"
              onClick={logOutBtnClicked}
              className="logout-btn"
            >
              <IoExit size={24} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      <div className="bigScreen-main">
        <nav className="nav-bigScreen-cont">
          <Link to="/" className="link-element">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul>
            <Link to="/" className="link-element">
              <li>Home</li>
            </Link>
            <Link to="/jobs" className="link-element">
              <li>Jobs</li>
            </Link>
          </ul>
          <button type="button" onClick={logOutBtnClicked}>
            Logout
          </button>
        </nav>
      </div>
      {navMobile()}
    </>
  )
}

export default withRouter(Header)
