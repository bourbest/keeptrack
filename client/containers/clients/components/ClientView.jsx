import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {find} from 'lodash'
import {Icon} from '../../components/controls/SemanticControls'

// Components
import {createTranslate} from '../../../locales/translate'
import AddressTile from '../../components/AddressTile'
import ClientFullName from './ClientFullName'
import {formatDate} from '../../../services/string-utils'

class ClientView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('clients', this)
    this.renderAge = this.renderAge.bind(this)
    this.renderPhone = this.renderPhone.bind(this)
  }

  renderAge (birthDate) {
    if (birthDate) {
      const params = {
        age: 0, // moment().diff(birthDate, 'years'),
        birthDate: formatDate(birthDate)
      }
      return (
        <span>
          {this.message('age', params)}
          <br />
        </span>
      )
    }
    return null
  }

  renderPhone (phone) {
    if (phone && phone.value) {
      let text = phone.value
      if (phone.canLeaveMessage) {
        text = `${phone.value} (message ok)`
      }
      return (
        <span>
          <Icon name="phone" className="mr-2" />
          {text}
          <br />
        </span>
      )
    }
    return null
  }

  render () {
    const {client, originOptionList, locale} = this.props
    const origin = find(originOptionList, {value: client.originId})
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div>
              <ClientFullName client={client} locale={locale} />
              <Link className="ml-2 btn" to={`/clients/${client.id}/edit`}>Modifier</Link>
            </div>
            {this.renderAge(client.birthDate)}
            {client.email && client.email.length > 0 &&
              <span>
                <Icon name="mail-alt" className="mr-2" />{client.email}<br />
              </span>
            }
            {this.renderPhone(client.mainPhoneNumber)}
            {this.renderPhone(client.alternatePhoneNumber)}
            <span>
              <Icon name="home" className="mr-2" />{origin.label}
            </span>
            <AddressTile address={client.address} />
          </div>
          <div className="col-md-6 mt-2 mt-md-0">
            <strong>Notes</strong>
            <hr />
            {client.notes && client.notes.length > 0 &&
              <div>
                <p>{client.notes}</p>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

ClientView.propTypes = {
  locale: PropTypes.string.isRequired,
  originOptionList: PropTypes.array.isRequired
}

export default ClientView
