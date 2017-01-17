'use strict';

/**
 * Auth Middleware - This will check if the token is valid
 * @module Auth Middleware
 * */

const tokenCtrl = require('../controllers/token');

module.exports = function(req, res, next) {

    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['X-Access-Token'];
    try {
        if (token) {
            tokenCtrl.isVaildToken(token, status => {
                if (status) {
                    next();
                } else {
                    res.status(401).type('json').send({
                        error: {
                            status: false,
                            message: 'Unauthorized / Invalid Token or Key'
                        },
                        data: {}
                    });
                }
            })
        } else {
            res.status(401).type('json').send({
                error: {
                    'status': false,
                    'message': 'Unauthorized'
                },
                data: {}
            });
        }
    } catch (err) {
        res.status(500).type('json').send({
            error: {
                status: false,
                message: 'Oops something went wrong',
                error: err
            },
            data: {}
        });
    }

};