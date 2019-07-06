import React from 'react'
import {Link} from 'react-router'
import PropTypes from 'prop-types'
import {Icon} from '../../components/controls/SemanticControls'

// Components
import {createTranslate} from '../../../locales/translate'
import AddressTile from '../../components/AddressTile'
import {formatDate} from '../../../services/string-utils'
import ClientFullName from './ClientFullName'

class ClientCoordinates extends React.PureComponent {
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
      const age = Math.abs(Math.floor(diff / 365.25))

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
    const {client, originOptionsById, messageOptionsById, linkedFiles, locale} = this.props
    const origin = originOptionsById[client.originId]
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <strong>Âge et coordonnées</strong>
            <hr />
            {this.renderAge(client.birthDate)}
            {client.email && client.email.length > 0 &&
              <span>
                <Icon name="mail-alt" className="mr-2" />{client.email}<br />
              </span>
            }
            {this.renderPhone(client.mainPhoneNumber, messageOptionsById)}
            {this.renderPhone(client.alternatePhoneNumber, messageOptionsById)}
            <div>
              <Icon name="home" className="mr-2" />
              <span>{origin}</span>
              <AddressTile address={client.address} />
            </div>
          </div>
          <div className="col-md-4 mt-2 mt-md-0">
            <strong>{this.message('links')}</strong>
            <hr />
            {linkedFiles.length > 0 && linkedFiles.map(link => (
              <div key={link.id}>
                <Link to={`/clients/${link.client.id}`}>
                  <ClientFullName client={link.client} locale={locale} />
                </Link>
              </div>
            ))}
          </div>
          <div className="col-md-4 mt-2 mt-md-0">
            <strong>Notes</strong>
            <hr />
            {client.notes && client.notes.length > 0 &&
              <div className="rendered-quill" dangerouslySetInnerHTML={{__html: client.notes}} />
            }
          </div>
        </div>
      </div>
    )
  }
}

ClientCoordinates.propTypes = {
  locale: PropTypes.string.isRequired,
  originOptionsById: PropTypes.object.isRequired,
  messageOptionsById: PropTypes.object.isRequired,
  linkedFiles: PropTypes.array.isRequired
}

export default ClientCoordinates
