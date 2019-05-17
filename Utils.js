const moment = require('moment');

class Utils {

}

/**
 * Convert a list of fields to a JSON Object.
 * 
 * @param {Array} fields list of fields.
 * 
 * Input:
 * 
 *      ['fieldName/(*)','fieldName2'] 
 * 
 * Output:
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
Utils.convertFieldList2JSON = function (fields) {
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
 * Extract field names from a list of fields.
 * 
 * @param {Array} fields list of fields.
 * 
 *  Input:
 * 
 *      ['fieldName/(*)','fieldName2'] 
 * 
 *  Output 
 * 
 *      ['fieldName','fieldName2'] 
 */
Utils.extractFieldNames = function (fields) {
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
 * Convert filters to RTC url format.
 * 
 * @param {Object} filters Object with key and value specifying filters.
 * 
 *  Input:
 * 
 *      {
 *          'id': 123
 *      }
 * 
 *  Output: 
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
 * Build the url to workItems based on params.
 * 
 * @param {string} urlBase url part regards to RTC resource, 
 *  e.g., workitem: https://localhost/ccm/rpt/repository/workitem?fields=workItem/workItem
 * @param {Object} params object with the following properties:
 *   @params.filters: JSON object specifying filters. 
 *      Ex:
 *      {
 *          'type/id': 123
 *      }
 *   @params.fields: array of field names. It define workItem fields to be retrived from server.
 *      Ex:
 *      ['id', 'type/name', 'owner/(*)']
 * @param {Object} BUILT_IN_FIELDS built-in fields of the resource (workitem, foundation, etc.).
 */
Utils.getURL = function (urlBase, params, BUILT_IN_FIELDS) {
    const filters = Utils.parseFilters(params.filters);
    const fieldNames = params.fields ? Utils.extractFieldNames(params.fields) : Object.keys(BUILT_IN_FIELDS);
    const fields = params.fields ? Utils.convertFieldList2JSON(params.fields) : BUILT_IN_FIELDS;
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

/**
 * Parse a extension field. Data retrived from RTC server is polluted, so that is necessary to 
 * parse extensions to build a new extension object.
 * 
 * @param {Object} field field object to be parsed.
 */
Utils.parseExtension = function (field) {
    const literalTypes = ['booleanValue','integerValue','longValue','doubleValue','smallStringValue',
        'mediumStringValue','largeStringValue','timestampValue','decimalValue'];
    const numberTypes = ['integerValue','longValue','doubleValue','decimalValue'];

    const fieldType = field.type;

    const obj = {
        key: field.key,
        type: fieldType,
        helperId: field.helperId
    }
    
    if (literalTypes.indexOf(fieldType) !== -1) {
        if (numberTypes.indexOf(fieldType) !== -1){
            obj[fieldType] = Number(field[fieldType]);
        } else if (fieldType === 'timestampValue') {
            obj[fieldType] = moment(field[fieldType]).toDate();
        } else {
            obj[fieldType] = field[fieldType];
        }     
        obj['displayValue'] = field['displayValue'];
    } else {
        if (fieldType === 'itemValue') {
            obj['itemValue'] = field.itemValue ? field.itemValue.itemId : null;
        } else {
            for (const prop in field) {
                if (field.hasOwnProperty(prop)) {
                    obj[prop] = field[prop];
                }
            }
        }
    }

    return obj;
}

Utils.parseBuiltInField = function (fieldName, fieldValue, BUILT_IN_FIELDS) {
    /*let value = fieldValue;;
    if (BUILT_IN_FIELDS[fieldName]) {
        value = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
    } else {
        value = fieldValue;
    }*/

    const numberTypes = ['xs:integer','xs:long'];
    const dateTypes = ['xs:time','xs:date'];

    if (numberTypes.indexOf(BUILT_IN_FIELDS[fieldName].type) !== -1) {
        return Number(fieldValue);
    } else if (dateTypes.indexOf(BUILT_IN_FIELDS[fieldName].type) !== -1) {
        return moment(fieldValue).toDate();
    } else {
        return fieldValue;
    }
}

module.exports = Utils;