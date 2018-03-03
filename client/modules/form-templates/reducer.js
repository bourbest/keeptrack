import config from './config'
import {omit, without, keyBy, forEach, map, sortBy, groupBy} from 'lodash'
import { baseInitialState, baseActionsHandler, inheritReducer } from '../common/reducers'
import { Actions } from './actions'
import { validateNode, validateNodes } from './validate'

const initialState = {...baseInitialState,
  // edited entity
  editedFormNodesById: {},
  editedFormNodesByParentId: {'c0': []},
  editedFormNodesErrors: {}
}

const getNodesById = (fields) => {
  const strippedNodes = map(fields, field => omit(field, 'parentId'))
  return keyBy(strippedNodes, 'id')
}

const getOrderedNodesByParentId = (fields) => {
  const groupedNodes = groupBy(fields, 'parentId')
  const ret = {}
  forEach(groupedNodes, (nodes, parentId) => {
    const orderedNodes = sortBy(nodes, 'order')
    ret[parentId] = map(orderedNodes, 'id')
  })
  return ret
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
  }
  return state
}

export default {
  [config.entityName]: inheritReducer(Actions, initialState, baseActionsHandler, specificReducer)
}
