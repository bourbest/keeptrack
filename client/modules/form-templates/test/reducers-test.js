import { expect } from 'chai'
import config from '../config'

import {ActionCreators} from '../actions'
import reducers from '../reducer'
const reducer = reducers[config.storeBranch]

describe('form-templates reducer', function () {
  describe('SetEditedFormFields', function () {
    it('sets the editedFormFieldsById', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test'},
        {id: 2, parentId: 0, name: 'test 2'}
      ]
      const action = ActionCreators.setEditedFormFields(fields)
      const finalState = reducer(initialState, action)
      const expected = {
        1: {id: 1, name: 'test'},
        2: {id: 2, name: 'test 2'}
      }
      expect(finalState.editedFormNodesById).to.deep.equal(expected)
    })

    it('sets the editedFormFieldsByParentId', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      const action = ActionCreators.setEditedFormFields(fields)
      const finalState = reducer(initialState, action)
      const expected = {
        0: [4, 5, 1],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('initializes editedFormNodesErrors to an empty object when all provided fields are valid', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2, controlType: 'grid'},
        {id: 2, parentId: 1, name: 'test 2', order: 1, controlType: 'input', labels: { fr: 'test', en: 'test'}},
        {id: 5, parentId: 0, name: 'test 2', order: 1, controlType: 'grid'},
        {id: 4, parentId: 0, name: 'test 2', order: 0, controlType: 'grid'}
      ]
      const action = ActionCreators.setEditedFormFields(fields)
      const finalState = reducer(initialState, action)
      const expected = {}
      expect(finalState.editedFormNodesErrors).to.deep.equal(expected)
    })

    it('initializes the editedFormNodesErrors with errors for each invalid field provided', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2, controlType: 'grid'},
        {id: 2, parentId: 1, name: 'test 2', order: 1, controlType: 'input'}, // labels are missing
        {id: 3, parentId: 1, name: 'test 3', order: 2, controlType: 'input'},
        {id: 4, parentId: 1, name: 'test 4', order: 3, controlType: 'grid'}
      ]

      let action = ActionCreators.setEditedFormFields(fields)
      const finalState = reducer(initialState, action)

      const expected = {
        2: {
          labels: {
            fr: 'commonErrors.required',
            en: 'commonErrors.required'
          }
        },
        3: {
          labels: {
            fr: 'commonErrors.required',
            en: 'commonErrors.required'
          }
        }
      }
      expect(finalState.editedFormNodesErrors).to.deep.equal(expected)
    })
  })

  describe('MoveField', function () {
    it('removes the fieldId from the source parent when moving node from one parent to another', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.moveField(2, 1, 0, 4)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [2, 4, 5, 1],
        1: []
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('reorders node ids when moving nodes withing the same parent', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.moveField(4, 0, 0, 1)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [5, 4, 1],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('pushes the moved node id at the end of array when no sibling provided', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.moveField(4, 0, 0, null)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [5, 1, 4],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('works when moving to a previously empty parent', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.moveField(4, 0, 5, null)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [5, 1],
        1: [2],
        5: [4]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })
  })

  describe('AddField', function () {
    it('places field before provided sibling', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {id: 25}
      action = ActionCreators.addField(newField, 0, 1)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [4, 5, 25, 1],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('places field at the end when no sibling provided', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {id: 25}
      action = ActionCreators.addField(newField, 0, null)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [4, 5, 1, 25],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })

    it('works when adding to a previously empty parent', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {id: 25}
      action = ActionCreators.addField(newField, 4, null)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [4, 5, 1],
        1: [2],
        4: [25]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
    })
  })
  describe('updateFieldProperties', function () {
    it('updates the editedFormNodesById with the new properties', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2, controlType: 'input', labels: {fr: 'test', en: 'test'}}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {
        id: 1, parentId: 0, name: 'test', order: 2,
        controlType: 'input', labels: {fr: 'test', en: 'test 2'},
        maxLength: '254'
      }

      action = ActionCreators.updateFieldProperties(newField)
      const finalState = reducer(intermediateState, action)
      const expected = { 1: newField }
      expect(finalState.editedFormNodesById).to.deep.equal(expected)
    })

    it('add errors to editedFormNodesErrors when the updated field has an error', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2, controlType: 'input', labels: {fr: 'test', en: 'test'}},
        {id: 2, parentId: 0, name: 'test', order: 2, controlType: 'input', labels: {fr: 'test'}} // labels.en is missing
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {
        id: 1, parentId: 0, name: 'test', order: 2,
        controlType: 'input', labels: {fr: 'test'}
      }

      action = ActionCreators.updateFieldProperties(newField)
      const finalState = reducer(intermediateState, action)
      const expected = {
        1: {
          labels: {
            en: 'commonErrors.required'
          }
        },
        2: {
          labels: {
            en: 'commonErrors.required'
          }
        }
      }
      expect(finalState.editedFormNodesErrors).to.deep.equal(expected)
    })

    it('removes errors from editedFormNodesErrors when the updated field has no more errors', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 1, controlType: 'input', labels: {fr: 'test'}}, // both fields have errors
        {id: 2, parentId: 0, name: 'test', order: 2, controlType: 'input', labels: {en: 'test'}}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      const newField = {
        id: 1, parentId: 0, name: 'test', order: 2,
        controlType: 'input', labels: {fr: 'test', en: 'test'}
      }

      action = ActionCreators.updateFieldProperties(newField)
      const finalState = reducer(intermediateState, action)
      const expected = {
        2: {
          labels: {
            fr: 'commonErrors.required'
          }
        }
      }
      expect(finalState.editedFormNodesErrors).to.deep.equal(expected)
    })
  })

  describe('DeleteField', function () {
    it('removes node from tree', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.deleteField(4)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [5, 1],
        1: [2]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
      expect(finalState.editedFormNodesById[4] === undefined).to.equal(true)
    })

    it('removes children nodes from tree', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2},
        {id: 2, parentId: 1, name: 'test 2', order: 1},
        {id: 5, parentId: 0, name: 'test 2', order: 1},
        {id: 4, parentId: 0, name: 'test 2', order: 0}
      ]
      let action = ActionCreators.setEditedFormFields(fields)
      const intermediateState = reducer(initialState, action)

      action = ActionCreators.deleteField(1)
      const finalState = reducer(intermediateState, action)
      const expected = {
        0: [4, 5]
      }
      expect(finalState.editedFormNodesByParentId).to.deep.equal(expected)
      expect(finalState.editedFormNodesById[1] === undefined).to.equal(true)
      expect(finalState.editedFormNodesById[2] === undefined).to.equal(true)
    })

    it('remove last node set empty tree', function () {
      const initialState = reducer(undefined)
      const newField = {id: 25}
      let action = ActionCreators.setEditedFormFields([])
      let intermediateState = reducer(initialState, action)

      action = ActionCreators.addField(newField, 0, null)
      intermediateState = reducer(intermediateState, action)

      action = ActionCreators.deleteField(25)
      const finalState = reducer(intermediateState, action)

      expect(finalState.editedFormNodesByParentId).to.deep.equal({0: []})
      expect(finalState.editedFormNodesById).to.deep.equal({})
    })

    it('works if successive add / remove', function () {
      const initialState = reducer(undefined)
      const newField = {id: 25}
      let action = ActionCreators.setEditedFormFields([])
      let intermediateState = reducer(initialState, action)

      action = ActionCreators.addField(newField, 0, null)
      intermediateState = reducer(intermediateState, action)

      action = ActionCreators.deleteField(25)
      intermediateState = reducer(intermediateState, action)

      action = ActionCreators.addField(newField, 0, null)
      intermediateState = reducer(intermediateState, action)

      action = ActionCreators.deleteField(25)
      const finalState = reducer(intermediateState, action)

      expect(finalState.editedFormNodesByParentId).to.deep.equal({0: []})
      expect(finalState.editedFormNodesById).to.deep.equal({})
    })

    it('removes errors from node and all childrens', function () {
      const initialState = reducer(undefined)
      const fields = [
        {id: 1, parentId: 0, name: 'test', order: 2, controlType: 'grid'},
        {id: 2, parentId: 1, name: 'test 2', order: 1, controlType: 'input', maxLength: 'asdfsd'},
        {id: 3, parentId: 1, name: 'test 3', order: 2, controlType: 'input', maxLength: 'asdfsd'},
        {id: 4, parentId: 1, name: 'test 4', order: 3, controlType: 'input', maxLength: 'asdfsd'},
        {id: 5, parentId: 0, name: 'test 5', order: 3, controlType: 'input', labels: {fr: 'test'}} // missing en
      ]

      let action = ActionCreators.setEditedFormFields(fields)
      let intermediateState = reducer(initialState, action)

      action = ActionCreators.deleteField(1)
      const finalState = reducer(intermediateState, action)

      const expected = {
        5: {
          labels: {
            en: 'commonErrors.required'
          }
        }
      }
      expect(finalState.editedFormNodesErrors).to.deep.equal(expected)
    })
  })
})
