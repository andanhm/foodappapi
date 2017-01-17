'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.VERSION = require('./package.json').version || 'undefined';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    // process.env.DEBUG = process.env.DEBUG || 'app,express:router,express:application,foodapi:*,mongodb';
    process.env.DEBUG = 'food-app:*';
}

const errSource = require('path').basename(__filename),
    debug = require('debug')('foodapi:app'),
    log = require('./handlers/logs.js'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    config = require('./config/' + process.env.NODE_ENV + '.json');

process.env.PORT = process.env.PORT || config.port;

debug('environment: ' + process.env.NODE_ENV);
debug('version: ' + process.env.VERSION);

if (process.env.NODE_ENV !== 'development') {
    createAppCluster();
} else {
    appInitiation();
}

function createAppCluster() {
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
        appInitiation()
    }
}

// Expose all express methods   
function appInitiation() {
    let express = require('express'),
        bodyParser = require('body-parser'),
        mongodbClient = require('./handlers/mongo/mongoClient'),
        app = express();

    app.set('env', process.env.NODE_ENV);
    app.set('port', process.env.PORT);
    app.set('debug', process.env.DEBUG);
    app.set('version', process.env.VERSION);

    app.disable('x-powered-by');
    app.disable('etag');

    app.use(require('cookie-parser')()); //Cookie parsing middleware
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
    //Display express server routes in your terminal
    //    require('express-routemap')(app);
    app.all((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,X-Access-Token, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', '36000');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    //Establishes connection to the mongodb
    mongodbClient.connect();

    /**
     * API routes
     */
    app.use(express.static(require('path').join(__dirname, 'public')));

    // Home Page of the service. Ideally should return 200 status for foodapi-health-check
    app.get('/', function(req, res) {
        res.status(200).type('json').send({
            error: {},
            version: app.get('version'),
            data: {
                message: `API running in ${process.env.NODE_ENV} mode`
            }
        });
    });

    /** 
     * Auth Middleware - This will check if the token is valid
     * Only the requests that start with /api will be checked for the token.
     * Any URL's that do not follow the below pattern should be avoided unless you 
     * are sure that authentication is not needed
     */
    app.all('/api/*', [require('./middelwares/authenticate')]);

    // Routes for user API
    require('./routes/user.js')(app);

    if (app.get('env') === 'development') {
        app.use((error, req, res, next) => {
            debug('http_status: %d, %s', error.status || 500, error.message);
            next(error);
        });
    }

    app.use((error, req, res) => {
        res.status(error.status || 404).type('json').send({
            error: {
                title: 'error',
                error: error,
                message: error.message,
                trace: error.stack
            },
            data: {}
        });
    });

    app.use((error, req, res) => {
        res.status(error.status || 500).type('json').send({
            error: {
                title: 'error',
                error: error,
                message: error.message,
                trace: error.stack
            },
            data: {}
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

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', () => {
        mongodbClient.getDb().close(() => {
            debug('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}