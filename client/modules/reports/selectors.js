import config from './config'

const Selectors = {}

Selectors.getDistributionList = state => state[config.entityName].distributionList
Selectors.isFetchingDistributionList = state => state[config.entityName].isFetchingDistributionList

export default Selectors
