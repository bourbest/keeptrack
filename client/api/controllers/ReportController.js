import {get, find, forEach} from 'lodash'
import {parseFilters, requiresRole} from '../middlewares'
import {FormTemplateRepository, ClientDocumentRespository} from '../repository'
import {convertFromDatabase} from '../repository/MongoRepository'
import {reportParametersSchema} from '../../modules/reports/schema'
import {CLIENT_FORM_ID} from '../../modules/const'
import {ClientLinkOptions} from '../../modules/form-templates/config'
import Excel from 'exceljs'
import ROLES from '../../modules/accounts/roles'

const getReportFields = (docTemplate, clientTemplate) => {
  const REPORTABLE_CONTROL_TYPES = ['date', 'checkbox', 'checkbox-list', 'radio-list', 'combobox', 'input', 'textarea', 'rich-text', 'address']
  const isOk = new Set(REPORTABLE_CONTROL_TYPES)
  const ret = []
  if (docTemplate.clientLink === ClientLinkOptions.MANDATORY) {
    ret.push({id: 'client.id', labels: {fr: 'Id participant', en: 'participant id', controlType: 'input'}})
    forEach(clientTemplate.fields, field => {
      if (isOk.has(field.controlType)) {
        field.id = 'client.' + field.id
        ret.push(field)
      }
    })
  }

  ret.push({id: 'id', labels: {fr: 'Id document', en: 'Document id'}, controlType: 'input'})
  forEach(docTemplate.fields, field => {
    if (isOk.has(field.controlType)) {
      field.id = 'values.' + field.id
      ret.push(field)
    }
  })

  return ret
}

const addFieldValueToArray = (ret, field, document, locale) => {
  const fieldValue = get(document, field.id, '')
  if (field.controlType === 'checkbox-list') {
    forEach(field.choices, choice => {
      if (!choice.isArchived) {
        // check if value is selected in the document
        if (fieldValue.indexOf(choice.id) > -1) {
          ret.push(1)
        } else {
          ret.push('')
        }
      }
    })
  } else if (field.controlType === 'address') {
    ret.push(fieldValue.civicNumber)
    ret.push(fieldValue.streetName)
    ret.push(fieldValue.app)
    ret.push(fieldValue.city)
    ret.push(fieldValue.postalCode)
  } else if (field.controlType === 'combobox' || field.controlType=== 'radio-list') {
    const choice = find(field.choices, {id: fieldValue})
    if (choice) {
      ret.push(get(choice.labels, locale, ''))
    } else {
      ret.push('')
    }
  } else if (field.controlType === 'rich-text') {
    ret.push({
      richText: [
        { text: fieldValue }
      ]
    })
  } else {
    ret.push(fieldValue)
  }
}

const getLineValues = (reportFields, document, locale) => {
  const line = []
  forEach(reportFields, field => {
    addFieldValueToArray(line, field, document, locale)
  })
  return line
}

const getHeaderNames = (fields, locale) => {
  const ret = []
  forEach(fields, field => {
    const fieldName = get(field.labels, locale, 'undefined')
    if (field.controlType === 'checkbox-list') {
      forEach(field.choices, choice => {
        if (!choice.isArchived) {
          ret.push(`${fieldName} - ${get(choice.labels, locale, '')}`)
        }
      })
    } else if (field.controlType === 'address') {
      ret.push(`${fieldName} - #`)
      ret.push(`${fieldName} - rue`)
      ret.push(`${fieldName} - app`)
      ret.push(`${fieldName} - ville`)
      ret.push(`${fieldName} - code postal`)
    } else {
      ret.push(fieldName)
    }
  })
  return ret
}

const generateReport = function (req, res, next) {
  const formRepo = new FormTemplateRepository(req.database)
  const docRepo = new ClientDocumentRespository(req.database)
  const {formTemplateId, fromDate, toDate, excludeIncompleteDocuments} = req.filters
  const promises = [
    formRepo.findById(formTemplateId),
    formRepo.findById(CLIENT_FORM_ID),
  ]

  const docCursor = docRepo.getDocumentsForReportCursor(formTemplateId, fromDate, toDate, excludeIncompleteDocuments)
  const hasDocs = docCursor.hasNext() // triggers the fetch
  Promise.all(promises).then(
    data => {
      const docTemplate = data[0]
      const clientTemplate = data[1]

      if (!docTemplate) throw {httpStatus: 404, message: 'form template not found'}
      if (!clientTemplate) throw {httpStatus: 500, message: 'client form not found'}

      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${docTemplate.name}.xlsx"`,
        'Transfer-Encoding': 'chunked',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res })
      const worksheet = workbook.addWorksheet(docTemplate.name)

      const reportFields = getReportFields(docTemplate, clientTemplate)

      worksheet.addRow(getHeaderNames(reportFields, 'fr')).commit()
      docCursor.each(function (err, document) {
        if (document) {
          if (document.client && document.client.length) {
            document.client = convertFromDatabase(document.client[0])
          } else {
            document.client = null
          }
          worksheet.addRow(getLineValues(reportFields, document, 'fr')).commit()
        } else {
          docCursor.close()
          worksheet.commit()
          workbook.commit()
        }
      })
    }
  ).catch(next)
}

export default (router) => {
  router.route('/reports/generate')
    .get([
      requiresRole(ROLES.statsProducer, false),
      parseFilters(reportParametersSchema),
      generateReport
    ])
}
