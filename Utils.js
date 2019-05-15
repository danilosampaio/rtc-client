const moment = require('moment');

class Utils {

}

/**
 * Convert 
 * 
 *      ['fieldName/(*)','fieldName2'] 
 * 
 *  to 
 * 
 *      {
 *          fieldName: {
 *              selector: 'fieldName/(*)'
 *          },
 *          fieldName2: {
 *              selector: 'fieldName2'
 *          }
 *      }
 */
Utils.parseFields = function (fields) {
    const result = {};

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        
        if (field.indexOf('/') !== -1) {
            const fieldName = field.split('/')[0];
            result[fieldName] = {
                selector: field
            }
        } else {
            result[field] = {
                selector: field
            }
        }
    }

    return result;
}

/**
 * Convert 
 * 
 *      ['fieldName/(*)','fieldName2'] 
 * 
 *  to 
 * 
 *      ['fieldName','fieldName2'] 
 */
Utils.parseFieldNames = function (fields) {
    const result = [];

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        
        if (field.indexOf('/') !== -1) {
            const fieldName = field.split('/')[0];
            result.push(fieldName);
        } else {
            result.push(field);
        }
    }

    return result;
}

/**
 * Convert 
 * 
 *      {
 *          'id': 123
 *      }
 * 
 *  to 
 * 
 *      '[id=123]'
 */
Utils.parseFilters = function (filters) {
    const result = [];
    
    if (filters) {
        for (const key in filters) {                
            if (filters.hasOwnProperty(key)) {
                const value = filters[key];
                result.push(`${key}=${value}`);
            }
        }
    }
    
    return result.length ? `[${result.join(' and ')}]/` : '/';
}

/**
 * urlBase: url part regards to RTC resource, e.g., workitem: https://localhost/ccm/rpt/repository/workitem?fields=workItem/workItem
 * params: fields, filters
 * BUILT_IN_FIELDS: built-in fields of the resource (workitem, foundation, etc.).
 */
Utils.getURL = function (urlBase, params, BUILT_IN_FIELDS) {
    const filters = Utils.parseFilters(params.filters);
    const fieldNames = params.fields ? Utils.parseFieldNames(params.fields) : Object.keys(BUILT_IN_FIELDS);
    const fields = params.fields ? Utils.parseFields(params.fields) : BUILT_IN_FIELDS;
    const builtInFields = [];
    const customFields = [];
    const customSelectors = [];
    for (let index = 0; index < fieldNames.length; index++) {
        const fieldName = fieldNames[index];
        if (BUILT_IN_FIELDS[fieldName] !== undefined) {
            if (fields[fieldName]) {
                builtInFields.push(fields[fieldName].selector);
            } else {
                builtInFields.push(BUILT_IN_FIELDS[fieldName].selector);
            }
        } else {
            customFields.push(fieldName);
            if (fields[fieldName].selector !== fieldName) {
                fields[fieldName].selector.split('/')[1];
                if (customSelectors.indexOf(fields[fieldName].selector) === -1) {
                    const selector = fields[fieldName].selector;
                    const selectorPrefix = selector.split('/')[0] + '/';
                    const selectorFields = selector.substring(selectorPrefix.length, selector.length);
                    if (selectorFields !== '(*)'){
                        customSelectors.push(selectorFields);
                    }
                }
            }
        }
    }

    const formattedFields = builtInFields.join('|');
    const formattedCustomFields =
        customFields.length
            ? `|allExtensions[key=${customFields.join(' or key=')}]/(${customSelectors.join('|') || '*'}))`
            : ')';
    const url = `${urlBase}${filters}(${formattedFields}${formattedCustomFields}`;
    return url;
}

Utils.parseExtensions = function (field) {
    const literalTypes = ['booleanValue','integerValue','longValue','doubleValue','smallStringValue',
        'mediumStringValue','largeStringValue','timestampValue','decimalValue'];
    const numberTypes = ['integerValue','longValue','doubleValue','decimalValue'];

    const fieldType = field.type[0];

    const obj = {
        key: field.key[0],
        type: fieldType,
        helperId: field.helperId[0]
    }
    
    if (literalTypes.indexOf(fieldType) !== -1) {
        if (numberTypes.indexOf(fieldType) !== -1){
            obj[fieldType] = Number(field[fieldType][0]);
        } else if (fieldType === 'timestampValue') {
            obj[fieldType] = moment(field[fieldType][0]).toDate();
        } else {
            obj[fieldType] = field[fieldType][0];
        }     
        obj['displayValue'] = field['displayValue'][0];
    } else {
        if (fieldType === 'itemValue') {
            obj['itemValue'] = field.itemValue[0] ? field.itemValue[0].itemId[0] : null;
        } else {
            for (const prop in field) {
                if (field.hasOwnProperty(prop)) {
                    const p = field[prop].length ? field[prop][0] : field[prop];
                    obj[prop] = p;
                }
            }
        }
    }

    return obj;
}

module.exports = Utils;