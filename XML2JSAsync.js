const xml2js = require('xml2js');

class XML2JSAsync {
    constructor (options) {
        this.explicitArray = options && options.explicitArray !== undefined ? options.explicitArray : true;
    }

    parseString (xml) {
        const explicitArray = this.explicitArray;

        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser({explicitArray: explicitArray});
            parser.parseString(xml, function (err, result) {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });
        });
    }
}

module.exports = XML2JSAsync;