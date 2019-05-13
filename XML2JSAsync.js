const xml2json = require('xml2js').parseString;

class XML2JSAsync {
    parseString (xml) {
        return new Promise((resolve, reject) => {
            xml2json(xml, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    }
}

module.exports = XML2JSAsync;