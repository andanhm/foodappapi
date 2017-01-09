'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.VERSION = require('./package.json').version || 'undefined';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    process.env.DEBUG = process.env.DEBUG || 'app,express:router,express:application,foodapi:*,mongodb';
    // process.env.DEBUG = '';
}

var errSource = require('path').basename(__filename),
    debug = require('debug')('foodapi:app'),
    log = require('./handlers/logs.js'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    config = require('./config/' + process.env.NODE_ENV + '.json'),
    appVersion = process.env.VERSION;

process.env.PORT = process.env.PORT || config.port;

debug('environment: ' + process.env.NODE_ENV);
debug('version: ' + process.env.VERSION);


// Check if the master process is running
if (cluster.isMaster) {

    // Fork workers.
    var i = 0;
    for (i = 0; i < numCPUs * config.multiples; i += 1) {
        cluster.fork();
        debug('Cluster forked ' + i);
    }

    cluster.on('exit', function(worker, code, signal) {
        debug('worker ' + worker.process.pid + ' died with code: ' + code + ' signal: ' + signal);
        //fork an new process if app crashes
        if (code !== 0) {
            cluster.fork();
            debug('New process folked');
        }
    });

    cluster.on('online', function(worker) {
        debug('A worker with #' + worker.id + ' has started');
    });

    cluster.on('listening', function(worker, address) {
        debug('A worker with #' + worker.id + ' has started');
        debug('A worker is now connected to ' + address.address + ':' + address.port);
    });
}

if (cluster.isWorker) {
    var express = require('express'),
        bodyParser = require('body-parser'),
        app = express();

    app.set('env', process.env.NODE_ENV);
    app.set('port', process.env.PORT);
    app.set('debug', process.env.DEBUG);
    app.set('version', process.env.VERSION);

    app.disable('x-powered-by');
    app.disable('etag');
    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    //Create a middleware that adds a X-Response-Time header to responses.
    app.use(require('response-time')());

    //Create a middleware that adds a X-App-Version header to responses.
    app.use((req, res, next) => {
        res.setHeader('X-App-Version', app.get('version'));
        next();
    });

    app.all((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', '36000');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    require('./handlers/mongo/mongoClient').connect((err) => {
        if (err) {
            debug('MongoDb connection error');
        }
    });
    /**
     * API routes
     */
    app.use(express.static(require('path').join(__dirname, 'public')));

    // Home Page of the service. Ideally should return 'ok' for foodapi-health-check
    app.get('/', function(req, res) {
        res.status(200).type('json').send({
            error: {},
            data: {
                message: `API running in ${process.env.NODE_ENV} mode`
            }
        });
    });
    // Routes for user API
    require('./routes/user.js')(app);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        var error = new Error('Are you lost?');
        error.status = 404;
        next(error);
    });

    if (app.get('env') === 'development') {
        app.use((error, req, res, next) => {
            debug('http_status: %d, %s', error.status || 500, error.message);
            next(error);
        });
    }

    app.use((error, req, res, next) => {
        res.status(error.status || 500).send({
            error: {
                title: 'error',
                error: error,
                message: error.message,
                trace: error.stack
            },
            data: {},
            version: appVersion
        });
    });

    var server = app.listen(app.get('port'), () => {
        debug('Express server listening on port ' + server.address().port);
    });

    process.on('exit', (code) => {
        debug('Cleaning up ... code %s ', code);
        require('./cleanup')(app);
        debug('Exiting !!!');
    });

    process.on('uncaughtException', (error) => {
        log.enterErrorLog('', errSource, 'process.on->uncaughtException', 'Unhandled exception', JSON.stringify(error), '');
        console.log({
            title: 'error',
            error: error,
            message: error.message,
            trace: error.stack
        });
        process.exit(1);
    });

    process.on('SIGINT', function() {
        debug('gotta exit - SIGINT');
        process.exit(0);
    });
}