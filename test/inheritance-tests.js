var o = require('../lib/atom').o(module);
var oo = require('../lib/atom').oo(module);
var assert = require('assert');

/*******************************************************************************
 * inheritance tests
 */
var Animal = oo({
  _C: function() {
    this.instanceCache = {}
    this.isHappy = true
    this.name = "Animal"
  },

  classCache: {},
  say: function() {
    return "I am a " + this.name + " - Am I happy? " + this.isHappy
  },
})

var Cat = oo({
  _type: Animal,
  _C: function() {
    this.name = "Cat"
  },

  say: function() {
    return "Super: " + this._super('say')()
  },

  meow: { 
    $property: {
      get: function() {
        return "Meow: " + this.name
      }
    }
  }
})

var SubAnimal = oo({
  _type: Animal
})

var a = o({
  _type: Animal
})

var c = o({
  _type: Cat
})

var c2 = o({
  _type: Cat,
  name: "fluffy"
})

assert(a.isHappy == true)
assert(a.name == "Animal")
assert(a instanceof Animal)

assert(c.isHappy == true)
assert(c.name == "Cat")
assert(c instanceof Animal)
assert(c instanceof Cat)

// _super and _type
c.say = function() { return "Yo" }
assert(c._type('say')() !== c.say())
assert(c._type('say')() !== c._super('say')())
assert(c._type('say')() === Cat.prototype.say.call(c))
assert(c._super('say')() === Animal.prototype.say.call(c))

var cc = o({
  _type: Cat,
  say: function() { return "YoYo" }
})

var ccc = o({
  _type: cc,
  say: function() { return "YoYoYo" }
})

assert(ccc.say() === "YoYoYo")
assert(ccc._type('say')() === "YoYo")


assert(c2.isHappy == true)
assert(c2.name == "fluffy")
assert(c2 instanceof Animal)
assert(c2 instanceof Cat)

c.instanceCache.a = 1
assert(c2.instanceCache.a == undefined)

assert(c2.meow == "Meow: fluffy")

// no constructor
var sa = o({
  _type: SubAnimal
})
assert(sa.isHappy)

// _super
assert(c2.say() === "Super: I am a fluffy - Am I happy? true")

var c3 = o({
  _type: Cat,
  name: "fluffy",
  say: function() {
    return this.constructor.prototype.say.bind(this)()
  },
})

assert(c2.say() === c3.say())

