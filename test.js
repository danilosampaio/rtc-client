import test from 'ava';
import RTCClient from './';
import Utils from './Utils';
import moment from 'moment';

test('getWorkItemtURL', t => {
    const rtc = new RTCClient({
        server: 'localhost'
    });
    
    const url = rtc.getWorkItemsURL({
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
    
    const url = rtc.getWorkItemsURL({
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
    
    const url = rtc.getWorkItemsURL({
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
    
    const url = rtc.getWorkItemsURL({
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

test('parseExtensions - integerValue', t => {
    const integerField = Utils.parseExtensions({
        key: [
            'id'
        ],
        helperId: [
            '_his_03KMEem7bJ9uqCX4HA'
        ],
        type: [
            'integerValue'
        ],
        booleanValue: [
            ''
        ],
        integerValue: [
            '123'
        ],
        longValue: [
            ''
        ],
        doubleValue: [
            ''
        ],
        smallStringValue: [
            ''
        ],
        displayName: [
            'ID'
        ],
        displayValue: [
            '123'
        ],
        mediumStringValue: [
            ''
        ],
        largeStringValue: [
            ''
        ],
        timestampValue: [
            ''
        ],
        decimalValue: [
            ''
        ]
    });
    const expected = {
        key: 'id',
        type: 'integerValue',
        helperId: '_his_03KMEem7bJ9uqCX4HA',
        integerValue: 123,
        displayValue: '123'
    };
	t.deepEqual(integerField, expected);
});

test('parseExtensions - timestampValue', t => {
    const integerField = Utils.parseExtensions({
        key: [
            'creationDate'
        ],
        helperId: [
            '_his_03KMEem7bJ9uqCX4HA'
        ],
        type: [
            'timestampValue'
        ],
        booleanValue: [
            ''
        ],
        integerValue: [
            ''
        ],
        longValue: [
            ''
        ],
        doubleValue: [
            ''
        ],
        smallStringValue: [
            ''
        ],
        displayName: [
            'Creation'
        ],
        displayValue: [
            '2019-05-09 16:43:15.419'
        ],
        mediumStringValue: [
            ''
        ],
        largeStringValue: [
            ''
        ],
        timestampValue: [
            '2019-05-09T16:43:15.419-0300'
        ],
        decimalValue: [
            ''
        ]
    });
    const expected = {
        key: 'creationDate',
        type: 'timestampValue',
        helperId: '_his_03KMEem7bJ9uqCX4HA',
        timestampValue: moment('2019-05-09T16:43:15.419-0300').toDate(),
        displayValue: '2019-05-09 16:43:15.419'
    };
	t.deepEqual(integerField, expected);
});
