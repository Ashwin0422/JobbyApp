import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './style.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    salaryRange: '',
    searchInput: '',
    jobList: [],
    selectedEmpType: [],
    notFound: false,
    name: '',
    profileImgUrl: '',
    shortBio: '',
    userProfileUnsuccess: false,
    isUserProfileLoading: true,
    jobfetchUnsuccess: false,
    isJobLoading: true,
  }

  componentDidMount() {
    this.fetchUserData()
    this.fetchJobData()
  }

  fetchUserData = async () => {
    const jwtToken = Cookies.get('jwtToken')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(url, options)

      if (response.status !== 200) {
        this.setState({userProfileUnsuccess: true})
        return
      }

      const data = await response.json()
      const profileData = data.profile_details

      this.setState({
        name: profileData.name,
        profileImgUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
        isUserProfileLoading: false,
      })
    } catch (e) {
      this.setState({userProfileUnsuccess: true, isUserProfileLoading: false})
      console.log(e)
    }
  }

  fetchJobData = async () => {
    const {salaryRange, searchInput, selectedEmpType} = this.state
    const jwtToken = Cookies.get('jwtToken')
    const employmentTypes = selectedEmpType.join(',')
    const url = `https://apis.ccbp.in/jobs?minimum_package=${salaryRange}&search=${searchInput}&employment_type=${employmentTypes}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(url, options)
      if (response.status !== 200) {
        this.setState({jobfetchUnsuccess: true, isJobLoading: false})
        return
      }

      const data = await response.json()
      const newData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        empType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        salaryPackage: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      if (data.total === 0) {
        this.setState({notFound: true, isJobLoading: false})
      } else {
        this.setState({jobList: newData, notFound: false, isJobLoading: false})
      }
    } catch (e) {
      this.setState({jobfetchUnsuccess: true, isJobLoading: false})
    }
  }

  changeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.fetchJobData)
  }

  changesearchInput = event => {
    this.setState(
      {searchInput: event.target.value, isJobLoading: true},
      this.fetchJobData,
    )
  }

  selectEmpType = event => {
    const newEmp = event.target.value

    this.setState(prev => {
      const current = prev.selectedEmpType || []
      const isAlreadySelected = current.includes(newEmp)

      const updatedEmpType = isAlreadySelected
        ? current.filter(type => type !== newEmp)
        : [...current, newEmp]

      return {selectedEmpType: updatedEmpType}
    }, this.fetchJobData)
  }

  retryUserProfile = () => {
    this.setState({isUserProfileLoading: true})
    this.fetchUserData()
  }

  retryJobsFetch = () => {
    this.setState({isJobLoading: true})
    this.fetchJobData()
  }

  userProfile = () => {
    const {name, profileImgUrl, shortBio} = this.state
    return (
      <div className="userprofile-cont">
        <img src={profileImgUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  noJobsPage = () => (
    <div className="noJobs-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We count not find any jobs. Try other filters</p>
    </div>
  )

  userProfileUnsucessPage = () => (
    <div className="userProfileUnsuccess-btn-cont">
      <button type="button" onClick={this.retryUserProfile}>
        Retry
      </button>
    </div>
  )

  renderUserProfile = () => {
    const {isUserProfileLoading, userProfileUnsuccess} = this.state

    if (isUserProfileLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    if (userProfileUnsuccess) {
      return this.userProfileUnsucessPage()
    }
    return this.userProfile()
  }

  renderFailureView = () => (
    <div className="failureView-bg">
      <div className="failureView-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={this.retryJobsFetch}>
          Retry
        </button>
      </div>
    </div>
  )

  renderJobs = () => {
    const {jobList, notFound, isJobLoading, jobfetchUnsuccess} = this.state

    if (isJobLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (notFound) {
      return this.noJobsPage()
    }

    if (jobfetchUnsuccess) {
      return this.renderFailureView()
    }

    return (
      <ul>
        {jobList.map(eachItem => (
          <JobItem key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  render() {
    const {salaryRange, searchInput} = this.state
    return (
      <>
        <Header />
        <div className="job-bg">
          <div className="job-left-sec">
            {this.renderUserProfile()}
            <hr />
            <div className="job-left-input-cont">
              <h1>Type of Employment</h1>
              {employmentTypesList.map(each => (
                <div key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    name="employmentType"
                    onChange={this.selectEmpType}
                    value={each.employmentTypeId}
                  />
                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  <br />
                </div>
              ))}
              <hr />
            </div>
            <div className="job-left-input-cont">
              <h1>Salary Range</h1>
              {salaryRangesList.map(each => (
                <div key={each.salaryRangeId}>
                  <input
                    id={each.salaryRangeId}
                    type="radio"
                    name="salary"
                    value={each.salaryRangeId}
                    onChange={this.changeSalaryRange}
                    checked={salaryRange === each.salaryRangeId}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  <br />
                </div>
              ))}
            </div>
          </div>
          <div className="job-right-sec">
            <div className="seach-input-cont">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.changesearchInput}
              />
              <button
                className="search-btn"
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
