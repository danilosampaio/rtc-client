# rtc-client [![Build Status](https://travis-ci.org/danilosampaio/rtc-client.svg?branch=master)](https://travis-ci.org/danilosampaio/rtc-client) [![Coverage Status](https://coveralls.io/repos/github/danilosampaio/rtc-client/badge.svg?branch=master)](https://coveralls.io/github/danilosampaio/rtc-client?branch=master)

> Nodejs client for the RTC(Rational Team Concert) Reportable REST API.

## Install

```
$ npm install --save rtc-client
```


## Usage

### Init RTC Client

```js
const RTCClient = require('rtc-client');

const rtc = new RTCClient({
    server: 'localhost',
    username: 'username',
    password: 'password'
});
await rtc.login();
```

### Get workitems using filters
```js
const workItens = await rtc.getWorkItems({
    filters: {
        'type/id': 'task',
        'id': 123
    }
})
```

### Get workitems specifying fields
```js
const workItens = rtc.getWorkItems({
    fields: ['id', 'summary'],
    filters: {
        'type/id': 'task',
        'id': 123
    }
})
```

### Get Contributors using filters
```js
const contributors = await rtc.getContributors({
    filters: {
        'itemId': '123'
    }
})
```

### Contructor options

`server`: RTC server address. Default value is 'localhost'.

`username`: user name for login.

`password`: password for login.

`protocol`: default value is 'https'.

`acceptUntrustedCertificates`: accept auto-assigned certificates: INSECURE. Default value is false.

`explicitArray`: on xml2json conversion, always put child nodes in an array if true; otherwise an array is created only if there is more than one. Default is true.



## License

MIT © [Danilo Sampaio](http://github.com/danilosampaio)
