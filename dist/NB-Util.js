'use strict';

;(function () {
  var class2type = {};
  ['Boolean', 'String', 'Number', 'Function', 'Array', 'Object', 'Date', 'RegExp', 'Error'].forEach(function (type) {
    return class2type['[object ' + type + ']'] = type.toLowerCase();
  });
  var emptyArray = [];
  var emptyObject = {};
  var nativeToConcat = emptyArray.concat;
  var nativeToSlice = emptyArray.slice;
  var nativeToString = emptyObject.toString;

  var NBUtil = {
    getType: function getType(val) {
      return val == null ? String(val) : class2type[nativeToString.call(val)] || 'object';
    },
    isDocument: function isDocument(doc) {
      return this.getType(doc) === 'object' && doc.nodeType === doc.DOCUMENT_NODE;
    },
    isWindow: function isWindow(win) {
      return this.getType(win) === 'object' && win === win.window;
    },
    isPlainObject: function isPlainObject(obj) {
      return this.getType(obj) === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
    },


    isEmptyObject: function isEmptyObject(obj) {
      return !Object.keys(obj).length;
    },

    likeArray: function likeArray(arr) {
      var type = this.getType(arr);

      return type === 'array' || type !== 'function' && type !== 'string' && !this.isWindow(arr) && type === 'object' && arr.length != null && arr.length - 1 in arr;
    },
    toArray: function toArray(arr) {
      if (this.likeArray(arr)) {
        return nativeToSlice.call(arr);
      } else {
        return [];
      }
    },


    flatten: function flatten(arr) {
      return nativeToConcat.apply([], arr);
    },

    uniq: function uniq(arr) {
      return arr.filter(function (item, index, origin) {
        return origin.indexOf(item) === index;
      });
    },

    iterate: function iterate(process) {
      return function (obj, fn) {
        var collection = Object.keys(obj);
        var i = void 0,
            len = void 0,
            ret = void 0,
            key = void 0;

        for (i = 0, ret = [], len = collection.length; i < len; i++) {
          key = collection[i];
          process(obj[key], key, obj, ret);
        }

        return NBUtil.flatten(ret);
      };
    },

    copy: function copy(target) {
      for (var _len = arguments.length, copys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        copys[_key - 1] = arguments[_key];
      }

      var last = copys[copys.length - 1];
      var isDeep = void 0,
          i = void 0,
          len = void 0;

      if (last == null) {
        return target;
      } else {
        isDeep = this.getType(last) === 'boolean' ? last : false;
      }

      for (i = 0, len = copys.length; i < len; i++) {
        var copy = copys[i];

        if (this.isPlainObject(copy)) {
          var key = void 0,
              value = void 0,
              isArray = void 0,
              isObject = void 0;

          for (key in copy) {
            value = copy[key];
            isObject = this.isPlainObject(value);
            isArray = this.getType(value) === 'array';

            if (!isDeep || !isObject && !isArray) {
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
    define(function () {
      return util;
    });
  } else {
    window.NBUtil = NBUtil;
  }
})();