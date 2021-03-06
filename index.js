const RequestAsync = require('./RequestAsync');
const XML2JSAsync = require('./XML2JSAsync');
const WorkItem = require('./WorkItem');
const Contributor = require('./Contributor');

/**
 * The main classe of rtc-client module.
 */
class RTCClient {

    /**
     * RTCClient constructor.
     * 
     * @param {Object} options object with the following properties:
     *   @options.server: RTC server address. Default value is 'localhost'.
     *   @options.acceptUntrustedCertificates: accept auto-assigned certificates: INSECURE. Default value is false.
     *   @options.protocol: default value is 'https'.
     */
    constructor (options) {
        this.protocol = options.protocol || 'https';
        this.server = options.server || 'localhost';
        this.loginURL = `${this.protocol}://${this.server}/ccm/j_security_check`;
        this.loginPayload = {
            'j_username': options.username || null,
            'j_password': options.password || null
        }

        //accept auto-assigned certificates: INSECURE
        //TODO: use a more safe way to treat auto-assigned certificates
        if (options.acceptUntrustedCertificates) {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        }        

        //Wrapper for request using Promises.
        this.request = new RequestAsync();

        //header cookies used in requests after login.
        this.headers =  null;

        //explicitArray (default: true): on xml2json conversion, always put child nodes in an array if true; otherwise an array is created only if there is more than one.
        this.explicitArray = options.explicitArray !== undefined ? options.explicitArray : true;

        //Wrapper for xml2json using Promises.
        this.xml2json = new XML2JSAsync({explicitArray: this.explicitArray});

        this.workItem = new WorkItem(this, {explicitArray: this.explicitArray});
        this.contributor = new Contributor(this, {explicitArray: this.explicitArray});
    }

    /**
     * Authenticate on RTC server.
     * 
     * @param {string} username 
     * @param {string} password 
     */
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

    /**
     * Do a request using headers received by login.
     * 
     * @param {string} url 
     */
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

    /**
     * Get a list of workItems based on params.
     * 
     * @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'type/id': 123
     *      }
     *   @params.fields: array of field names. It define workItem fields to be retrived from server.
     *      Ex:
     *      ['id', 'type/name', 'owner/(*)']
     */
    async getWorkItems (params) {
        try {
            return await this.workItem.getData(params);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Build the url to workItems based on params.
     * 
     @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'type/id': 123
     *      }
     *   @params.fields: array of field names. It define workItem fields to be retrived from server.
     *      Ex:
     *      ['id', 'type/name', 'owner/(*)']
     */
    getWorkItemsURL (params) {
        return this.workItem.getURL(params);
    }

    /**
     * Get a list of contributors based on params.
     * 
     * @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'itemId': 123
     *      }
     *   @params.fields: array of field names. It define contributor fields to be retrived from server.
     *      Ex:
     *      ['itemId', 'name']
     */
    async getContributors (params) {
        try {
            return await this.contributor.getData(params);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Build the url to contributors based on params.
     * 
     @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'itemId': 123
     *      }
     *   @params.fields: array of field names. It define contributor fields to be retrived from server.
     *      Ex:
     *      ['itemId', 'name']
     */
    getContributorsURL (params) {
        return this.contributor.getURL(params);
    }
}

module.exports = RTCClient;