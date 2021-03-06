# Plasma v2.0.0

Implementation of [node-organic/Plasma v1.0.0](https://github.com/VarnaLab/node-organic/blob/master/docs/Plasma.md).

## Public API

### plasma.emit(c [, data, callback]) : Boolean

Immediatelly triggers any reactions matching given `c` chemical.

___arguments___
* `c` - Emitted chemical
  * as `String` equals to `{ type: String, ... }` Chemical
  * as `Object` equals to Chemical

___returns___

* `true` - *only* when chemical has been aggregated

### plasma.store(c) : Boolean

Does the same as `plasma.emit` but also triggers any
reactions registered in the future using `plasma.on`

___returns___

* `true` - *only* when chemical has been aggregated

### plasma.storeAndOverride(c) : Boolean

Does the same as `plasma.emit` but also triggers any
reactions registered in the future using `plasma.on`.

It overrides previously stored chemicals having the same chemical using `c.type`

___returns___

* `true` - *only* when chemical has been aggregated

### plasma.has(pattern) : boolean
___returns___

Checks synchronously for stored chemicals by given pattern.

### plasma.get(pattern) : Chemical

Returns synchronously first found stored chemical by given pattern.

### plasma.getAll(pattern) : Array [ Chemical ]

Returns synchronously all stored chemicals by given pattern.

### plasma.on(pattern, function (c [, callback]){} [, context])

Registers a function to be triggered when chemical emitted in plasma matches given pattern.

___arguments___
* `pattern` - matches emitted chemicals
  * as `String` matching `Chemical.type` property
  * as `Object` matching one or many properties of `Chemical`
* `c` - `Object` Chemical matching `pattern`
* `callback` - *optional* callback function used for feedback
* `context` - *optional* context to be used for calling the function

### plasma.once(pattern, function (c [, callback]){} [, context])

The same as `plasma.on(pattern, function reaction (c){})` but will trigger the function only once.

### plasma.on([p1, p2, ...], function (c1, c2, ...){} [, context])

Registers a function to be triggered when all chemicals emitted in plasma have been matched.

___arguments___
* `p` - array
  * having elements `String` matching `Chemical.type` property
  * having elements `Object` matching one or many properties of `Chemical`
* `c` - array
  * `Object` Chemicals matching `p` array maintaining their index order
* `context` - *optional* context to be used for calling the function

### plasma.once([p1, p2, ...], function (c1, c2, ...) {} [, context])

The same as `plasma.on([p1, p2], function(c1, c2){})` but will trigger the function only once.

### plasma.off(pattern, function, context)

Unregisters chemical reaction functions, the opposite of `plasma.on` or `plasma.once`.

___arguments___

* `pattern`
  * as `String` or `Array` or `Object` - needs function handler for unregister to succeed
  * as `Function` - finds **all** registered chemical reactions with that function handler and unregisters them.
* `function` *optional* required only when `pattern` is String, Array or Object. This should be the exact function used for `plasma.on` or `plasma.once`
* `context` *optional* used to scope removing of chemical reactions within context

### plasma.trash(c)

Removes previously stored chemical via `plasma.store`. It does removal by reference and won't throw exception if given chemical is not found in plasma's store.

### plasma.trashAll(pattern)

Removes previously stored chemicals via `plasma.store`. It does removal by chemical pattern

### plasma.pipe(function(c){})

Method which will invoke function per any chemical been emitted or stored in plasma.

### plasma.unpipe(function(c){})

Stops invoking given function previously used for `plasma.pipe`

## Features

Current implementation of organic plasma interface has the following addon features designed for ease in daily development process.

### chemical aggregation

```
plasma.on('c1', function reaction1 () {
  return true
})
plasma.on('c1', function reaction2 () {
  // won't be reached, reaction1 aggregated the chemical
})
console.log(plasma.emit('c1')) // === true
```

### optional usage of arguments

Invoking **either**:

* `plasma.emit('ready')`
* `plasma.emit({type: 'ready'})`

triggers **all** the following:

* `plasma.on('ready', function(c){ c.type === 'ready' })`
* `plasma.on({type: 'ready'}, function(c){ c.type === 'ready' })`

### feedback support

```
plasma.on('c1', function reaction1 (c, callback) {
  callback(c)
})
plasma.emit('c1', function callback (c) {
  // c.type === 'c1'
})
```

### custom pattern <-> chemical match algorithms

* override `plasma.utils.deepEqual(pattern, chemical)`

### match chemicals using class definitions as pattern

```
var Class1 = function () {}
plasma.on(Class1, function (instance) {

})
var instance = new Class1()
plasma.emit(instance)
```

### notification of missing listeners/handlers for a chemical

When emitting a chemical (via the `.emit` method) which has no registered handlers (via the `.on`/`.once` methods) a warning chemical will be emitted (by default its type is `plasma/missingHandler`)


* The missing handlers warning chemical will not be emitted when storing chemicals.
* The type of the missing handlers warning chemical can be customized when instantiating the plasma
* by default this feature is disabled unless `missingHandlersChemical` value is provided

```
var instance  = new Plasma({
  missingHandlersChemical: 'plasma/missingHandler'
})

instance.on("plasma/missingHandler", function(c){
  ...
  expect(c).toBe({
    type: 'plasma/missingHandler',
    chemical: {
      type: chemicalWithNoHandler,
      someData: true
    }
  })
  ...
})

instance.emit({
  type: "chemicalWithNoHandler",
  someData: true
})
```
