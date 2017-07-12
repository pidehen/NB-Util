;(() => {
  const class2type = {};
  [
    'Boolean', 'String', 'Number',
    'Function', 'Array', 'Object',
    'Date', 'RegExp', 'Error'
  ].forEach((type) => class2type[`[object ${ type }]`] = type.toLowerCase());
  const emptyArray = [];
  const emptyObject = {};
  const nativeToConcat = emptyArray.concat;
  const nativeToSlice = emptyArray.slice;
  const nativeToString = emptyObject.toString;

  let NBUtil = {
    getType(val) {
      return val == null
        ? String(val)
        : class2type[nativeToString.call(val)] || 'object';
    },

    isDocument(doc) {
      return this.getType(doc) === 'object' && doc.nodeType === doc.DOCUMENT_NODE;
    },

    isWindow(win) {
      return this.getType(win) === 'object' && win === win.window;
    },

    isPlainObject(obj) {
      return this.getType(obj) === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
    },

    isEmptyObject: (obj) =>
      !Object.keys(obj).length,

    likeArray(arr) {
      const type = this.getType(arr);

      return type === 'array' || (type !== 'function'
        && type !== 'string'
        && !this.isWindow(arr)
        && (type === 'object'
        && arr.length != null
        && ((arr.length - 1) in arr)));
    },

    toArray(arr) {
      if (this.likeArray(arr)) {
        return nativeToSlice.call(arr);
      } else {
        return [];
      }
    },

    flatten: (arr) =>
      nativeToConcat.apply([], arr),

    uniq: (arr) =>
      arr.filter((item, index, origin) =>
        origin.indexOf(item) === index),

    iterate: (process) => (obj, fn) => {
      const collection = Object.keys(obj);
      let i, len, ret, key;

      for (i = 0, ret = [], len = collection.length; i < len; i++) {
        key = collection[i];
        process(obj[key], key, obj, ret);
      }

      return NBUtil.flatten(ret);
    },

    copy(target, ...copys) {
      const last = copys[copys.length - 1];
      let isDeep, i, len;

      if (last == null) {
        return target;
      } else {
        isDeep = this.getType(last) === 'boolean' ? last : false;
      }

      for (i = 0, len = copys.length; i < len; i++) {
        let copy = copys[i];

        if (this.isPlainObject(copy)) {
          let key, value, isArray, isObject;

          for (key in copy) {
            value = copy[key];
            isObject = this.isPlainObject(value);
            isArray = this.getType(value) === 'array';

            if (!isDeep || (!isObject && !isArray)) {
              target[key] = value;
            } else {
              this.copy(target[key] = isObject ? {} : [], value, isDeep);
            }
          }
        }
      }

      return target;
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(() => util);
  } else {
    window.NBUtil = NBUtil;
  }
})();
