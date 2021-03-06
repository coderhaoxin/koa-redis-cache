'use strict'

const request = require('supertest')
const should = require('should')
const cache = require('..')
const koa = require('koa')

describe('## options - expire', () => {
  const options = {
    expire: 1
  }
  let app = koa()
  app.use(cache(options))
  app.use(function* () {
    this.body = {
      name: 'hello'
    }
  })

  app = app.listen(3003)

  describe('# get json', () => {
    it('no cache', (done) => {
      request(app)
        .get('/expire/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('from cache', (done) => {
      request(app)
        .get('/expire/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          res.headers['x-koa-redis-cache'].should.equal('true')
          res.body.name.should.equal('hello')
          done()
        })
    })

    it('timeout', (done) => {
      setTimeout(() => {
        done()
      }, 1500)
    })

    it('no cache', (done) => {
      request(app)
        .get('/expire/json')
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.equal(200)
          res.headers['content-type'].should.equal('application/json; charset=utf-8')
          should.not.exist(res.headers['x-koa-redis-cache'])
          res.body.name.should.equal('hello')
          done()
        })
    })
  })
})
