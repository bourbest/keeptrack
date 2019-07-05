import React from 'react'
import PropTypes from 'prop-types'

// Components
import FormLabel from '../../components/forms/FormLabel'
import {createTranslate} from '../../../locales/translate'
import {Form, Button} from '../../components/controls/SemanticControls'
import SelectClient from '../../components/behavioral/SelectClient'
import ClientFullName from '../../clients/components/ClientFullName'
import AddressTile from '../../components/AddressTile'

class ClientLinkForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('client-links', this)
    this.handleClientSelected = this.handleClientSelected.bind(this)
  }

  handleClientSelected (event) {}

  render () {
    const {locale, selectedClient} = this.props
    return (
      <Form>
        <div className="form-group">
          <FormLabel required>{this.message('otherClient')}</FormLabel>
          <SelectClient instanceId="clientId2" onClientSelected={this.props.onClientSelected} onChange={this.handleClientSelected} />

          {selectedClient &&
            <div className="box-fifth mb-1">
              <ClientFullName client={selectedClient} locale={locale} />
              <AddressTile address={selectedClient.address} />
              <div className="mt-2">
                {this.props.canCreateLink &&
                  <Button className="btn btn-primary" onClick={this.props.onCreateLink}>
                    {this.message('create')}
                  </Button>
                }
                {!this.props.canCreateLink &&
                  <span className="bg-warning p-1">{this.message('linkAlreadyExist')}</span>
                }
              </div>
            </div>
          }
        </div>
      </Form>
    )
  }
}

ClientLinkForm.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedClient: PropTypes.object,
  canCreateLink: PropTypes.bool.isRequired,
  onClientSelected: PropTypes.func.isRequired,
  onCreateLink: PropTypes.func.isRequired
}

export default ClientLinkForm
