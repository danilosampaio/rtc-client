const _ = require('lodash');
const Utils = require('./Utils');

/**
 * This class represents the Contributor Resource in RTC API.
 */
class Contributor {

    /**
     * Contributor constructor.
     * 
     * @param {Object} rtcClient RTC client performs requests to the server using headers receveid on login.
     */
    constructor (rtcClient, options) {
        this.rtc = rtcClient;
        this.explicitArray = options && options.explicitArray !== undefined ? options.explicitArray : true;

        this.BUILT_IN_FIELDS = {
            itemId: {
                type: 'xs:string',
                selector: 'itemId'
            },
            name: {
                type: 'xs:string',
                selector: 'name'
            },
            emailAddress: {
                type: 'xs:string',
                selector: 'emailAddress'
            },
            userId: {
                type: 'xs:string',
                selector: 'userId'
            },
            archived: {
                type: 'xs:boolean',
                selector: 'archived'
            },
            contextId: {
                type: 'xs:string',
                selector: 'contextId'
            },
            itemType: {
                type: 'xs:string',
                selector: 'itemType'
            },
            modified: {
                type: 'xs:date',
                selector: 'modified'
            },
            modifiedBy: {
                type: 'com.ibm.team.repository.Contributor',
                selector: 'modifiedBy/(*)'
            },
            reportableUrl: {
                type: 'xs:string',
                selector: 'reportableUrl'
            },
            stateId: {
                type: 'xs:string',
                selector: 'stateId'
            },
            uniqueId: {
                type: 'xs:string',
                selector: 'uniqueId'
            }
        }
    }

    /**
     * Performs a request to RTC server to get a Contributor list based on params.
     * 
     * @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'itemId': 123
     *      }
     *   @params.fields: array of field names. It define Contributor fields to be retrived from server.
     *      Ex:
     *      ['itemId', 'name']
     */
    async getData (params) {
        try {
            const url = this.getURL(params);
            const result = await this.rtc.getRequest(url);
            const contributors = this.explicitArray ? result.foundation.contributor : [result.foundation.contributor];
            return this.parseContributors(contributors);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * It parses a list of contributors.
     * 
     * @param {Array} contributors list of workItems
     */
    parseContributors (contributors) {
        const parsedList = [];
        for (let index = 0; index < contributors.length; index++) {
            const contributor = _.extend(contributors[index], {});

            for (const fieldName in contributor) {
                if (contributor.hasOwnProperty(fieldName)) {
                    const fieldValue = contributor[fieldName];
                    contributor[fieldName] = Utils.parseBuiltInField(fieldName, fieldValue, this.BUILT_IN_FIELDS);
                }
            }
            parsedList.push(contributor);
        }
        return parsedList;
    }

    /**
     * Build the url to contributors based on params.
     * 
     * @param {Object} params object with the following properties:
     *   @params.filters: JSON object specifying filters. 
     *      Ex:
     *      {
     *          'type/id': 123
     *      }
     *   @params.fields: array of field names. It define contributor fields to be retrived from server.
     *      Ex:
     *      ['id', 'type/name', 'owner/(*)']
     */
    getURL (params) {
        const urlBase = `${this.rtc.protocol}://${this.rtc.server}/ccm/rpt/repository/foundation?fields=contributor/contributor`;
        return Utils.getURL(urlBase, params, this.BUILT_IN_FIELDS);
    }
}

module.exports = Contributor;