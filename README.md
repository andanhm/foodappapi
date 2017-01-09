# Food App API using NodeJS

> This is a my Food App API for my android application. 

How the process get starts:

### Environment settings

To run the project in development mode (environment: development), you need to configure environment variable in your startup file (like **.bash_profile** or **.profile**)

```
$ npm start
```
## Version

The below will get you project version number and the project name

```curl
$ curl -X GET -H "Cache-Control: no-cache" "http://localhost:9010/foodapp/version"
```
**Response**

```json
{
  "app": "foodapp-api",
  "version": "1.0.0"
}
```
# User APIs
All the APIs that are explose can be found in `routes->user.js`.

## HTTP Response code

Current API entry format:

| HTTP Status Code | Description |
| --- | --- |
| OK (200) | This is the generic status code for a successfully processed request. |
| Created (201) | This is the generic status code for a successfully processed request. |
| Bad Request (400) | The service is unable to understand and process the request. |
| Not Found (404) | No results were found (on a search request), or object specified in URI does not exist. |
| Bad Request (422) | The request is well formed, but was unable to be completed or validated due to business logic constraints, missing data, etc.  |
| Internal Server Error (500) | The server encountered an unexpected condition which prevented it from fulfilling the request. |

# Food app API

## HTTP Response
```json
{
  error:{
    code: 1, // Unique error code defined in order to debug error easly(01)
    errSource: "", // File from where error occurred (userCtrl)
    function: "", // Function name (getUserStaus)
    message: "", // Message of the error (Unable to fetch the user information)
    description: "", // Description of the error message in detail
    time: "2016-12-19T19:23:59.617Z" // Error occurred time in ISO format
  },
  data:{}, // Valid Response information
  version:"1.0.0" // Determains the API version from the package version
}
```

## Unit Test
### Mocha
Mocha is a feature-rich JavaScript test framework running on Node.js
Allows unit test all the system APIs

```sh
$ npm test
```


## Loadtest Script
### Artillery
Artillery is a simple but powerful load testing toolkit.

```sh
$ sudo npm install -g artillery
```

**Create user**

```sh
$ artillery run user-create.json
```
Artillery scripts folder structure

```
- scripts /
    |__ artillery /
            |__ create /
                    |__ paload.csv
	    	    	|__ user-create.json
```

### Postman
Postman Food APP API collection

```
- scripts /
    |__ postman /
            |__ Food-App.postman_collection
```

## Directory structure
```
- docker /
    |__ Dockerfile
- scripts /
    |__ artillery /
            |__ create /
                    |__ paload.csv
	    	    	      |__ user-create.json
    |__ postman /
            |__ Food-App.postman_collection
- src/
	|__ package.json
    |__ public /
    |__ test /
			|__ apiTest.js
	|__ config /
			|__ development.json
			|__ producation.json 
			|__ testing.json                           
	|__ app.js
    |__ cleanup.js
	|__ controllers /
            |__ utilites /
                    |__ http.js
                    |__ time.js
    |__ handlers
            |__ mongo /
                  |__ db.js
                  |__ mongoClient.js
                  |__ mongoOperationalLog.js
            |__ logs.js
    |__ routes /
			|__ user.js
```

### Tech
Food App uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [MongoDB] - MongoDB is a free and open-source cross-platform document-oriented database program

### Installation - Testing

* Clone the branch from [Stash](https://github.com/andanhm/foodappapi.git).
* Install RabbitMQ, MongoDB, and Redis.
* Config the all the server details into one of the `config file`.

Install the dependencies and devDependencies and start the server.

```sh
$ cd foodappapi\src
$ npm install
$ npm start
```

License
----
© 

[node.js]: <http://nodejs.org>
[Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
[Express]: <http://expressjs.com>
[MongoDB]: <https://docs.mongodb.com/>
[AngularJS]: <http://angularjs.org>
