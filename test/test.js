import test from 'ava';
import RTCClient from '../';
import Utils from '../Utils';
import moment from 'moment';
import http from 'http';
import mockserver from 'mockserver';

test.before(t => {
    t.context.server = http.createServer(mockserver('test/mocks'));
    t.context.server.listen(9001);
});

test('getWorkItems', async t => {
    const rtc = new RTCClient({
        server: 'localhost:9001',
        protocol: 'http',
        explicitArray:  false
    });
    
    const workItems = await rtc.getWorkItems({
        filters: {
            'type/id': 'task',
            'id': 123
        }
    })
    const expected = [{
        type: {
            name: "Task"
        },
        id: 123,
        summary: "Awesome Task",
        description: 'Awesome Task',
        creationDate: moment('2019-05-09T15:59:08.067-0300').toDate(),
        id: 123,
        state: {
            name: 'Doing',
        },
        allExtensions: [
            {
                displayValue: '999',
                helperId: '_his_03KMEem7bJ9uqCX4HA',
                integerValue: 999,
                key: 'customField1',
                type: 'integerValue',
            },
            {
                displayValue: 'Test 2',
                helperId: '_his_yHKMEem7bJ9uqCX4HA',
                key: 'customField2',
                smallStringValue: '_V6R_0DrdEeWhGKxJw2hj2A',
                type: 'smallStringValue',
            },
            {
                displayValue: 'Test 3',
                helperId: '_his__3KMEem7bJ9uqCX4HA',
                key: 'customField3',
                mediumStringValue: 'Test 3',
                type: 'mediumStringValue',
            },
            {
                displayValue: 'A large string...',
                helperId: '_his_-3KMEem7bJ9uqCX4HA',
                key: 'customField4',
                largeStringValue: 'A large string...',
                type: 'largeStringValue',
            },
            {
                displayValue: '2019-05-09 16:43:15.419',
                helperId: '_his_33KMEem7bJ9uqCX4HA',
                key: 'customField5',
                timestampValue: moment('2019-05-09T16:43:15.419-0300').toDate(),
                type: 'timestampValue',
            },
            {
                decimalValue: 20.36,
                displayValue: '20.36',
                helperId: '_hitABnKMEem7bJ9uqCX4HA',
                key: 'customField6',
                type: 'decimalValue',
            },
            {
                helperId: '_hitAHXKMEem7bJ9uqCX4HA',
                itemValue: '_48iXP9gLEeKjzZVCwlwn7g',
                key: 'customField7',
                type: 'itemValue',
                itemType: 'com.ibm.team.repository.Contributor'
            }
        ]
    }];

	t.deepEqual(workItems[0], expected[0]);
});

test('getContributors', async t => {
    const rtc = new RTCClient({
        server: 'localhost:9001',
        protocol: 'http',
        explicitArray:  false
    });
    
    const contributors = await rtc.getContributors({
        filters: {
            'itemId': '_Gtl3v81VEeKjzZVCwlwn7g'
        }
    })
    const expected = [{
        itemId: '_Gtl3v81VEeKjzZVCwlwn7g',
		uniqueId: '6215b7930b1364b0f9155628b56e372e',
		reportableUrl: 'https://s2clmg01/jts/rpt/repository/foundation/contributor/itemId/_Gtl3v81VEeKjzZVCwlwn7g',
		itemType: 'com.ibm.team.repository.Contributor',
		stateId: '_Lv2yjdihEeS0Fb6-Y9rrOQ',
		contextId: '_8lNyYNwSEd2pIJ5QVwgQGg',
		modified: moment('2015-04-01T15:59:11.767-0300').toDate(),
		emailAddress: 'danilo.sampaio@gmail.com',
		userId: '999',
		name: 'Danilo Sampaio',
		archived: false,
		modifiedBy: ''
    }];

	t.deepEqual(contributors[0], expected[0]);
});

test('getWorkItemtURL', t => {
    const rtc = new RTCClient({
        server: 'localhost',
        explicitArray:  false
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
                         'largeStringExtensions/(*)|stringExtensions/(*)|allExtensions/(*/*)|timeSheetEntries/(*)|' + 
                         'plannedStartDate|plannedEndDate)';
	t.is(url, expected);
});

test('getWorkItemtURL - informed fields', t => {
    const rtc = new RTCClient({
        server: 'localhost',
        explicitArray:  false
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
        server: 'localhost:8080',
        explicitArray:  false
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
        server: 'localhost:8080',
        explicitArray:  false
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

test('parseExtension - integerValue', t => {
    const integerField = Utils.parseExtension({
        key: 'id',
        helperId: '_his_03KMEem7bJ9uqCX4HA',
        type: 'integerValue',
        booleanValue: '',
        integerValue: '123',
        longValue: '',
        doubleValue: '',
        smallStringValue: '',
        displayName: 'ID',
        displayValue:'123',
        mediumStringValue: '',
        largeStringValue: '',
        timestampValue: '',
        decimalValue: ''
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

test('parseExtension - timestampValue', t => {
    const integerField = Utils.parseExtension({
        key: 'creationDate',
        helperId: '_his_03KMEem7bJ9uqCX4HA',
        type: 'timestampValue',
        booleanValue: '',
        integerValue: '',
        longValue: '',
        doubleValue: '',
        smallStringValue: '',
        displayName: 'Creation',
        displayValue: '2019-05-09 16:43:15.419',
        mediumStringValue: '',
        largeStringValue: '',
        timestampValue: '2019-05-09T16:43:15.419-0300',
        decimalValue: ''
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

test.after(t => {
    t.context.server.close(function () { console.log('Server closed!'); });
});