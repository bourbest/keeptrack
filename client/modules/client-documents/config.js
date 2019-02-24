import {values} from 'lodash'
export default {
  entityName: 'client-document'
}

export const DocumentStatus = {
  DRAFT: 'DRAFT',
  COMPLETE: 'COMPLETE'
}

export const AllDocumentStatus = values(DocumentStatus)
