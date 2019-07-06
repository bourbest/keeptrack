import config from './config'
import {omit, without} from 'lodash'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'
import { validateNode, validateNodes } from './validate'
import {getNodesById, getOrderedNodesByParentId} from './form-node-utils'

const initialState = {...baseInitialState,
  // edited entity
  editedFormNodesById: {},
  editedFormNodesByParentId: {'c0': []},
  editedFormNodesErrors: {},
  showArchivedChoices: false,
  showTemplateProperties: false
}

const setNodeInTree = (tree, parentId, beforeSiblingId, node) => {
  const newTree = omit(tree, parentId)
  let newLeaf = tree[parentId] || []
  newLeaf = [...newLeaf]
  if (beforeSiblingId === null) {
    newLeaf.push(node.id)
  } else {
    const idx = newLeaf.indexOf(beforeSiblingId)
    newLeaf.splice(idx, 0, node.id)
  }
  newTree[parentId] = newLeaf
  return newTree
}

const getChildrenIds = (editedFormNodesByParentId, parentId) => {
  const root = editedFormNodesByParentId[parentId]
  let ret = []

  if (root) {
    ret = ret.concat(root)
    for (let i = 0; i < root.length; i++) {
      ret = ret.concat(getChildrenIds(editedFormNodesByParentId, root[i]))
    }
  }
  return ret
}

const removeNodeFromTree = (tree, nodeId) => {
  for (let parentId in tree) {
    const branch = tree[parentId]
    const idx = branch.indexOf(nodeId)
    if (idx >= 0) {
      return {
        ...tree,
        [parentId]: without(branch, nodeId)
      }
    }
  }

  throw new Error('removeNodeFromTree invoded with a node id that did not exist')
}

const specificReducer = (state, action) => {
  let editedFormNodesById = null
  let editedFormNodesByParentId = null
  let editedFormNodesErrors = null

  switch (action.type) {
    case Actions.SET_EDITED_FORM_FIELDS:
      if (action.fields) {
        editedFormNodesById = getNodesById(action.fields)
        editedFormNodesByParentId = getOrderedNodesByParentId(action.fields)
        editedFormNodesErrors = validateNodes(action.fields)
      } else {
        editedFormNodesById = {}
        editedFormNodesByParentId = {'c0': []}
        editedFormNodesErrors = {}
      }

      return {
        ...state,
        editedFormNodesById,
        editedFormNodesByParentId,
        editedFormNodesErrors
      }

    case Actions.ADD_FIELD:
      const newField = action.field
      editedFormNodesById = {...state.editedFormNodesById, [newField.id]: newField}
      editedFormNodesByParentId = setNodeInTree(state.editedFormNodesByParentId, action.parentId, action.beforeSiblingId, newField)

      return {...state,
        editedFormNodesById,
        editedFormNodesByParentId
      }

    case Actions.DELETE_FIELD:
      const idsToRemove = getChildrenIds(state.editedFormNodesByParentId, action.fieldId)
      idsToRemove.push(action.fieldId)
      editedFormNodesByParentId = omit(state.editedFormNodesByParentId, idsToRemove)
      editedFormNodesById = omit(state.editedFormNodesById, idsToRemove)
      editedFormNodesErrors = omit(state.editedFormNodesErrors, idsToRemove)
      editedFormNodesByParentId = removeNodeFromTree(editedFormNodesByParentId, action.fieldId)

      return {
        ...state,
        editedFormNodesById,
        editedFormNodesByParentId,
        editedFormNodesErrors
      }

    case Actions.MOVE_FIELD:
      const {sourceParentId, targetParentId, fieldId, beforeSiblingId} = action
      const updatedSourceParentNodes = without(state.editedFormNodesByParentId[sourceParentId], fieldId)
      editedFormNodesByParentId = {...state.editedFormNodesByParentId, [sourceParentId]: updatedSourceParentNodes}

      const targetParentNodes = editedFormNodesByParentId[targetParentId] || []
      const newNodes = [...targetParentNodes]
      if (beforeSiblingId) {
        const idx = newNodes.indexOf(beforeSiblingId)
        newNodes.splice(idx, 0, fieldId)
      } else {
        newNodes.push(fieldId)
      }
      editedFormNodesByParentId[targetParentId] = newNodes

      return {...state, editedFormNodesByParentId}

    case Actions.UPDATE_FIELD_PROPERTIES:
      const node = {...action.newProperties}
      editedFormNodesById = {...state.editedFormNodesById}
      editedFormNodesById[node.id] = node
      const nodeError = validateNode(node)
      if (nodeError) {
        editedFormNodesErrors = {...state.editedFormNodesErrors, [node.id]: nodeError}
      } else {
        editedFormNodesErrors = omit(state.editedFormNodesErrors, node.id)
      }
      return {...state, editedFormNodesById, editedFormNodesErrors}

    case Actions.TOGGLE_SHOW_ARCHIVED_CHOICES:
      return {...state, showArchivedChoices: !state.showArchivedChoices}

    case Actions.TOGGLE_SHOW_TEMPLATE_PROPERTIES:
      return {...state, showTemplateProperties: !state.showTemplateProperties}

    case Actions.MOVE_SECTION:
      const sectionIds = state.editedFormNodesByParentId['c0']
      const targetSectionIndex = sectionIds.indexOf(action.sectionId)
      const swappedSectionId = sectionIds[targetSectionIndex + action.direction]
      if (swappedSectionId) {
        editedFormNodesByParentId = {...state.editedFormNodesByParentId}
        editedFormNodesByParentId['c0'] = [...editedFormNodesByParentId['c0']]
        editedFormNodesByParentId['c0'][targetSectionIndex] = swappedSectionId
        editedFormNodesByParentId['c0'][targetSectionIndex + action.direction] = action.sectionId
        return {...state, editedFormNodesByParentId}
      }
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
