import moment from 'moment';
import _ from 'lodash';
import Currency from 'js-money/lib/currency';
import accounting from 'accounting';


export function removeEmptyFromObject(obj) {
  obj = Object.assign({}, obj);
  var keys = Object.keys(obj);

  keys.forEach(function(key) {
    const value = obj[key];

    if (value === '' || value === null || value === undefined ) {
      delete obj[key];
    }
  });
  return obj;
};

export const optionsMapToArray = (optionsMap, service = '') => {
  return Object.keys(optionsMap).map((optionKey) => {
    const optionValue = optionsMap[optionKey];

    return {
      key: service ? `${service}_${optionKey}` : `${optionKey}`,
      value: optionValue,
    };
  })
};

export const optionsArrayToMap = (optionsArray) => {
  return optionsArray.reduce((map, option) => {
    map[option.key] = option.value;
    return map;
  }, {});
};

export function numberComma(number){
  number = typeof number === 'number' ? String(number) : number;

  const parts = number.split('.');

  const integer = parts[0] || '0';
  const decimal = parts[1];
  const postfix = decimal ? `.${decimal}` : '';

  return `${integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}${postfix}`;
}

export const momentFormatter = (format) => {
  return {
    formatDate: date => moment(date).format(format),
    parseDate: str => moment(str, format).toDate(),
    placeholder: `${format} (moment)`,
  };
}

/** Event handler that exposes the target element's value as a boolean. */
export const handleBooleanChange = (handler) => {
  return (event) => handler(event.target.checked);
};

/** Event handler that exposes the target element's value as a string. */
export const handleStringChange = (handler) => {
  return (event) => handler(event.target.value);
};

/** Event handler that exposes the target element's value as a number. */
export const handleNumberChange = (handler) => {
  return handleStringChange(value => handler(+value));
};

export const objectKeysTransform = (obj, transform) => {
  return Object.keys(obj).reduce((acc, key) => {
    const computedKey = transform(key);
    acc[computedKey] = obj[key];
    return acc;
  }, {});
};

export const compose = (...funcs) =>
  funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export const getObjectDiff = (a, b) => {
  return _.reduce(a, (result, value, key) => {
      return _.isEqual(value, b[key]) ?
          result : result.concat(key);
  }, []);
}

export const parseDateRangeQuery = (keyword) => {
  const queries = {
    'today': {
      range: 'day',
    },
    'this_year': {
      range: 'year',
    },
    'this_month': {
      range: 'month'
    },
    'this_week': {
      range: 'week'
    }
  };

  if (typeof queries[keyword] === 'undefined') {
    throw new Error(`The date range query ${keyword} is not defined.`);
  }
  const query = queries[keyword];

  return {
    from_date: moment().startOf(query.range).toDate(),
    to_date: moment().endOf(query.range).toDate(),
  };
};


export const defaultExpanderReducer = (tableRows, level) => {
  let currentLevel = 1;
  const expended = [];

  const walker = (rows, parentIndex = null) => {
    return rows.forEach((row, index) => {
      const _index = parentIndex ? `${parentIndex}.${index}` : `${index}`;
      expended[_index] = true;
  
      if (row.children && currentLevel < level) {
        walker(row.children, _index);
      }
      currentLevel++;
    }, {});
  };
  walker(tableRows);
  return expended;
}


export function formattedAmount(cents, currency) {
  const { symbol, decimal_digits: precision } = Currency[currency];
  const amount = cents / Math.pow(10, precision);

  return accounting.formatMoney(amount, { symbol, precision });
}