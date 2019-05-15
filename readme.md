# rtc-client [![Build Status](https://travis-ci.org/danilosampaio/rtc-client.svg?branch=master)](https://travis-ci.org/danilosampaio/rtc-client) [![Coverage Status](https://coveralls.io/repos/github/danilosampaio/rtc-client/badge.svg?branch=master)](https://coveralls.io/github/danilosampaio/rtc-client?branch=master)

> Nodejs client for the RTC Reportable REST API.

## Install

```
$ npm install --save rtc-client
```


## Usage

```js

const rtc = new RTCClient({
    server: 'localhost',
    username: 'username',
    password: 'password'
});
await rtc.login();

//get workitems bases on filters
const workItens = await rtc.getWorkItems({
    filters: {
        'type/id': 'task',
        'id': 123
    }
})

//get only informed fields
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
