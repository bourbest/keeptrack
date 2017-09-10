import { expect } from 'chai'
import { isFieldRequired, isWithinRange, required, isNumber, buildRequiredFieldsSet } from '../validate'

const validator = {
  'sku': [required],
  'names.fr': [required],
  'costPrice': [isNumber],
  'pricingPerProfile': {
    'type': 'entitiesArray',
    'validator': {
      'pricingProfileId': [required],
      'pricingRule.discount': [isNumber, required],
      'pricingRule.pricingRuleType': [isNumber]
    }
  }
}

describe('isFieldRequired', function () {
  it('return true for sku', function () {
    const required = isFieldRequired('sku', validator)
    expect(required).to.be.true
  })

  it('returns false for not present prop (names.en)', function () {
    const required = isFieldRequired('names.en', validator)
    expect(required).to.be.false
  })

  it('returns true for prop name with dot (names.fr)', function () {
    const required = isFieldRequired('names.fr', validator)
    expect(required).to.be.true
  })

  it('returns true for nested prop with dot (pricingPerProfile.pricingRule.discount)', function () {
    const required = isFieldRequired('pricingPerProfile.pricingRule.discount', validator)
    expect(required).to.be.true
  })

  it('returns true for not present nested prop with dot (pricingPerProfile.pricingRule.pricingRuleType)', function () {
    const required = isFieldRequired('pricingPerProfile.pricingRule.pricingRuleType', validator)
    expect(required).to.be.false
  })
})

describe('buildRequiredFieldsSet', function () {
  it('returns set of required elements as fieldpath  ', function () {
    const result = buildRequiredFieldsSet(validator)
    const resultArray = [...result]
    const expectedKeys = ['sku', 'names.fr', 'pricingPerProfile.pricingProfileId', 'pricingPerProfile.pricingRule.discount']
    expectedKeys.forEach((key) => {
      expect(resultArray).to.include(key)
    })
    expect(result).to.have.property('size', 4)
  })
})



describe('isWithinRange', function () {
  
  it('throws given null value for both minValue and maxValue', function () {
    const errorWithinFunctioncreation = () => isWithinRange(null, null)

    expect(errorWithinFunctioncreation).to.throw
  })

  it('throws given minValue greater than maxValue', function() {
    const errorWithinFunctioncreation = () => isWithinRange(17, -4)

    expect(errorWithinFunctioncreation).to.throw
  })

  it('return a function that returns no error given a null max value and a value greater than the min value', function () {
    const minRangeValidator = isWithinRange(4, null)
    const goodValue = 7

    expect(minRangeValidator(goodValue)).to.be.null
  })

  it('return a function that returns min value error given a null max value and a value less than the min value', function () {
    const minValue = 4
    const minRangeValidator = isWithinRange(minValue, null)
    const wrongValue = 2

    expect(minRangeValidator(wrongValue)).to.be.deep.equals({error: 'commonErrors.invalidMinValue', params: {minValue}})
  })

  it('return a function that returns no error given a null min value and a value less than the max value', function () {
    const maxRangeValidator = isWithinRange(null, 0)
    const goodValue = -7

    expect(maxRangeValidator(goodValue)).to.be.null
  })

  it('return a function that return no error given a nought value for minValue and maxValue and a value  with the same nought value', function() {
    const maxRangeValidator = isWithinRange(0, 0)

    expect(maxRangeValidator(0)).to.be.null
  })

  it('return a function that returns max value error given a null min value and a value greater than the max value', function () {
    const maxValue = 10
    const maxRangeValidator = isWithinRange(null, maxValue)
    const wrongValue = 12

    expect(maxRangeValidator(wrongValue)).to.be.deep.equals({error: 'commonErrors.invalidMaxValue', params: {maxValue}})
  })
  
  it('returns a function that returns  no error given an in-ranged value', function () {
    const rangeFunction = isWithinRange(0, 47)

    expect(rangeFunction(25)).to.be.null
  })

  it('returns a function that return an error given an out-ranged value', function () {
    const minValue = 0
    const maxValue = 47

    const rangeFunction = isWithinRange(minValue, maxValue)

    expect(rangeFunction(100)).to.be.deep.equals({error: 'commonErrors.invalidRange', params: {minValue, maxValue}})
  })
})

describe('required', function(){
  it('return null message given non empty value', function () {
    const goodValue = 'non empty value'

    expect(required(goodValue)).to.be.null
  })

  it('return required error message given an empty value', function () {
    const emptyValue = ''

    expect(required(emptyValue)).to.be.equals('commonErrors.required')
  })

  it('return required error message given a null or undefined value', function () {
    expect(required(null)).to.be.equals('commonErrors.required')
    expect(required(undefined)).to.be.equals('commonErrors.required')
  })
})

