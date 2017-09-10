import {expect} from 'chai'
import {getEntityReferenceOrderValues, makeCompareEntities, compareStrings, buildHierarchicalName, buildSortedHierarchicalOptionList} from '../selectors'
import {values, map} from 'lodash'
function getCategoriesArray ()
{
  return {
    3: {
      id: 3,
      names: {
        en: 'Genie',
        fr: 'Éc'
      }
    },
    4: {
      id: 4,
      names: {
        en: 'Computer technology',
        fr: 'Éa'
      }
    },
    5: {
      id: 5,
      names: {
        en: 'Web development',
        fr: 'Eb'
      }
    }
  }
}

describe ('getEntityReferenceOrderValues', function () {
  it ('returns null when no clients provided', function () {
    const res = getEntityReferenceOrderValues(null, 'fr')
    expect(res).to.be.null
  })

  it ('returns object with sort values when given array of objects', function () {
    const categories = getCategoriesArray()
    const res = getEntityReferenceOrderValues(categories, 'fr')
    const expectedValue = {
      4: 0,
      5: 1,
      3: 2
    }
    expect(res).to.deep.equal(expectedValue)
  })
})

describe ('makeCompareEntities', function () {
  it ('returned function compares right properties', function () {
    const categories = values(getCategoriesArray())
    const sortParams = [{field: 'names.fr', order: 'asc', cmp: compareStrings}]
    const cmp = makeCompareEntities(sortParams)

    categories.sort(cmp)
    const orderedIds = map(categories, 'id')
    const expectedOrder = [4, 5, 3]
    expect(orderedIds).to.deep.equal(expectedOrder)
  })

  it ('returned function compares right properties in desc order', function () {
    const categories = values(getCategoriesArray())
    const sortParams = [{field: 'names.fr', direction: 'DESC', cmp: compareStrings}]
    const cmp = makeCompareEntities(sortParams)

    categories.sort(cmp)
    const orderedIds = map(categories, 'id')
    const expectedOrder = [3, 5, 4]
    expect(orderedIds).to.deep.equal(expectedOrder)
  })

  it('returns unsorted list when no sort params is empty array', function () {
    const categories = values(getCategoriesArray())
    const expectedOrder = map(categories, 'id')
    const sortParams = []
    const cmp = makeCompareEntities(sortParams)

    categories.sort(cmp)
    const orderedIds = map(categories, 'id')

    expect(orderedIds).to.deep.equal(expectedOrder)
  })

  it('returns unsorted list when sort params is null', function () {
    const categories = values(getCategoriesArray())
    const expectedOrder = map(categories, 'id')
    const sortParams = null
    const cmp = makeCompareEntities(sortParams)

    categories.sort(cmp)
    const orderedIds = map(categories, 'id')

    expect(orderedIds).to.deep.equal(expectedOrder)
  })
})

describe('buildHierarchicalName', function () {
  it('returns only the name for a root element', function () {
    const rootElement = {
      id: 1,
      name: 'test'
    }

    const entities = {
      1: rootElement
    }

    const result = buildHierarchicalName(rootElement, entities, 'name', 'parentId')

    expect(result).to.equal(rootElement.name)
  })

  it('returns puts parent names in front of entity name, separated by > ', function () {
    const rootElement = {
      id: 1,
      name: 'grand-parent'
    }

    const parentElement = {
      id: 2,
      name: 'parent',
      parentId: 1
    }

    const element = {
      id: 3,
      name: 'entity',
      parentId: 2
    }

    const entities = {
      1: rootElement,
      2: parentElement,
      3: element
    }

    const result = buildHierarchicalName(element, entities, 'name', 'parentId')

    expect(result).to.equal('grand-parent > parent > entity')
  })
})

describe('buildSortedHierarchicalOptionList', function () {
  it('returns all elements ordered by name and formatted with hierarchical names', function () {
    const rootElement = {
      id: 1,
      name: 'grand-parent'
    }

    const parentElement = {
      id: 2,
      name: 'parent',
      parentId: 1
    }

    const element = {
      id: 3,
      name: 'entity',
      parentId: 2
    }

    const entities = {
      1: rootElement,
      2: parentElement,
      3: element
    }

    const result = buildSortedHierarchicalOptionList(entities, 'name', 'parentId')

    expect(result.length).to.equal(3)
    expect(result[0].value).to.equal(1)
    expect(result[0].label).to.equal(rootElement.name)

    expect(result[1].value).to.equal(2)
    expect(result[1].label).to.equal('grand-parent > parent')

    expect(result[2].value).to.equal(3)
    expect(result[2].label).to.equal('grand-parent > parent > entity')
  })
})
