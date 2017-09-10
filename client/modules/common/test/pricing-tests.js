import { expect } from 'chai'
import { getPricingProfiles, getCategories } from './pricing-data-test'
import { getProductPriceForPricingProfile, findApplicablePricingRuleForCategory, computePrice } from '../pricing'

const sampleCostPricingRule = function () {
  return {
    pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
    discount: 0.15
  }
}

const getSampleProduct = function () {
  return {
    regularPrice: 100,
    mainCategoryId: 3,
    pricingPerProfile: [
      {
        pricingProfileId: 1,
        pricingRule: {
          pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
          discount: 0.15
        }
      }
    ]
  }
}

describe('computePrice', function () {
  it('throw an error when the rule type is not supported', function () {
    let product = getSampleProduct()
    let rule = sampleCostPricingRule()
    rule.pricingRuleType = 'UNSUPPORTED_TYPE'

    expect(() => computePrice(product, rule)).to.throw()
  })

  it('return the right price when the rule is on regular price', function () {
    let rule = sampleCostPricingRule()
    let product = getSampleProduct()
    let actualPrice = product.regularPrice * (1 - rule.discount / 100)
    const result = computePrice(product, rule)

    expect(result).to.be.equals(actualPrice)
  })
})

describe('findApplicablePricingRuleForCategory', function () {
  it('return the default rule when there is no pricingProfile for the category and the parent category id is null', function () {
    let categories = getCategories()
    let pricingProfile = getPricingProfiles()['2']

    const result = findApplicablePricingRuleForCategory(3, pricingProfile, categories)

    expect(result).to.be.deep.equals(pricingProfile.defaultPricingRule)
  })

  it('return the pricing rule of the main category when there is a match', function () {
    let categories = getCategories()
    let pricingProfile = getPricingProfiles()['1']
    let actualRule = pricingProfile.pricingProfilePerCategory[0].pricingRule

    const result = findApplicablePricingRuleForCategory(3, pricingProfile, categories)

    expect(result).to.be.deep.equals(actualRule)
  })
})

describe('getProductPriceForPricingProfile', function () {
  it('return the price for the rule if the product has a matching pricing profile ', function () {
    let categories = getCategories()
    let pricingProfiles = getPricingProfiles()
    let product = getSampleProduct()
    let expectedPrice = product.regularPrice * (1 - product.pricingPerProfile[0].pricingRule.discount / 100)

    const result = getProductPriceForPricingProfile(product, 1, categories, pricingProfiles)

    expect(result).to.be.equals(expectedPrice)
  })

  it('return the price for the inherited category rule if the product has no pricing profile ', function () {
    let categories = getCategories()
    let pricingProfiles = getPricingProfiles()
    let product = getSampleProduct()
    product.pricingPerProfile = null
    let expectedPrice = product.regularPrice * (1 - pricingProfiles['1'].pricingProfilePerCategory[0].pricingRule.discount / 100)

    const result = getProductPriceForPricingProfile(product, 1, categories, pricingProfiles)

    expect(result).to.be.equals(expectedPrice)
  })

})

