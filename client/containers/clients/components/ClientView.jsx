import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {find} from 'lodash'

// Components
import {Grid} from '../../components/controls/SemanticControls'
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
        age: moment().diff(birthDate, 'years'),
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
          <i className="phone icon" />
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
      <Grid columns={2}>
        <Grid.Column>
          <ClientFullName client={client} locale={locale} /><br />
          {this.renderAge(client.birthDate)}
          {client.email && client.email.length > 0 &&
            <span>
              <i className="envelope icon" />{client.email}<br />
            </span>
          }
          {this.renderPhone(client.mainPhoneNumber)}
          {this.renderPhone(client.alternatePhoneNumber)}
          <span>
            <i className="home icon" />{origin.label}
          </span>
          <AddressTile address={client.address} />
        </Grid.Column>
        <Grid.Column>
          {client.notes && client.notes.length > 0 &&
            <div>
              <h5>Notes</h5>
              <p>{client.notes}</p>
            </div>
          }
        </Grid.Column>
      </Grid>
    )
  }
}

ClientView.propTypes = {
  locale: PropTypes.string.isRequired,
  originOptionList: PropTypes.array.isRequired
}

export default ClientView
