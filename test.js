import test from 'ava';
import RTCClient from './';

test('getWorkItemtURL', t => {
    const rtc = new RTCClient({
        server: 'localhost'
    });
    
    const url = rtc.getWorkItemtURL({
        filters: {
            'type/id': 'task',
            'id': 123
        }
    })
    const expected = 'https://localhost/ccm/rpt/repository/workitem?fields=workItem/workItem' + 
                        '[type/id=task and id=123]/' + 
                        '(id|resolutionDate|summary|creationDate|dueDate|description|workflowSurrogate|' + 
                         'tags|duration|timeSpent|correctedEstimate|dayModified|creator/(*)|owner/(*)|' + 
                         'category/(*)|comments/(*)|customAttributes/(*)|subscriptions/(*)|projectArea/(*)|' + 
                         'resolver/(*)|approvals/(*)|approvalDescriptors/(*)|target/(*)|foundIn/(*)|' + 
                         'itemHistory/(modified|state/(name))|teamArea/(*)|state/(*)|resolution/(*)|type/(*)|' + 
                         'severity|priority|parent/(id)|children/(id)|blocks/(id)|dependsOn/(id)|' + 
                         'duplicatedBy/(id)|duplicateOf/(id)|related/(id)|itemExtensions/(key|value/(*))|' + 
                         'multiItemExtensions/(*)|mediumStringExtensions/(*)|booleanExtensions/(*)|' + 
                         'timestampExtensions/(*)|longExtensions/(*)|intExtensions/(*)|bigDecimalExtensions/(*)|' + 
                         'largeStringExtensions/(*)|stringExtensions/(*)|allExtensions/(*)|timeSheetEntries/(*)|' + 
                         'plannedStartDate|plannedEndDate)';
	t.is(url, expected);
});

test('getWorkItemtURL - informed fields', t => {
    const rtc = new RTCClient({
        server: 'localhost'
    });
    
    const url = rtc.getWorkItemtURL({
        fields: ['id', 'summary'],
        filters: {
            'type/id': 'task',
            'id': 123
        }
    })
    const expected = 'https://localhost/ccm/rpt/repository/workitem?fields=workItem/workItem' + 
                        '[type/id=task and id=123]/' + 
                        '(id|summary)';
	t.is(url, expected);
});

test('getWorkItemtURL - Custom fields', t => {
    const rtc = new RTCClient({
        server: 'localhost:8080'
    });
    
    const url = rtc.getWorkItemtURL({
        filters: {
            'type/id': 'task',
            'id': 123
        },
        fields: [
            'id', 'summary', 'customField1/(*)'
        ]
    })
    const expected = 'https://localhost:8080/ccm/rpt/repository/workitem?fields=workItem/workItem' + 
                        '[type/id=task and id=123]/' + 
                        '(id|summary|allExtensions[key=customField1]/(*))';
	t.is(url, expected);
});

test('getWorkItemtURL - Custom fields with informed properties', t => {
    const rtc = new RTCClient({
        server: 'localhost:8080'
    });
    
    const url = rtc.getWorkItemtURL({
        filters: {
            'type/id': 'task',
            'id': 123
        },
        fields: [
            'id', 'summary', 'customField1/(*)', 'customField2/(itemValue/(*))'
        ]
    })
    const expected = 'https://localhost:8080/ccm/rpt/repository/workitem?fields=workItem/workItem' + 
                        '[type/id=task and id=123]/' + 
                        '(id|summary|allExtensions[key=customField1 or key=customField2]/((itemValue/(*))))';
	t.is(url, expected);
});
