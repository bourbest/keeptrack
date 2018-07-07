import React from 'react'
import PropTypes from 'prop-types'
import {map, floor} from 'lodash'
import {browserHistory, Link} from 'react-router'

const generateLink = (pageNumber, path, query) => {
  const newQuery = {...query, page: pageNumber}
  const search = map(newQuery, (value, key) => `${key}=${value}`).join('&')
  const href = `${path}?${search}`
  return href
}

const createPageLink = (pageNumber, isActive, path, query, label) => {
  const href = generateLink(pageNumber, path, query)
  label = label || pageNumber
  return (
    <div key={pageNumber}>
      <Link to={href}>
        {label}
      </Link>
    </div>
  )
}

class PageSelector extends React.PureComponent {
  constructor (props) {
    super(props)
    this.navigate = this.navigate.bind(this)
  }

  navigate (event) {
    event.preventDefault()
    const page = (event.target.id === 'first') ? 1 : this.props.totalPages
    const href = generateLink(page, this.props.path, this.props.query)
    browserHistory.push(href)
  }

  getStartingPage (currentPage, totalPages, maxPageDisplayed) {
    const half = floor(maxPageDisplayed / 2)
    if (currentPage <= half) {
      return 1
    } else if (currentPage >= totalPages - half) {
      return totalPages - maxPageDisplayed + 1
    }
    return currentPage - half
  }

  render () {
    const {query, path, currentPage, totalPages, maxPageDisplayed} = this.props
    if (totalPages === 1) return null

    const pages = []

    const startingPage = this.getStartingPage(currentPage, totalPages, maxPageDisplayed)

    for (let pageNumber = startingPage; pages.length < maxPageDisplayed && pageNumber <= totalPages; pageNumber++) {
      const pageLink = createPageLink(pageNumber, currentPage === pageNumber, path, query)
      pages.push(pageLink)
    }
    return (
      <div className="ui centered row">
        <button type="button" id="first" onClick={this.navigate} disabled={currentPage === 1}>
          1
        </button>
        {pages}
        <button type="button" id="last" onClick={this.navigate} disabled={currentPage === totalPages}>
          {totalPages}
        </button>
      </div>
    )
  }
}

PageSelector.propTypes = {
  path: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  maxPageDisplayed: PropTypes.number.isRequired
}

export default PageSelector

