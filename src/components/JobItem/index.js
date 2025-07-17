import {FaStar, FaMapMarkerAlt, FaBriefcase} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import './style.css'

const JobItem = props => {
  const {details} = props
  const {companyLogoUrl, empType, jobDescription, location} = details
  const {rating, title, salaryPackage, id} = details

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="jobItem-cont">
        <div className="jobItem-header">
          <img src={companyLogoUrl} alt="company logo" />
          <div>
            <h1>{title}</h1>
            <div className="logo-cont">
              <FaStar color="gold" size={20} />
              <p>{rating}</p>
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
        <h1 className="heading-desc">Description</h1>
        <p className="para-desc">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
