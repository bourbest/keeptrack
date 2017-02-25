import React from 'react'
import { browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { ActionCreators as FormTemplateActions } from '../../modules/form-template/actions'
import FormTemplateSelectors from '../../modules/form-template/selectors'

import EntityList from '../../components/EntityList'

const { object, string, array } = React.PropTypes

const mapStateToProps = (state) => {
  return {
    formTemplates: FormTemplateSelectors.getEntities(state),
    formTemplateFilter: FormTemplateSelectors.getListFilter(state),
    filteredFormTemplates: FormTemplateSelectors.getFilteredList(state),
    selectedItemIds: FormTemplateSelectors.getSelectedItemIds(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FormTemplateActions, dispatch)
  }
}

const formatName = (form) => form.name

class ManageFormTemplates extends React.Component {
  constructor (props) {
    super(props)

    this.handleFilterEvent = this.handleFilterEvent.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.deleteSelected = this.deleteSelected.bind(this)
  }
  componentWillMount () {
    this.props.actions.fetchAll()
    this.props.actions.setEditedEntity(null)
  }
  handleFilterEvent (event) {
    this.props.actions.setListFilter(event.target.value)
  }
  createNewFile () {
    browserHistory.push('/form-template/create')
  }
  deleteSelected () {
    this.props.actions.deleteEntities(this.props.selectedItemIds)
  }
  render () {
    return (
      <div>
        <button onClick={this.createNewFile}>Nouveau formulaire</button>
        <button onClick={this.deleteSelected}>Supprimer</button>
        <input type='text' className='search-input' placeholder='search' value={this.props.formTemplateFilter} onChange={this.handleFilterEvent} />
        <div>
          <EntityList entities={this.props.filteredFormTemplates}
            onToggleSelected={this.props.actions.toggleSelectedItem}
            selectedItemIds={this.props.selectedItemIds}
            linkTo={'/form-template'}
            formatName={formatName} />
        </div>
      </div>
    )
  }
}

ManageFormTemplates.propTypes = {
  actions: object.isRequired,
  formTemplateFilter: string.isRequired,
  formTemplates: object.isRequired,
  filteredFormTemplates: array.isRequired,
  selectedItemIds: array.isRequired,
  params: object
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageFormTemplates)
