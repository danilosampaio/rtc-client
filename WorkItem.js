const _ = require('lodash');
const Utils = require('./Utils');

/**
 * This class represents the WorkItem Resource in RTC API.
 */
class WorkItem {

    /**
     * WorkItem constructor.
     * 
     * @param {Object} rtcClient RTC client performs requests to the server using headers receveid on login.
     */
    constructor (rtcClient, options) {
        this.rtc = rtcClient;
        this.explicitArray = options && options.explicitArray !== undefined ? options.explicitArray : true;

        this.BUILT_IN_FIELDS = {
            id: {
                selector: 'id',
                type: 'xs:integer'
            },
            resolutionDate: {
                selector: 'resolutionDate',
                type: 'xs:time'
            },
            summary: {
                selector: 'summary',
                type: 'xs:string'
            },
            creationDate: {
                selector: 'creationDate',
                type: 'xs:time'
            },
            dueDate: {
                selector: 'dueDate',
                type: 'xs:time'
            },
            description: {
                selector: 'description',
                type: 'xs:string'
            },
            workflowSurrogate: {
                selector: 'workflowSurrogate',
                type: 'xs:string'
            },
            tags: {
                selector: 'tags',
                type: 'xs:string'
            },
            duration: {
                selector: 'duration',
                type: 'xs:long'
            },
            timeSpent: {
                selector: 'timeSpent',
                type: 'xs:long'
            },
            correctedEstimate: {
                selector: 'correctedEstimate',
                type: 'xs:long'
            },
            dayModified: {
                selector: 'dayModified',
                type: 'xs:date'
            },
            creator: {
                selector: 'creator/(*)',
                type: 'com.ibm.team.repository.Contributor'
            },
            owner: {
                selector: 'owner/(*)',
                type: 'com.ibm.team.repository.Contributor'
            },
            category: {
                selector: 'category/(*)',
                type: 'com.ibm.team.workitem.Category'
            },
            comments: {
                selector: 'comments/(*)',
                type: 'com.ibm.team.workitem.Comment'
            },
            customAttributes: {
                selector: 'customAttributes/(*)',
                type: 'com.ibm.team.repository.Attribute'
            },
            subscriptions: {
                selector: 'subscriptions/(*)',
                type: 'com.ibm.team.repository.Contributor'
            },
            projectArea: {
                selector: 'projectArea/(*)',
                type: 'com.ibm.team.process.ProjectArea'
            },
            resolver: {
                selector: 'resolver/(*)',
                type: 'com.ibm.team.workitem.Contributor'
            },
            approvals: {
                selector: 'approvals/(*)',
                type: 'com.ibm.team.workitem.Approvals'
            },
            approvalDescriptors: {
                selector: 'approvalDescriptors/(*)',
                type: 'com.ibm.team.workitem.ApprovalDescriptor'
            },
            target: {
                selector: 'target/(*)',
                type: 'com.ibm.team.process.Iteration'
            },
            foundIn: {
                selector: 'foundIn/(*)',
                type: 'com.ibm.workitem.Deliverable'
            },
            itemHistory: {
                selector: 'itemHistory/(modified|state/(name))',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            teamArea: {
                selector: 'teamArea/(*)',
                type: 'com.ibm.team.process.TeamArea'
            },
            state: {
                selector: 'state/(*)',
                type: 'com.ibm.team.workitem.State'
            },
            resolution: {
                selector: 'resolution/(*)',
                type: 'com.ibm.team.workitem.Resolution'
            },
            type: {
                selector: 'type/(*)',
                type: 'com.ibm.team.workitem.WorkItemType'
            },
            severity: {
                selector: 'severity',
                type: 'com.ibm.team.workitem.Literal'
            },
            priority: {
                selector: 'priority',
                type: 'com.ibm.team.workitem.Literal'
            },
            parent: {
                selector: 'parent/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            children: {
                selector: 'children/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            blocks: {
                selector: 'blocks/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            dependsOn: {
                selector: 'dependsOn/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            duplicatedBy: {
                selector: 'duplicatedBy/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            duplicateOf: {
                selector: 'duplicateOf/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            related: {
                selector: 'related/(id)',
                type: 'com.ibm.team.workitem.WorkItem'
            },
            itemExtensions: {
                selector: 'itemExtensions/(key|value/(*))',
                type: 'com.ibm.team.workitem.ItemExtensionEntry'
            },
            multiItemExtensions: {
                selector: 'multiItemExtensions/(*)',
                type: 'com.ibm.team.workitem.MultiItemExtensionEntry'
            },
            mediumStringExtensions: {
                selector: 'mediumStringExtensions/(*)',
                type: 'com.ibm.team.repository.MediumStringExtensionEntry'
            },
            booleanExtensions: {
                selector: 'booleanExtensions/(*)',
                type: 'com.ibm.team.repository.BooleanExtensionEntry'
            },
            timestampExtensions: {
                selector: 'timestampExtensions/(*)',
                type: 'com.ibm.team.repository.TimestampExtensionEntry'
            },
            longExtensions: {
                selector: 'longExtensions/(*)',
                type: 'com.ibm.team.repository.LongExtensionEntry'
            },
            intExtensions: {
                selector: 'intExtensions/(*)',
                type: 'com.ibm.team.repository.IntExtensionEntry'
            },
            bigDecimalExtensions: {
                selector: 'bigDecimalExtensions/(*)',
                type: 'com.ibm.team.repository.BigDecimalExtensionEntry'
            },
            largeStringExtensions: {
                selector: 'largeStringExtensions/(*)',
                type: 'com.ibm.team.repository.LargeStringExtensionEntry'
            },
            stringExtensions: {
                selector: 'stringExtensions/(*)',
                type: 'com.ibm.team.repository.StringExtensionEntry'
            },
            allExtensions: {
                selector: 'allExtensions/(*/*)',
                type: 'com.ibm.team.workitem.ExtensionEntry'
            },
            timeSheetEntries: {
                selector: 'timeSheetEntries/(*)',
                type: 'com.ibm.team.workitem.TimeSheetEntry'
            },
            plannedStartDate: {
                selector: 'plannedStartDate',
                type: 'xs:time'
            },
            plannedEndDate: {
                selector: 'plannedEndDate',
                type: 'xs:time'
            }
        }
    }

    /**
     * Performs a request to RTC server to get a workItem list based on params.
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
    async getData (params) {
        try {
            const url = this.getURL(params);
            const result = await this.rtc.getRequest(url);
            const workItems = this.explicitArray ? result.workitem.workItem : [result.workitem.workItem];
            return this.parseWorkItems(workItems);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Build the url to workItems based on params.
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
    getURL (params) {
        const urlBase = `${this.rtc.protocol}://${this.rtc.server}/ccm/rpt/repository/workitem?fields=workItem/workItem`;
        return Utils.getURL(urlBase, params, this.BUILT_IN_FIELDS);
    }

    /**
     * It parses a list of workItems. Data retrived from RTC server is polluted, so that is necessary to 
     * parse extensions to build a new workItem object.
     * 
     * @param {Array} workItems list of workItems
     */
    parseWorkItems (workItems) {
        const parsedList = [];
        for (let index = 0; index < workItems.length; index++) {
            const workItem = workItems[index];

            for (const fieldName in workItem) {
                if (fieldName !== 'allExtensions' && workItem.hasOwnProperty(fieldName)) {
                    const fieldValue = workItem[fieldName];
                    workItem[fieldName] = Utils.parseBuiltInField(fieldName, fieldValue, this.BUILT_IN_FIELDS);
                }
            }


            const extensions = workItem.allExtensions;
            const parsedWorkItem = _.extend(workItem, {});
            parsedWorkItem.allExtensions = [];

            for (let j = 0; j < extensions.length; j++) {
                const extension = extensions[j];
                parsedWorkItem.allExtensions.push(Utils.parseExtension(extension));
            }

            parsedList.push(parsedWorkItem);
        }
        return parsedList;
    }
}

module.exports = WorkItem;