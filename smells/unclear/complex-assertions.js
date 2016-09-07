/* Сложные проверки
 *
 * Запах: в тесте несколько проверок.
 *
 * Причины:
 *   1. Тестируемый модуль возвращает составной результат. Автор теста
 *      хочет отметить, что только часть этого результата имеет значение.
 *      Например, тестируемый модуль добавляет свойства к огромному
 *      внешнему объекту.
 *
 *      В результате та часть проверки, что выбирает нужные данные,
 *      быстро обрастает логикой. Это запутывает читателя и
 *      вызывает вопросы: а точно ли мы те данные выбрали?
 *
 *      Лечение: 95%+ проверок это "значение равно <X>" или "значение входит
 *               в / включает в себя <X>". Сложные проверки с кучей логики
 *               обычно можно заменить глубоким сравнением (например,
 *               с помощью функций из underscore/lodash). Посмотрите пример в:
 *               support/decorate-assertions.js
 *
 *   2. Тестируемый модуль возвращает значение и имеет несколько важных
 *      сайд-эффектов. Придется написать кучу проверок, чтобы проверить
 *      возвращаемое значение и результаты сайд-эффектов. Проблема здесь
 *      в нарушении принципа разделения команд и запросов:
 *      https://en.wikipedia.org/wiki/Command–query_separation
 *
 *      Сложность проверок в тесте говорит нам о запахе в дизайне тестируемого
 *      модуля.
 *
 *      Лечение: если тест туманный и размытый, разделите его: один тест — один
 *               проверяемый функционал. Исправьте тестируемый модуль так,
 *               чтобы он не нарушал принцип принцип разделения команд
 *               и запросов.
 *
 * Замечания к примеру:
 *   Пример ниже немного пугает, если вы незнакомы с lodash. Суть в том, что
 *   в возвращаемом объекте мы увеличиваем возраст всех людей во вложенных
 *   объектах, представляющих фамильное дерево.
 *
 *   Проблема в том, что проверки вытаскивают нужные им данные вместо того,
 *   чтобы проверить дерево целиком или частично.
 *
 *   Попробуйте написать проверку так, чтобы читателю было ясно, что делает
 *   тестируемый модуль.
 */

// Тестируемый модуль
var _ = require('lodash')
function incrementAge (people) {
  return _(_.cloneDeep(people)).map(function (person) {
    if (_.isNumber(person.age)) {
      person.age += 1
    }
    if (_.isArray(person.kids)) {
      person.kids = incrementAge(person.kids)
    }
    return person
  }).shuffle().value()
}

// Тесты
module.exports = {
  incrementsSinglePersonAge: function () {
    var people = [
      {name: 'Jane', age: 39},
      {name: 'John', age: 99}
    ]
    var results = incrementAge(people)

    var jane = _.find(results, function (person) { return person.name === 'Jane' })
    assert.equal(jane.age, 40)
    var john = _.find(results, function (person) { return person.name === 'John' })
    assert.equal(john.age, 100)
  },
  incrementsKidsAgeToo: function () {
    var people = [
      {name: 'Joe', age: 42, kids: [
        {name: 'Jack', age: 8},
        {name: 'Jill', age: 7}
      ]}
    ]

    var results = incrementAge(people)

    var jack = _.find(results[0].kids, function (person) {
      return person.name === 'Jack'
    })
    assert.equal(jack.age, 9)
    var jill = _.find(results[0].kids, function (person) {
      return person.name === 'Jill'
    })
    assert.equal(jill.age, 8)
  }
}
