import {omit, keyBy, forEach, map, sortBy, groupBy} from 'lodash'

export const getNodesById = (fields) => {
  const strippedNodes = map(fields, field => omit(field, 'parentId'))
  return keyBy(strippedNodes, 'id')
}

export const getOrderedNodesByParentId = (fields) => {
  const groupedNodes = groupBy(fields, 'parentId')
  const ret = {}
  forEach(groupedNodes, (nodes, parentId) => {
    const orderedNodes = sortBy(nodes, 'order')
    ret[parentId] = map(orderedNodes, 'id')
  })
  return ret
}
