# rtc-client [![Build Status](https://travis-ci.org/danilosampaio/rtc-client.svg?branch=master)](https://travis-ci.org/danilosampaio/rtc-client) [![Coverage Status](https://coveralls.io/repos/github/danilosampaio/rtc-client/badge.svg?branch=master)](https://coveralls.io/github/danilosampaio/rtc-client?branch=master)

> Nodejs client for the RTC(Rational Team Concert) Reportable REST API.

## Install

```
$ npm install --save rtc-client
```


## Usage

```js
const RTCClient = require('rtc-client');

const rtc = new RTCClient({
    server: 'localhost',
    username: 'username',
    password: 'password'
});
await rtc.login();

//get workitems using filters
const workItens = await rtc.getWorkItems({
    filters: {
        'type/id': 'task',
        'id': 123
    }
})

//get workitems specifying the fields
const workItens = rtc.getWorkItems({
    fields: ['id', 'summary'],
    filters: {
        'type/id': 'task',
        'id': 123
    }
})
```



## License

MIT © [Danilo Sampaio](http://github.com/danilosampaio)
