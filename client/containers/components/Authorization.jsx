import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {getUser} from '../../modules/authentication/selectors'
import {isArray, intersection} from 'lodash'

const mapStateToProps = (state) => {
  return {
    user: getUser(state)
  }
}

const canAccessModule = (user, requiredRoles) => {
  if (!isArray(requiredRoles)) {
    requiredRoles = [requiredRoles]
  }

  const match = intersection(requiredRoles, user.roles)
  return match.length > 0
}

export default (requiredRole) => {
  return (WrappedComponent) => {
    class WithAuthorization extends React.Component {
      render () {
        const allowed = canAccessModule(this.props.user, requiredRole)
        if (allowed) {
          return <WrappedComponent {...this.props} />
        }
        return (<div>Access denied</div>)
      }
    }

    WithAuthorization.propTypes = {
      user: PropTypes.object
    }
    return connect(mapStateToProps)(WithAuthorization)
  }
}
