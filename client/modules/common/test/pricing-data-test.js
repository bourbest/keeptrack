export const getPricingProfiles = () => {
  return {
    1: {
      defaultPricingRule: {
        pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
        discount: 0.05
      },
      pricingProfilePerCategory: [
        {
          productCategoryId: 3,
          pricingProfileId: 1,
          pricingRule: {
            pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
            discount: 0.1
          }
        },
        {
          productCategoryId: 4,
          pricingProfileId: 1,
          pricingRule: {
            pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
            discount: 0.1
          }
        },
        {
          productCategoryId: 5,
          pricingProfileId: 1,
          pricingRule: {
            pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
            discount: 0.1
          }
        }
      ]
    },
    2: {
      defaultPricingRule: {
        pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
        discount: 0.05
      },
      pricingProfilePerCategory: [
        {
          productCategoryId: 4,
          pricingProfileId: 2,
          pricingRule: {
            pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
            discount: 0.1
          }
        },
        {
          productCategoryId: 5,
          pricingProfileId: 2,
          pricingRule: {
            pricingRuleType: 'DISCOUNT_ON_REGULAR_PRICE',
            discount: 0.1
          }
        }
      ]
    }
  }
}

export const getCategories = () => {
  return {
    '3': {
      id: 3
    },
    '4': {
      id: 4,
      parentCategoryId: 3
    },
    '5': {
      id: 5,
      parentCategoryId: 4
    }
  }
}

