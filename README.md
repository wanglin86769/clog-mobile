# Mobile web client for Clog

A mobile web client that communicates with the Clog Node.js web service, it provides functions of user login, reading logs, creating logs, updating logs and deleting logs.

![Alt text](docs/screenshots/architecture.png)

The link for Clog is as follows,

https://github.com/wanglin86769/clog2

## Technical solution

* Vue.js: front-end JavaScript framework
* Vuex: state management library
* PrimeVue: Vue.js component library
* axios: HTTP client library
* jsonwebtoken: An implementation of JSON Web Tokens

## Supported Node.js versions

The following Node.js versions have been tested,

* Node.js 18.13.0
* Node.js 17.9.1
* Node.js 16.19.0
* Node.js 15.14.0
* Node.js 14.21.3

## Menu items

* Home: logbook summary
* Logbook grouping: Logbook grouping list
* Logbooks: logbook list
* Tags: tag list
* Users: user info & permission list
* Languages: locale options
* About: software information

|                |                |                |
| -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/menu_zh.jpg) | ![Alt text](docs/screenshots/menu_en.jpg) | ![Alt text](docs/screenshots/about.jpg) |

## Basic information

List of logbook grouping, logbook, tag and user can be displayed.

|                |                |                |                |
| -------------- | -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/grouping_list.jpg) | ![Alt text](docs/screenshots/logbook_list.jpg) | ![Alt text](docs/screenshots/tag_list.jpg) | ![Alt text](docs/screenshots/user_list.jpg) |

## User login

Users can login via local database, LDAP or OAuth2 according to the configuration.

|                |                |                |
| -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/login_local.jpg) | ![Alt text](docs/screenshots/login_ldap.jpg) | ![Alt text](docs/screenshots/login_oauth2.jpg) |

## Read logs

|                |                |                |                |
| -------------- | -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/home.jpg) | ![Alt text](docs/screenshots/logbook.jpg) | ![Alt text](docs/screenshots/log_part1.jpg) | ![Alt text](docs/screenshots/log_part2.jpg) | 

## Create logs

|                |                |                |                |
| -------------- | -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/before_create.jpg) | ![Alt text](docs/screenshots/create.jpg) | ![Alt text](docs/screenshots/after_create.jpg) | ![Alt text](docs/screenshots/readback.jpg) | 

## Update logs

|                |                |                |                |
| -------------- | -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/before_update.jpg) | ![Alt text](docs/screenshots/prepare_update.jpg) | ![Alt text](docs/screenshots/update.jpg) | ![Alt text](docs/screenshots/after_update.jpg) |

## Delete logs

|                |                |                |                |
| -------------- | -------------- | -------------- | -------------- |
| ![Alt text](docs/screenshots/before_delete.jpg) | ![Alt text](docs/screenshots/prepare_delete.jpg) | ![Alt text](docs/screenshots/delete.jpg) | ![Alt text](docs/screenshots/after_delete.jpg) |

## Development and deployment

### Configuration

Edit the following files if needed,
```
./src/config/configuraion.js
```

### Development

```
npm install
npm run serve
```

### Deployment with Apache

```
npm install
npm run build
cp -r dist/* /var/www/html
```

### Visit web pages

By default, the web pages can be visited on Port 8080,
```
http://localhost:8080/
```

## Get Clog web service up and running

Refer to the following Clog repo,

https://github.com/wanglin86769/clog2

