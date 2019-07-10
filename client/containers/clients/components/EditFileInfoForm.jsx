import React from 'react'
import PropTypes from 'prop-types'

// Components
import { reduxForm, Field } from 'redux-form'
import {Input, DateInput, FieldWrapper} from '../../components/forms'
import {createTranslate} from '../../../locales/translate'
import {Form} from '../../components/controls/SemanticControls'

// module stuff
import config from '../../../modules/uploaded-files/config'

import {validateReviewFilesForm} from '../../../modules/uploaded-files/schema'

class EditFileInfoForm extends React.PureComponent {
  constructor (props) {
    super(props)
    this.message = createTranslate('editFileInfo', this)
  }

  render () {
    const {locale, files, progresses} = this.props
    return (
      <Form>
        <table>
          <thead>
            <tr>
              <td className="w-50">{this.message('documentTitle')}</td>
              <td className="w-25">{this.message('documentDate')}</td>
              <td className="w-25" />
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => {
              const baseFieldName = `files[${index}]`
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={Input} name={`${baseFieldName}.name`} locale={locale} autoComplete="off" />
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-start">
                      <Field component={FieldWrapper} InputControl={DateInput} name={`${baseFieldName}.documentDate`} locale={locale} />
                    </div>
                  </td>
                  <td className="d-flex justify-content-end">
                    {progresses.length > index && (
                      <div className="progress w-100">
                        <div className="progress-bar" style={{width: `${progresses[index]}%`}}>
                          {progresses[index]}%
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Form>
      )
  }
}

EditFileInfoForm.propTypes = {
  locale: PropTypes.string.isRequired,
  progresses: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired
}

const ConnectedEditFileInfoForm = reduxForm({
  form: config.entityName,
  validate: validateReviewFilesForm
})(EditFileInfoForm)

export default ConnectedEditFileInfoForm
