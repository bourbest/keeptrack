import { expect } from 'chai'
import { translateError } from '../translate'
import i18next from 'i18next'

const errorObj = {
  error: 'objectMessage',
  params: {
    minValue: 2,
    maxValue: 7
  }
}

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'objectMessage': 'The value must be between {{minValue}} and {{maxValue}}',
        'simpleMessage': 'this is a simple message'
      }
    }
  }
}, function (err, t) {

  describe('translateError', function () {
    it('should build the english error message given en locale and and an error object with params', function () {
      const expectedErrorMessage = 'The value must be between 2 and 7'

      const translatedMessage = translateError(errorObj, 'en')

      expect(translatedMessage).to.equal(expectedErrorMessage)
    })

    it('return simple message given string error message', function() {
      const translatedMessage = translateError('simpleMessage')

      expect(translatedMessage).to.equal('this is a simple message')
    })

  })

})

