const request = require('request');

class RequestAsync {
    post (params) {
        return new Promise((resolve, reject) => {
            request.post(params, function(err, httpResponse){
                if (err) {
                    reject(err);
                }

                resolve(httpResponse);
            });
        });
    }

    get (params) {
        return new Promise((resolve, reject) => {
            request.get(params, function(err, httpResponse) {
                if (err) {
                    reject(err);
                }

                resolve(httpResponse);
            });
        });
    }
}

module.exports = RequestAsync;