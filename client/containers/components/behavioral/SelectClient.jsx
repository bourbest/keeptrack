import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Async} from 'react-select'
import {omit, debounce} from 'lodash'
import {createService} from '../../../services/index'
import {getApiConfig} from '../../../modules/app/selectors'

class ClientOptions extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }
  handleMouseDown (event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.onSelect(this.props.option, event)
  }

  handleMouseEnter (event) {
    this.props.onFocus(this.props.option, event)
  }

  handleMouseMove (event) {
    if (this.props.isFocused) return
    this.props.onFocus(this.props.option, event)
  }

  render () {
    const client = this.props.option.client
    const {civicNumber, streetName, city} = client.address
    const hasAddress = civicNumber && civicNumber.length > 0
    const hasEmail = client.email && client.email.length > 0
    const phones = []
    if (client.mainPhoneNumber.value) phones.push(client.mainPhoneNumber.value)
    if (client.alternatePhoneNumber.value) phones.push(client.mainPhoneNumber.value)

    return (
      <div
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
      >
        <div className="flex">
          <div style={{width: '33%'}}>
            {this.props.children}
          </div>
          <div style={{width: '33%'}}>
            {phones.map((phone, index) => (
              <span key={index}>
                <i className="phone icon"></i>
                {phone}
                <br />
              </span>
            ))}
          </div>
          <div style={{width: '33%'}}>
            {hasAddress && (
              <span>
                <i className="home icon"></i>
                {civicNumber} {streetName} ({city})
                <br />
              </span>
            )}
            {hasEmail && (
              <span>
                <i className="envelope icon"></i>
                {client.email}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
}

ClientOptions.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  option: PropTypes.object.isRequired
}

const noFilter = option => option
class SelectClient extends React.Component {
  constructor (props) {
    super(props)
    this.getOptions = debounce(this.getOptions.bind(this), 200, {maxWait: 1000})
    this.handleValueChanged = this.handleValueChanged.bind(this)
  }

  componentDidMount () {
    const apiConfig = this.props.apiConfig
    this.clientService = createService('clients', apiConfig)
  }

  getOptions (input, callback) {
    this.clientService.findByNameStartingWith(input, 10)
      .then(clientFiles => {
        const options = clientFiles.map(c => ({
          client: c,
          value: c.id,
          label: c.firstName + ' ' + c.lastName
        }))
        callback(null, {options})
      })
      .catch(error => callback(error, null))
  }

  handleValueChanged (selectedOption) {
    const id = selectedOption ? selectedOption.value : null
    this.props.onChange(id)
    if (this.props.onClientSelected) {
      this.props.onClientSelected(selectedOption.client)
    }
  }

  render () {
    const props = omit(this.props, ['onChange', 'name', 'onBlur'])
    return (<Async
      loadOptions={this.getOptions}
      onChange={this.handleValueChanged}
      filterOptions={noFilter}
      autoload={false}
      optionComponent={ClientOptions}
      {...props}
    />)
  }
}

SelectClient.propTypes = {
  apiConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClientSelected: PropTypes.func,
  instanceId: PropTypes.string.isRequired
}

const mapStateToThis = (state) => {
  return {
    apiConfig: getApiConfig(state)
  }
}

const ConnectedSelectClient = connect(mapStateToThis)(SelectClient)
export default ConnectedSelectClient
