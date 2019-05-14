const RequestAsync = require('./RequestAsync');
const XML2JSAsync = require('./XML2JSAsync');
const WorkItem = require('./WorkItem');

class RTCClient {
    constructor (options) {
        this.protocol = options.protocol || 'https';
        this.server = options.server || 'localhost';
        this.loginURL = `${this.protocol}://${this.server}/ccm/j_security_check`;
        this.loginPayload = {
            'j_username': options.username || null,
            'j_password': options.password || null
        }

        //for auto-assigned certificates: INSECURE
        //TODO: to use a more secure way to accept auto-assigned certificates
        if (options.acceptUntrustedCertificates) {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        }        

        //Wrapper for request using Promises.
        this.request = new RequestAsync();

        //header cookies used in requests after login.
        this.headers =  null;

        this.xml2json = new XML2JSAsync();

        this.workItem = new WorkItem(this);
    }

    async login (username, password) {
        try {
            let loginPayload = null;
            if (username && password) {
                loginPayload = {
                    'j_username': username,
                    'j_password': password
                }
            } else {
                loginPayload = this.loginPayload;
            }

            const httpResponse = await this.request.post({
                url: this.loginURL,
                form: loginPayload,
                jar: true
            });

            const RTCCookie = httpResponse.headers['set-cookie'][0];
            this.headers = {
                'Cookie': RTCCookie
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getRequest (url) {
        try {
            const httpResponse = await this.request.get({
                url: url,
                headers: this.headers
            });

            const result = await this.xml2json.parseString(httpResponse.body);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getWorkItems (params) {
        try {
            return await this.workItem.getData(params);
        } catch (e) {
            console.log(e);
        }
    }

    getWorkItemtURL (params) {
        return this.workItem.getURL(params);
    }
}

module.exports = RTCClient;