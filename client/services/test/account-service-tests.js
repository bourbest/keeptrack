import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { clientToApi, clientFromApi } from '../account-service'

describe('account-service', function () {
  describe('clientFromApi', function () {
    it('should convert roles array into role object', function () {
      const client = {
        id: 1,
        roles: ['ABC', 'DEF']
      }

      const res = clientFromApi(client)
      expect(res.roles).to.be.an.object
      expect(res.roles.ABC).to.be.true
      expect(res.roles.DEF).to.be.true
    })

    it('sets an empty object as roles when no roles received', function () {
      const client = {
        id: 1
      }

      const res = clientFromApi(client)
      expect(res.roles).to.be.an.object
    })
  })

  describe('clientToApi', function () {
    it('should create an array with roles value set to true', function () {
      const client = {
        id: 1,
        roles: {
          set: true,
          notSet: false
        }
      }

      const res = clientToApi(client)
      expect(res.roles).to.be.an.array
      expect(res.roles.length).to.equal(1)
      expect(res.roles[0]).to.equal('set')
    })

    it('creates does not change passed data', function () {
      const client = {
        id: 1,
        roles: {
          test: 1
        }
      }

      const copy = cloneDeep(client)

      const res = clientFromApi(client)
      expect(res).to.be.not.equal(client)
      expect(client).to.deep.equal(copy)
    })
  })
})


