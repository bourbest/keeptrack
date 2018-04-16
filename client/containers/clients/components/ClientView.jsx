import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {find} from 'lodash'

// Components
import {Grid} from 'semantic-ui-react'
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
          <i className="phone icon"></i>
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
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ClientFullName client={client} locale={locale} /><br />
            {this.renderAge(client.birthDate)}
            {client.email && client.email.length > 0 &&
              <span>
                <i className="envelope icon"></i>{client.email}<br />
              </span>
            }
            {this.renderPhone(client.mainPhoneNumber)}
            {this.renderPhone(client.alternatePhoneNumber)}
            <span>
              <i className="home icon"></i>{origin.label}
            </span>
            <AddressTile address={client.address} />
          </Grid.Column>
          <Grid.Column>
            <h5>Notes</h5>
            {client.notes && client.notes.length > 0 &&
              <p>{client.notes}</p>
            }
            {(!client.notes || client.notes.length === 0) &&
              <p>Aucune note au dossier</p>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

ClientView.propTypes = {
  locale: PropTypes.string.isRequired,
  originOptionList: PropTypes.array.isRequired
}

export default ClientView
