const RequestAsync = require('./RequestAsync');
const XML2JSAsync = require('./XML2JSAsync');

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

        this.BUILT_IN_FIELDS_OF_WORKITEM = [
            'id', /* xs:integer */
            'resolutionDate', /* xs:time */
            'summary', /* xs:string */
            'creationDate', /* xs:time */
            'dueDate', /* xs:time */
            'description', /* xs:string */
            'workflowSurrogate', /* xs:string */
            'tags', /* xs:string */
            'duration', /* xs:long */
            'timeSpent', /* xs:long */
            'correctedEstimate', /* xs:long */
            'dayModified', /* xs:date */
            'creator/(*)', /* com.ibm.team.repository.Contributor */
            'owner/(*)', /* com.ibm.team.repository.Contributor */
            'category/(*)', /* com.ibm.team.workitem.Category */
            'comments/(*)', /* com.ibm.team.workitem.Comment */
            'customAttributes/(*)', /* com.ibm.team.repository.Attribute */
            'subscriptions/(*)', /* com.ibm.team.repository.Contributor */
            'projectArea/(*)', /* com.ibm.team.process.ProjectArea */
            'resolver/(*)', /* com.ibm.team.workitem.Contributor */
            'approvals/(*)', /* com.ibm.team.workitem.Approvals */
            'approvalDescriptors/(*)', /* com.ibm.team.workitem.ApprovalDescriptor */
            'target/(*)', /* com.ibm.team.process.Iteration */
            'foundIn/(*)', /* com.ibm.workitem.Deliverable */
            'itemHistory/(modified|state/(name))', /* com.ibm.team.workitem.WorkItem */
            'teamArea/(*)', /* com.ibm.team.process.TeamArea */
            'state/(*)', /* com.ibm.team.workitem.State */
            'resolution/(*)', /* com.ibm.team.workitem.Resolution */
            'type/(*)', /* com.ibm.team.workitem.WorkItemType */
            'severity', /* com.ibm.team.workitem.Literal */
            'priority', /* com.ibm.team.workitem.Literal */
            'parent/(id)', /* com.ibm.team.workitem.WorkItem */
            'children/(id)', /* com.ibm.team.workitem.WorkItem */
            'blocks/(id)', /* com.ibm.team.workitem.WorkItem */
            'dependsOn/(id)', /* com.ibm.team.workitem.WorkItem */
            'duplicatedBy/(id)', /* com.ibm.team.workitem.WorkItem */
            'duplicateOf/(id)', /* com.ibm.team.workitem.WorkItem */
            'related/(id)', /* com.ibm.team.workitem.WorkItem */
            'itemExtensions/(key|value/(*))', /* com.ibm.team.workitem.ItemExtensionEntry */
            'multiItemExtensions/(*)', /* com.ibm.team.workitem.MultiItemExtensionEntry */
            'mediumStringExtensions/(*)', /* com.ibm.team.repository.MediumStringExtensionEntry */
            'booleanExtensions/(*)', /* com.ibm.team.repository.BooleanExtensionEntry */
            'timestampExtensions/(*)', /* com.ibm.team.repository.TimestampExtensionEntry */
            'longExtensions/(*)', /* com.ibm.team.repository.LongExtensionEntry */
            'intExtensions/(*)', /* com.ibm.team.repository.IntExtensionEntry */
            'bigDecimalExtensions/(*)', /* com.ibm.team.repository.BigDecimalExtensionEntry */
            'largeStringExtensions/(*)', /* com.ibm.team.repository.LargeStringExtensionEntry */
            'stringExtensions/(*)', /* com.ibm.team.repository.StringExtensionEntry */
            'allExtensions/(*)', /* com.ibm.team.workitem.ExtensionEntry */
            'timeSheetEntries/(*)', /* com.ibm.team.workitem.TimeSheetEntry */
            'plannedStartDate', /* xs:time */
            'plannedEndDate', /* xs:time */
        ]
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

    async getWorkItems (params) {
        try {
            const url = this.getWorkItemtURL(params);
            const httpResponse = await this.request.get({
                url: url,
                headers: this.headers
            });

            const result = await this.xml2json.parseString(httpResponse.body);
            return result.workitem.workItem;
        } catch (e) {
            console.log(e);
        }
    }

    getWorkItemtURL (params) {
        const filters = [];
        if (params.filters) {
            for (const key in params.filters) {                
                if (params.filters.hasOwnProperty(key)) {
                    const valor = params.filters[key];
                    filters.push(`${key}=${valor}`);
                }
            }
        }

        const fields = params.fields || this.BUILT_IN_FIELDS_OF_WORKITEM;
        const builtInFields = [];
        const customFields = [];
        for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            if (this.BUILT_IN_FIELDS_OF_WORKITEM.indexOf(field) !== -1) {
                builtInFields.push(field);
            } else {
                customFields.push(field);
            }
        }

        const urlBase = `${this.protocol}://${this.server}/ccm/rpt/repository/workitem?fields=workItem/workItem`;
        const formattedFilters = filters.length ? `[${filters.join(' and ')}]/` : '/';
        const formattedFields = builtInFields.join('|');
        const formattedCustomFields = customFields.length ? `|allExtensions[key=${customFields.join(' or key=')}]/(*))` : ')';
        const url = `${urlBase}${formattedFilters}(${formattedFields}${formattedCustomFields}`;
        return url;
    }
}

module.exports = RTCClient;