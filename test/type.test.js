// 定义测试模块
var Q = QUnit;
var U = NBUtil;

Q.module('测试类型操作');

Q.test('获取类型', function (assert) {
  assert.strictEqual(U.getType(), 'undefined', 'undefined应为undefined类型');
  assert.strictEqual(U.getType(null), 'null', 'null应为null类型');
  assert.strictEqual(U.getType(1), 'number', '1应为Number类型');
  assert.strictEqual(U.getType(true), 'boolean', 'true应为Boolean类型');
  assert.strictEqual(U.getType(false), 'boolean', 'false应为Boolean类型');
  assert.strictEqual(U.getType('test'), 'string', '\'test\'应为String类型');
  assert.strictEqual(U.getType(function () {}), 'function', '应为Function类型');
  assert.strictEqual(U.getType([]), 'array', '[]应为Array类型');
  assert.strictEqual(U.getType({}), 'object', '{}应为Object类型');
  assert.strictEqual(U.getType(/\d/), 'regexp', '/\d/应为RegExp类型');
  assert.strictEqual(U.getType(new Date), 'date', 'new Date应为Date类型');
  assert.strictEqual(U.getType(new Error), 'error', 'new Error应为Error类型');
});

Q.test('检测是否window对象', function (assert) {
  assert.ok(U.isWindow(window), 'window应该等于window');
  assert.notOk(U.isWindow(document), 'document应该不等于window类型');
});

Q.test('检测是否是document对象', function (assert) {
  assert.ok(U.isDocument(document), 'document应该等于document');
  assert.notOk(U.isWindow(document), 'document应该不等于为window');
});

Q.test('检测是否是纯对象', function (assert) {
  assert.ok(U.isPlainObject({}), '{}应该是纯对象');
  function Person () {}
  var person = new Person;
  var el = document.querySelector('div');
  assert.notOk(U.isPlainObject(person), 'person不应该是纯对象')
  assert.notOk(U.isPlainObject([]), '[]不应该是纯对象');
  assert.notOk(U.isPlainObject(el), 'el不应该是纯对象');
});

Q.test('检测是否是空对象', function (assert) {
  var wjj = {};
  Object.defineProperty(wjj, 'name', {
    value: '挖掘机',
    enumerable: false
  });
  var daydayup = {};
  Object.defineProperty(daydayup, 'name', {
    value: '挖掘机',
    enumerable: true
  });

  assert.ok(U.isEmptyObject({}), '{}应该是空对象');
  assert.ok(U.isEmptyObject(wjj), 'wjj是空对象');
  assert.notOk(U.isEmptyObject({ name: 'm' }), '{ name: \'m\' }不应该是空对象');
  assert.notOk(U.isEmptyObject(daydayup), 'daydayup不应该是空对象')
});

Q.test('检测是否是数组或类数组对象', function (assert) {
  function testArgument () {
    assert.ok(U.likeArray(arguments), 'arguments是类数组');
  }
  var els = document.querySelectorAll('#qunit-header');
  var classList = els[0].classList;

  assert.ok(U.likeArray([]), '[]是数组');
  testArgument(10);
  console.log(classList);
  assert.ok(U.likeArray(els), 'NodeList是类数组');
  assert.ok(U.likeArray(classList), 'ClassList是类数组');
  assert.notOk(U.likeArray('aa'), '\'aa\'不应该是类数组');
  assert.notOk(U.likeArray(function g () {}), 'g不应该是类数组');
  assert.notOk(U.likeArray(window), 'window不应该是类数组');
});
