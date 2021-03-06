'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Require the dev-dependencies
const supertest = require('supertest'),
    should = require('should'), // eslint-disable-line
    config = require('../config/' + process.env.NODE_ENV + '.json'),
    server = supertest.agent(config.mochaTestURL);


describe('Food app health API -- ', function() {

    it('/GET', function(done) { //API test to determain the app version
        server
            .get('/')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.status.should.equal(200);
                res.body.should.have.property('version');
                done();
            });
    });

});
let token = {};

describe('Registering new user -- ', function() {
    let bodyCreateParameters = {
        username: 'andan',
        password: 'amma'
    }
    it('/POST', function(done) { //API test to determain the app version
        server
            .post('/user/')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(bodyCreateParameters)
            .expect('Content-type', /json/)
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                res.status.should.equal(201);
                token = res.body.data.token;
                done();
            });
    });
});