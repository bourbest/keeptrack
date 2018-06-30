import React from 'react'
import PropTypes from 'prop-types'
import {omit} from 'lodash'
import {Link} from 'react-router'
import {buildUrl} from '../../services/url-utils'

export class Pagination extends React.PureComponent {
  constructor (props) {
    super(props)
    this.insertPageRange = this.insertPageRange.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  renderItem (symbol, page, active) {
    const {location} = this.props
    const classes = active ? 'active item' : 'item'
    const urlParams = omit(location.query, 'page')
    if (page > 1) {
      urlParams.page = page.toString()
    }
    const url = buildUrl(location.pathname, urlParams)
    return <Link key={symbol} aria-current={active.toString()} tabIndex="0" type="pageItem" to={url} className={classes}>{symbol}</Link>
  }

  insertPageRange (target, from, to, activePage) {
    for (let i = from; i <= to; i++) {
      target.push(this.renderItem(i, i, i === activePage))
    }
  }
  render () {
    const {totalPages, location} = this.props
    const activePage = location.query && location.query.page
      ? parseInt(location.query.page)
      : 1

    let links = []
    if (totalPages <= 11) {
      this.insertPageRange(links, 1, totalPages, activePage)
    } else if (activePage > 6 && activePage < totalPages - 5) {
      links.push(this.renderItem(1, 1, false))
      links.push(this.renderItem('...', activePage - 4, false))
      this.insertPageRange(links, activePage - 3, activePage + 3, activePage)
      links.push(this.renderItem('...', activePage + 4, false))
      links.push(this.renderItem(totalPages, totalPages, false))
    } else if (activePage < 10) {
      this.insertPageRange(links, 1, 9, activePage)
      links.push(this.renderItem('...', 10, false))
      links.push(this.renderItem(totalPages, totalPages, false))
    } else {
      links.push(this.renderItem(1, 1, false))
      links.push(this.renderItem('...', totalPages - 9, false))
      this.insertPageRange(links, totalPages - 8, totalPages, activePage)
    }

    return (
      <div aria-label="Pagination Navigation" role="navigation" className="ui pagination menu">
        {links}
      </div>
    )
  }
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired
}
