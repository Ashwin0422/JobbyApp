import {Link} from 'react-router-dom'
import Header from '../Header'

import './style.css'

const Home = props => {
  const homePageBtnClicked = () => {
    const {history} = props
    history.push('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-bg">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="link-element">
          <button type="button" onClick={homePageBtnClicked}>
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}

export default Home
