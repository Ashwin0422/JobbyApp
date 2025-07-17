import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import './style.css'

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
    isFetchUnsuccess: false,
    isLoading: true,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwtToken')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(url, options)
      if (response.status !== 200) {
        this.setState({isFetchUnsuccess: true, isLoading: false})
        return
      }
      const data = await response.json()
      const jobDetails = data.job_details
      const lifeAtCompanyUnpacked = jobDetails.life_at_company
      const similarJobs = data.similar_jobs

      const newSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        empType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobItemDetails: {
          companyLogoUrl: jobDetails.company_logo_url,
          companyWebsiteUrl: jobDetails.company_website_url,
          empType: jobDetails.employment_type,
          jobDescription: jobDetails.job_description,
          location: jobDetails.location,
          salaryPackage: jobDetails.package_per_annum,
          rating: jobDetails.rating,
          title: jobDetails.title,
        },
        lifeAtCompany: {
          description: lifeAtCompanyUnpacked.description,
          imageUrl: lifeAtCompanyUnpacked.image_url,
        },
        skills: jobDetails.skills,
        similarJobs: newSimilarJobs,
        isLoading: false,
      })
    } catch (e) {
      this.setState({isFetchUnsuccess: true, isLoading: false})
    }
  }

  retryJobItemFetch = () => {
    this.setState({isLoading: true})
    this.fetchData()
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailurePage = () => (
    <div className="failureView-bg">
      <div className="failureView-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <button type="button" onClick={this.retryJobItemFetch}>
          Retry
        </button>
      </div>
    </div>
  )

  render() {
    const {jobItemDetails} = this.state
    const {
      companyLogoUrl,
      empType,
      jobDescription,
      location,
      salaryPackage,
      rating,
      title,
      companyWebsiteUrl,
    } = jobItemDetails
    const {skills, lifeAtCompany, similarJobs} = this.state
    const {isFetchUnsuccess, isLoading} = this.state
    return (
      <>
        <Header />
        <div className="jobItemDetails-bg">
          {isLoading && this.renderLoading()}
          {isFetchUnsuccess ? (
            this.renderFailurePage()
          ) : (
            <div>
              <div className="jobItemDetails-cont">
                <div className="jobItem-header">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
                    className="jobItem-img"
                  />
                  <div>
                    <div className="title-cont">
                      <h1>{title}</h1>
                      <div className="logo-cont">
                        <FaStar color="gold" size={20} />
                        <p>{rating}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="location-package-cont">
                  <div className="logo-flex-cont">
                    <div className="logo-cont">
                      <FaMapMarkerAlt />
                      <p>{location}</p>
                    </div>
                    <div className="logo-cont">
                      <FaBriefcase />
                      <p>{empType}</p>
                    </div>
                  </div>
                  <p>{salaryPackage}</p>
                </div>
                <hr className="hr-line" />
                <div className="desc-flex-cont">
                  <h1 className="heading-desc">Description</h1>
                  <a
                    href={companyWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </div>
                <p className="para-desc">{jobDescription}</p>
                <h1 className="skills-heading">Skills</h1>
                <ul className="skills-cont">
                  {skills.map(each => (
                    <li className="skills-content" key={each.name}>
                      <img src={each.image_url} alt="name" />
                      <p>{each.name}</p>
                    </li>
                  ))}
                </ul>
                <h1 className="lifeAtCompany-heading">Life at Company</h1>
                <div className="lifeAtCompany-cont">
                  <p>{lifeAtCompany.description}</p>
                  <img src={lifeAtCompany.imageUrl} alt="life at company" />
                </div>
              </div>
              <div>
                <h1 className="similarJobs-heading">Similar Jobs</h1>
                <ul className="similarJobs-flex-cont">
                  {similarJobs.map(each => (
                    <li className="similarJobs-cont" key={each.title}>
                      <div className="jobItem-header">
                        <img
                          src={each.companyLogoUrl}
                          alt="similar job company logo"
                        />
                        <div>
                          <h1>{each.title}</h1>
                          <div className="logo-cont">
                            <FaStar color="gold" size={20} />
                            <p>{each.rating}</p>
                          </div>
                        </div>
                      </div>
                      <h1 className="similarJobs-desc-heading">Description</h1>
                      <p className="similarJobs-desc">{each.jobDescription}</p>
                      <div className="logo-flex-cont">
                        <div className="logo-cont">
                          <FaMapMarkerAlt />
                          <p>{each.location}</p>
                        </div>
                        <div className="logo-cont">
                          <FaBriefcase />
                          <p>{each.empType}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default JobItemDetails
