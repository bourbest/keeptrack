const {createRevision} = require('./common')
const {forEach, map, concat, filter, find, omit} = require('lodash')
const {ObjectId} = require('mongodb')

const REV_NUMBER = 6

function convertPresence (form, document, fields) {
  const idsToRemove = concat(map(fields, 'abs'), map(fields, 'na'))
  if (form) {
    form.fields = filter(form.fields, field => idsToRemove.indexOf(field.id) === -1)
    forEach(fields, fieldInfo => {
      const field = find(form.fields, {id: fieldInfo.pres})
      field.controlType = 'radio-list'
      field.labels = {
        fr: 'Présence',
        en: 'Presence'
      }
      field.required = true
      field.choices = [{
          labels: {fr: 'Présent(e)', en: 'Present'},
          id: '1'
        }, {
          labels: { fr: 'Absente - a avisé', en: 'Missing - Called'},
          id: '2'
        }, {
          labels: { fr: 'Absente - n\'a pas avisé', en: 'Missing - Did not call'},
          id: '3'
        }
      ]
    })
  } else if (document) {
    console.log('converting presence of document ' + document._id)
    const values = document.values
    forEach(fields, fieldInfo => {
      if (values[fieldInfo.pres] === true) {
        values[fieldInfo.pres] = '1'
      } else if (values[fieldInfo.abs][0] === '1') {
        values[fieldInfo.pres] = '2'
      } else if (values[fieldInfo.abs][0] === '2') {
        values[fieldInfo.pres] = '3'
      }
    })
    document.values = omit(document.values, idsToRemove)
  }
}

function convertPresence3 (form, document) {
  console.log('convertPresence3')
  const fields = [
    {pres: 'c5', abs: 'c7', na: 'c8'},
    {pres: 'c10', abs: 'c11', na: 'c12'},
    {pres: 'c15', abs: 'c16', na: 'c17'},
    {pres: 'c20', abs: 'c21', na: 'c22'},
    {pres: 'c25', abs: 'c26', na: 'c27'},
    {pres: 'c30', abs: 'c31', na: 'c32'},
    {pres: 'c35', abs: 'c36', na: 'c37'}
  ]
  convertPresence(form, document, fields)
}

function convertPresence2 (form, document) {
  console.log('convertPresence2')
  const fields = [
    {pres: 'c5', abs: 'c7', na: 'c8'},
    {pres: 'c10', abs: 'c11', na: 'c12'},
    {pres: 'c15', abs: 'c16', na: 'c25'},
    {pres: 'c20', abs: 'c21', na: 'c22'}
  ]
  convertPresence(form, document, fields)
}

function convertPresence1 (form, document) {
  console.log('convertPresence1')
  const fields = [
    {pres: 'c5', abs: 'c6', na: 'c7'},
    {pres: 'c10', abs: 'c11', na: 'c12'},
    {pres: 'c16', abs: 'c17', na: 'c18'},
    {pres: 'c21', abs: 'c22', na: 'c23'}
  ]
  convertPresence(form, document, fields)
}

function transformPriorityLevel (form, document) {
  // retire les trois cases à cocher de priorité
  const ids = ['c21', 'c22', 'c23']
  if (form) {
    forEach(ids, id => {
      const field = find(form.fields, {id})
      field.controlType = 'paragraph'
      field.labels.fr = `<b>${field.labels.fr}</b>`
    })
    form.fields.push({
      labels: {
        fr: 'Priorité',
        en: 'New field'
      },
      required: true,
      choices: [{
          labels: {
            fr: 'Élevé',
            en: 'High'
          },
          id: '1'
        }, {
          labels: {
            fr: 'Moyen',
            en: 'Average'
          },
          id: '2'
        }, {
          labels: {
            fr: 'Faible',
            en: 'Low'
          },
          id: '3'
        }],
      id: 'c31',
      parentId: 'c18',
      controlType: 'radio-list'
    })
  }

  if (document) {
    const values = document.values
    console.log(`old values c21: ${values.c21}  c22: ${values.c22}  c23: ${values.c23}`)
    if (values.c21) {
      values.c31 = '1'
    } else if (values.c22) {
      values.c31 = '2'
    } else if (values.c23) {
      values.c31 = '3'
    }
    console.log('new value: ' + values.c31)
    document.values = omit(document.values, ids)
  }
}

const formsToUpdate = [{
  formId: ObjectId('5c979a26f60a5a0b082bde6d'),
  fields: [{id: 'c14', type: 'yesno'}]
}, {
  formId: ObjectId('5cc1c090e0410100d09d6a9a'),
  fields: [
    {id: 'c2', type: 'yesno'},
    {id: 'c4', type: 'yesno'},
    {id: 'c12', type: 'yesno'},
    {id: 'c13', type: 'yesno'},
    {id: 'c14', type: 'yesno'},
    {id: 'c18', type: 'yesno'}
  ]
}, {
  formId: ObjectId('5cc1d0e9e0410100d09d6aa7'),
  fields: [
    {id: 'c280', type: 'yesno'},
    {id: 'c287', type: 'yesno'},
    {id: 'c282', type: 'yesno'},
    {id: 'c283', type: 'yesno'},
    {id: 'c284', type: 'yesno'},
    {id: 'c6', type: 'yesno'},
    {id: 'c8', type: 'yesno'},
    {id: 'c9', type: 'yesno'},
    {id: 'c43', type: 'yesno'},
    {id: 'c45', type: 'yesno'},
    {id: 'c49', type: 'yesno'},
    {id: 'c51', type: 'yesno'},
    {id: 'c53', type: 'yesno'},
    {id: 'c56', type: 'yesno'},
    {id: 'c58', type: 'yesno'},
    {id: 'c60', type: 'yesno'},
    {id: 'c108', type: 'yesno'},
    {id: 'c109', type: 'yesno'},

    {id: 'c111', type: 'yesno'},
    {id: 'c112', type: 'yesno'},
    {id: 'c123', type: 'yesno'},
    {id: 'c124', type: 'yesno'},
    {id: 'c127', type: 'yesno'},

    {id: 'c129', type: 'yesno'},
    {id: 'c131', type: 'yesno'},
    {id: 'c133', type: 'yesno'},
    {id: 'c135', type: 'yesno'},
    {id: 'c140', type: 'yesno'},
    {id: 'c142', type: 'yesno'},
    {id: 'c144', type: 'yesno'},
    {id: 'c146', type: 'yesno'},

    {id: 'c148', type: 'yesno'},
    {id: 'c153', type: 'yesno'},
    {id: 'c154', type: 'yesno'},
    {id: 'c164', type: 'yesno'},
    {id: 'c166', type: 'yesno'},
    {id: 'c168', type: 'yesno'},
    {id: 'c173', type: 'yesno'},
    {id: 'c175', type: 'yesno'},

    {id: 'c177', type: 'yesno'},
    {id: 'c179', type: 'yesno'},
    {id: 'c181', type: 'yesno'},
    {id: 'c183', type: 'yesno'},
    {id: 'c188', type: 'yesno'},
    {id: 'c190', type: 'yesno'},
    {id: 'c195', type: 'yesno'},
    {id: 'c198', type: 'yesno'},

    {id: 'c203', type: 'yesno'},
    {id: 'c205', type: 'yesno'},
    {id: 'c210', type: 'yesno'},
    {id: 'c212', type: 'yesno'},
    {id: 'c214', type: 'yesno'},
    {id: 'c216', type: 'yesno'},
    {id: 'c218', type: 'yesno'},
    {id: 'c220', type: 'yesno'},
    {id: 'c222', type: 'yesno'},
    {id: 'c224', type: 'yesno'},
    {id: 'c226', type: 'yesno'},
    {id: 'c228', type: 'yesno'},
    {id: 'c230', type: 'yesno'},
    {id: 'c235', type: 'yesno'},
    {id: 'c237', type: 'yesno'},
    {id: 'c239', type: 'yesno'},

    {id: 'c241', type: 'yesno'},
    {id: 'c243', type: 'yesno'},
    {id: 'c245', type: 'yesno'},
    {id: 'c247', type: 'yesno'},
    {id: 'c249', type: 'yesno'},
    {id: 'c251', type: 'yesno'},
    {id: 'c253', type: 'yesno'},
    {id: 'c255', type: 'yesno'},
    {id: 'c257', type: 'yesno'},
    {id: 'c259', type: 'yesno'},
    {id: 'c261', type: 'yesno'},
    {id: 'c263', type: 'yesno'},
    {id: 'c265', type: 'yesno'},
    {id: 'c267', type: 'yesno'},
    {id: 'c269', type: 'yesno'},
    {id: 'c271', type: 'yesno'},
    {id: 'c273', type: 'yesno'}
  ]
}, {
  formId: ObjectId('5ced79874c12c021cc481dac'),
  fields: [
    {id: 'c26', type: 'yesno'},
    {id: 'c29', type: 'yesno'},
    {id: 'c31', type: 'yesno'},
    {id: 'c70', type: 'yesno'},
    {id: 'c75', type: 'yesno'},
    {id: 'c77', type: 'yesno'},
    {id: 'c79', type: 'yesno'},
    {id: 'c81', type: 'yesno'},
    {id: 'c92', type: 'yesno'},
    {id: 'c94', type: 'yesno'},

    {id: 'c96', type: 'yesno'},
    {id: 'c101', type: 'yesno'},
    {id: 'c103', type: 'yesno'},
    {id: 'c105', type: 'yesno'},
    {id: 'c107', type: 'yesno'},
    {id: 'c109', type: 'yesno'},
    {id: 'c111', type: 'yesno'},
    {id: 'c116', type: 'yesno'}
  ]
}, {
  formId: ObjectId('5ced9e5b4c12c021cc481dae'),
  otherTransforms: [transformPriorityLevel],
  fields: [
    {id: 'c5', type: 'yesno'}
  ]
}, {
  formId: ObjectId('5ceea01e47f13c1bc4aae5ee'),
  otherTransforms: [convertPresence1]
}, {
  formId: ObjectId('5ceea05547f13c1bc4aae5ef'),
  otherTransforms: [convertPresence2]
}, {
  formId: ObjectId('5ceea3b147f13c1bc4aae5f0'),
  otherTransforms: [convertPresence3]
}]

function updateFormAndDocuments(db, formUpdate){
  const formsRepo = db.collection('FormTemplate')
  const docRepo = db.collection('ClientDocument')
  return formsRepo.findOne({_id: formUpdate.formId})
    .then(form => {
      console.log('updating form ' + form.name)
      forEach(formUpdate.fields, fieldUpdate => {
        console.log('updating field ' + fieldUpdate.id)
        const field = find(form.fields, {id: fieldUpdate.id})
        if (field) {
          field.controlType = 'radio-list'
        } else {
          console.log('field not found')
        }
      })
      forEach(formUpdate.otherTransforms, transform => transform(form))
      return formsRepo.replaceOne({_id: form._id}, form)
    }).then(() => {
      console.log('finding documents related to form')
      return docRepo.find({formId: formUpdate.formId}).toArray()
    }).then(documents => {
      console.log(`${documents.length} documents found`)
      const promises = []
      forEach(documents, document => {
        console.log('updating document id ' + document._id)
        if (formUpdate.fields) {
          for (let i = 0; i < formUpdate.fields.length; i++) {
            const propertyName = formUpdate.fields[i].id
            if (document.values[propertyName]) {
              document.values[propertyName] = document.values[propertyName][0]
            }
          }
        }
        if (formUpdate.otherTransforms) {
          forEach(formUpdate.otherTransforms, transform => {transform(null, document)})
        }
        promises.push(docRepo.replaceOne({_id: document._id}, document))
      })
      return Promise.all(promises)
    })
}

function updateForms (db) {
  const promises = []
  forEach(formsToUpdate, formData => {
    promises.push(updateFormAndDocuments(db, formData))
  })
  return Promise.all(promises)
    .then(() => db)
}

function applyRevision (db) {
  if (db.revision < REV_NUMBER) {
    console.log(`************* Apply revision ${REV_NUMBER} *****************`)
    return updateForms(db)
      .then(createRevision(REV_NUMBER, 'Ajustement des formulaires'))
      .then(function(db) {
        console.log(`------------ Revision ${REV_NUMBER} completed ---------------`) 
        return db
      })
  }
  return Promise.resolve(db)
}

module.exports = applyRevision