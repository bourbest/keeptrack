import React from 'react'
import PropTypes from 'prop-types'
import BackButton from './BackButton'
const Toolbar = (props) => {
  const {children, title, backTo} = props
  return (
    <div className="d-flex mb-2 mt-2">
      <div className="form-inline">
        <h4>
          {backTo &&
            <BackButton className="mr-2" backTo={backTo} />
          }
          {title}
        </h4>
      </div>
      <div className="col pr-0">
        <div className="form-inline justify-content-end">
          {React.Children.map(children, (child, index) => {
            if (child) return <span className="ml-2" key={index}>{child}</span>
            return null
          })}
        </div>
      </div>
    </div>
  )
}

Toolbar.propTypes = {
  children: PropTypes.any,
  title: PropTypes.any,
  backTo: PropTypes.string
}

export default Toolbar

