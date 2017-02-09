describe("plasma trash feature", function(){
  var Plasma = require("../index")
  var instance  = new Plasma()

  it("stores and trash", function(){
    var chemical = {type: "c1"}
    instance.store(chemical)
    expect(instance.has(chemical)).toBe(true)
    instance.trash(chemical)
    expect(instance.has(chemical)).toBe(false)
  })

  it("stores and trash all", function(){
    var chemical = {type: "c1", property: 1}
    var chemical2 = {type: "c2", property: 1}
    instance.store(chemical)
    instance.store(chemical2)
    expect(instance.has({property: 1})).toBe(true)
    instance.trashAll({property: 1})
    expect(instance.has({property: 1})).toBe(false)
    expect(instance.storedChemicals.length).toBe(0)
  })

  it("stores many and get", function(){
    var chemical = {type: "c1", property: 1}
    var chemical2 = {type: "c1", property: 2}
    instance.store(chemical)
    instance.store(chemical2)
    expect(instance.storedChemicals.length).toBe(2)
    expect(instance.has({type: "c1"})).toBe(true)
    expect(instance.get({type: "c1"}).property).toBe(1)
    expect(instance.getAll({type: "c1"}).length).toBe(2)
    instance.trashAll({type: "c1"})
  })

  it("storeAndOverrides", function(){
    var chemical = {type: "c1", property: 1}
    var chemical2 = {type: "c1", property: 2}
    instance.storeAndOverride(chemical)
    instance.storeAndOverride(chemical2)
    expect(instance.has({property: 1})).toBe(false)
    expect(instance.has({property: 2})).toBe(true)
    expect(instance.storedChemicals.length).toBe(1)
    instance.trashAll({type: "c1"})
  })

  it("stores without emit warning chemical for missing handlers", function(){
    var missingHandlerWarning = false
    instance.on("plasma/missingHandler", function (c) {
      missingHandlerWarning = true
      throw new Error("'plasma/missingHandler' should not be emitted")
    })

    var chemical = {type: "c1"}
    instance.store(chemical)
    expect(instance.has(chemical)).toBe(true)
    expect(missingHandlerWarning).toBe(false)
  })

  it("storeAndOverrides without emit warning chemical for missing handlers", function(){
    var missingHandlerWarning = false
    instance.on("plasma/missingHandler", function (c) {
      missingHandlerWarning = true
      throw new Error("'plasma/missingHandler' should not be emitted")
    })

    var chemical = {type: "c1"}
    instance.storeAndOverride(chemical)
    expect(instance.has(chemical)).toBe(true)
    expect(missingHandlerWarning).toBe(false)
  })
})
