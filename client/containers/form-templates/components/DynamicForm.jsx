import React from 'react'
import PropTypes from 'prop-types'
import {pick} from 'lodash'
import config, {CONTROL_CONFIG_BY_TYPE, DOM_FIELD_OPTIONS} from '../../../modules/form-templates/config'
import {Form, Grid, Icon, Label} from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form'

import TextInput from '../../components/forms/TextField'
import Checkbox from '../../components/forms/Checkbox'
import TextArea from '../../components/forms/TextArea'
import RadioButtons from '../../components/forms/RadioButtons'
import CheckboxList from '../../components/forms/CheckboxList'
import SelectField from '../../components/forms/SearchableSelectField'
import DateField from '../../components/forms/DateField'
import FormHeader from '../../components/forms/FormHeader'
import FormParagraph from '../../components/forms/FormParagraph'
import RatingField from '../../components/forms/RatingField'

const CONTROL_MAP = {
  'input': TextInput,
  'textarea': TextArea,
  'checkbox': Checkbox,
  'radio-list': RadioButtons,
  'checkbox-list': CheckboxList,
  'combobox': SelectField,
  'date': DateField,
  'title': FormHeader,
  'paragraph': FormParagraph,
  'rating': RatingField,
  'grid': Grid
}

const Row = Grid.Row
const Col = Grid.Column

const DeleteHandle = (props) => (
  <Label corner className="deleteHandle" data-control-id={props.controlId}>
    <Icon name="delete" />
  </Label>
)

DeleteHandle.propTypes = {
  controlId: PropTypes.number.isRequired
}

class DynamicForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.renderControl = this.renderControl.bind(this)
    this.handleControlClicked = this.handleControlClicked.bind(this)
  }

  // ramasse tous les clicks qui surviennent dans le dynamicForm
  // on doit donc distinguer la sélection du delete
  handleControlClicked (event) {
    let el = event.target
    while (el !== null) {
      if (el.getAttribute) {
        const id = el.getAttribute('data-control-id')
        if (id) {
          if (el.classList.contains('deleteHandle')) {
            this.props.onFieldDeleted(id)
          } else {
            this.props.onFieldSelected(id)
          }
          return
        }
      }
      el = el.parentNode
    }
  }

  renderControl (controlId) {
    const {controlsById, locale, controlIdsByParentId, controlsErrorsById} = this.props
    const field = controlsById[controlId]
    const Control = CONTROL_MAP[field.controlType]
    const controlConfig = CONTROL_CONFIG_BY_TYPE[field.controlType]

    if (controlConfig.isLayout) {
      const children = controlIdsByParentId[controlId] || []
      const containerClass = field.id === this.props.selectedControlId ? 'selectedForEdit form-zone' : 'form-zone'
      return (
        <Grid key={controlId} columns={field.columnCount} data-control-id={controlId} className={containerClass}>
          <div className="ui top attached" style={{height: '20px'}}>
            <div className="grid-options">
              <Icon name="delete" className="deleteHandle grid-option" data-control-id={controlId} />
            </div>
          </div>
          <Row className="accept-drop drag-container" data-control-id={controlId}>
            {children.map(childId => {
              const childClasses = ['draggable']
              if (childId === this.props.selectedControlId) childClasses.push('selectedForEdit')
              if (controlsErrorsById[childId]) childClasses.push('with-error')

              return (
                <Col className={childClasses.join(' ')} key={childId} data-control-id={childId}>
                  <Label corner className="deleteHandle" data-control-id={childId}>
                    <Icon name="delete" />
                  </Label>
                  {this.renderControl(childId)}
                </Col>
              ) }
            )}
          </Row>
        </Grid>
      )
    } else if (controlConfig.isInput) {
      const options = pick(field, DOM_FIELD_OPTIONS)

      if (field.placeholders) {
        options.placeholder = field.placeholders[locale]
      }

      if (field.choices) {
        options.options = field.choices.map(c => {
          return {
            value: c.value,
            label: c.labels[locale],
            id: c.id
          }
        })
      }

      return (
        <Field
          key={controlId}
          id={`c${controlId}`}
          name={`c${controlId}`}
          label={field.labels[locale]}
          {...options}
          locale={locale}
          component={Control}
        />
      )
    } else {
      return <Control {...pick(field, DOM_FIELD_OPTIONS)} label={field.labels[locale]} />
    }
  }

  render () {
    if (!this.props.rootControlIds) return null

    return (
      <Form>
        <Grid columns={1}>
          <Row>
            <Col>
              <div className="container" id="0" onClick={this.handleControlClicked}>
                {this.props.rootControlIds.map(this.renderControl)}
              </div>
            </Col>
          </Row>
          <Row>
            <a href="#" onClick={this.props.onAddZone}>Ajouter une zone</a>
          </Row>
        </Grid>
      </Form>
    )
  }
}
DynamicForm.propTypes = {
  rootControlIds: PropTypes.array.isRequired,
  controlIdsByParentId: PropTypes.object.isRequired,
  controlsById: PropTypes.object.isRequired,
  controlsErrorsById: PropTypes.object.isRequired,
  selectedControlId: PropTypes.string,
  locale: PropTypes.string.isRequired,
  onFieldSelected: PropTypes.func.isRequired,
  onFieldDeleted: PropTypes.func.isRequired,
  onAddZone: PropTypes.func.isRequired
}

const DynamicFormConnected = reduxForm({
  form: config.testForm
})(DynamicForm)

export default DynamicFormConnected
