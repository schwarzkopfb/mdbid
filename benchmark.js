'use strict'

var COUNT = process.env.COUNT || 1500000

try {
    // todo: use this try/catch in my other packages
    var compare = {
        bson:         require('bson').ObjectId,
        mdbid:        require('./'),
        mongoid:      require('mongoid'),
        objectid:     require('objectid'),
        'mongoid-js': require('mongoid-js').mongoid
    }
}
catch (ex) {
    console.error('missing development dependency')
    console.error('did you forget to `npm i` in this folder?')
    process.exit(1)
}

function measure(name, fn, n, cb) {
    if (--n) {
        fn().toString()

        process.nextTick(function () {
            measure(name, fn, n, cb)
        })
    }
    else {
        console.timeEnd(name)
        cb()
    }
}

console.log('\ndisplaying the elapsed time it takes to perform', COUNT, 'calls per package')
console.log('(which means that lower values are better)\n')

var names = Object.keys(compare),
    i     = 0

void function next() {
    if (i < names.length) {
        var name = names[ i++ ],
            fn   = compare[ name ]

        console.time(name)
        measure(name, fn, COUNT, next)
    }
    else
        console.log()
}()
