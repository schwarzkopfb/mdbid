'use strict'

var test = require('tap'),
    gen  = require('./')

test.test('api', function (test) {
    test.end()
})

test.test('basic', function (test) {
    var id = gen()

    test.type(id, 'string', 'id should be a string')
    test.equals(id.length, 24, 'id should be 12 bytes length')
    test.match(id, /^[0-9a-f]{24}$/i, 'id should contain hexadecimal characters only')

    test.end()
})
