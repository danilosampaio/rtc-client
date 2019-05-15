const Utils = require('./Utils');

class WorkItem {
    constructor (rtcClient) {
        this.rtc = rtcClient;

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
                selector: 'allExtensions/(*)',
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

    async getData (params) {
        try {
            const url = this.getURL(params);
            const result = await this.rtc.getRequest(url);
            const workItems = result.workitem.workItem;
            return this.parseExtensions(workItems.allExtensions);
        } catch (e) {
            console.log(e);
        }
    }

    getURL (params) {
        const urlBase = `${this.rtc.protocol}://${this.rtc.server}/ccm/rpt/repository/workitem?fields=workItem/workItem`;
        return Utils.getURL(urlBase, params, this.BUILT_IN_FIELDS);
    }

    parseExtensions (extensions) {
        const obj = {};
        for (let index = 0; index < extensions.length; index++) {
            const workItem = extensions[index];
            
            for (const key in workItem) {
                if (workItem.hasOwnProperty(key)) {
                    const field = workItem[key];
                    obj[key] = Utils.parseExtensions(field);
                }
            }
        }
        return obj;
    }
}

module.exports = WorkItem;