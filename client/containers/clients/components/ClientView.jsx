import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
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
      const today = new Date()
      const dob = new Date(birthDate)
      const diff = (today.getTime() - dob.getTime()) / (60 * 60 * 24 * 1000)
      const age = Math.abs(Math.round(diff / 365.25))

      const params = {
        age,
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

  renderPhone (phone, messageOptionsById) {
    if (phone && phone.value) {
      const messageOptionText = messageOptionsById[phone.messageOption]
      return (
        <span>
          <Icon name="phone" className="mr-2" />
          {phone.value} ({messageOptionText})
          <br />
        </span>
      )
    }
    return null
  }

  render () {
    const {client, originOptionsById, messageOptionsById, locale} = this.props
    const origin = originOptionsById[client.originId]
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
            {this.renderPhone(client.mainPhoneNumber, messageOptionsById)}
            {this.renderPhone(client.alternatePhoneNumber, messageOptionsById)}
            <span>
              <Icon name="home" className="mr-2" />{origin}
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
  originOptionsById: PropTypes.object.isRequired,
  messageOptionsById: PropTypes.object.isRequired
}

export default ClientView
