'use strict'

var os     = require('os'),
    assert = require('assert'),
    crypto = require('crypto'),
    test   = require('tap'),
    pad    = require('zerop'),
    gen    = require('./')

function requireUncached(module) {
    delete require.cache[ require.resolve(module) ]
    return require(module)
}

test.test('api', function (test) {
    // module.exports
    test.type(gen, 'function', 'main export should be a function')

    test.test('processId', function (test) {
        var pid = process.pid % 0xffff
        test.strictEqual(gen.processId, pid, 'mdbid.processId should be the PID mod 0xffff')
        test.throws(
            function () {
                gen.processId = 'test'
            },
            assert.AssertionError,
            'processId should be asserted'
        )
        test.throws(
            function () {
                gen.processId = -1
            },
            RangeError,
            'processId should be asserted'
        )
        test.throws(
            function () {
                gen.processId = 0x10000
            },
            RangeError,
            'processId should be asserted'
        )
        test.throws(
            function () {
                gen.processId = '10000'
            },
            RangeError,
            'processId should be asserted'
        )
        test.throws(
            function () {
                gen.processId = 1.1
            },
            RangeError,
            'processId should be asserted'
        )
        test.doesNotThrow(
            function () {
                gen.processId = gen.processId
            },
            'same value should not be re-validated'
        )
        test.doesNotThrow(
            function () {
                gen.processId = 42
                test.equal(gen.processId, 42, 'valid processId should be accepted')
                gen.processId = '2a'
                test.equal(gen.processId, 42, 'hex processId should be accepted and converted back to number')
            }
        )

        test.end()
    })

    test.test('machineId', function (test) {
        var mid = crypto.createHash('md5')
                        .update(os.hostname())
                        .digest()
                        .slice(0, 3)
                        .toString('hex')

        test.strictEqual(
            pad(gen.machineId, 6, 16), mid,
            'mdbid.machineId should be the first 3 bytes of the md5 hash calculated from OS hostname'
        )
        test.throws(
            function () {
                gen.machineId = 'test'
            },
            assert.AssertionError,
            'machineId should be asserted'
        )
        test.throws(
            function () {
                gen.machineId = -1
            },
            RangeError,
            'machineId should be asserted'
        )
        test.throws(
            function () {
                gen.machineId = 0x1000000
            },
            RangeError,
            'machineId should be asserted'
        )
        test.throws(
            function () {
                gen.machineId = '1000000'
            },
            RangeError,
            'machineId should be asserted'
        )
        test.throws(
            function () {
                gen.machineId = 1.1
            },
            RangeError,
            'machineId should be asserted'
        )
        test.doesNotThrow(
            function () {
                gen.machineId = gen.machineId
            },
            'same value should not be re-validated'
        )
        test.doesNotThrow(
            function () {
                gen.machineId = 42
                test.equal(gen.machineId, 42, 'valid machineId should be accepted')
                gen.machineId = '2a'
                test.equal(gen.machineId, 42, 'hex machineId should be accepted and converted back to number')
            }
        )

        test.end()
    })

    test.test('sequence', function (test) {
        test.throws(
            function () {
                gen.sequence = 'test'
            },
            assert.AssertionError,
            'sequence should be asserted'
        )
        test.throws(
            function () {
                gen.sequence = -1
            },
            RangeError,
            'sequence should be asserted'
        )
        test.throws(
            function () {
                gen.sequence = 0x1000000
            },
            RangeError,
            'sequence should be asserted'
        )
        test.throws(
            function () {
                gen.sequence = '1000000'
            },
            RangeError,
            'sequence should be asserted'
        )
        test.throws(
            function () {
                gen.sequence = 1.1
            },
            RangeError,
            'sequence should be asserted'
        )
        test.doesNotThrow(
            function () {
                gen.sequence = gen.sequence
            },
            'same value should not be re-validated'
        )
        test.doesNotThrow(
            function () {
                gen.sequence = 42
                test.equal(gen.sequence, 42, 'valid sequence should be accepted')
                gen.sequence = '2a'
                test.equal(gen.sequence, 42, 'hex sequence should be accepted and converted back to number')
            }
        )

        /* default value */

        var nums = {}

        function testSequence() {
            var seq = requireUncached('./').sequence
            test.ok(seq >= 0, 'mdbid.sequence should be greater than or equal to zero')
            test.ok(seq <= 0xffffff, 'mdbid.sequence should be a 3-byte integer')
            nums[ seq ] = true
        }

        for (var i = 10; i--;)
            testSequence()

        /* Test randomity:
         * we expect that at least nine of the generated
         * ten random numbers are different
         *
         * note:
         * it is possible that this test fails
         * despite everything works as intended,
         * but that's unlikely and _very_ rare
         */
        test.ok(
            Object.keys(nums).length >= 9,
            'mdbid.sequence should default to a 3-byte random integer'
        )
        test.end()
    })

    test.test('version', function (test) {
        test.strictEqual(
            gen.version, require('./package.json').version,
            'version should be exposed correctly'
        )
        test.throws(
            function () {
                gen.version = 'test'
            },
            TypeError,
            'version should be read-only'
        )
        test.end()
    })

    test.end()
})

test.test('basic', function (test) {
    var now = Date.now()

    function doTest() {
        var time = Math.floor(Date.now() / 1000),
            id   = gen()

        test.type(id, 'string', 'id should be a string')
        test.equal(id.length, 24, 'id should be 12 bytes length')
        test.match(id, /^[0-9a-f]{24}$/i, 'id should contain hexadecimal characters only')

        var ts  = id.substring(0, 8),
            mid = id.substring(8, 14),
            pid = id.substring(14, 18),
            seq = id.substring(18)

        test.equal(ts, time.toString(16), 'timestamp should be correct')
        test.equal(mid, pad(gen.machineId, 6, 16), 'machineId should be correct')
        test.equal(pid, pad(gen.processId, 4, 16), 'processId should be correct')
        test.equal(seq, pad(gen.sequence, 6, 16), 'sequence should be correct')

        test.end()
    }

    // ensure that timestamp encoded in the returned id
    // matches the one we store for validation
    if (now % 1000 > 925)
        setTimeout(doTest, 25)
    else
        doTest()
})

test.test('sequence', function (test) {
    // test the sequence prefix change (divisibility by 16)
    gen.sequence = 0
    var seqpref  = gen().substring(18, 23)

    for (var i = 14; i--;)
        gen().substring(18, 23)

    test.notEqual(seqpref, gen().substring(18, 23), 'sequence prefix should be regenerated')

    // test sequence overflow
    gen.sequence = 0xffffff
    test.equal(gen().substring(18), '000000', 'counter should be reset')

    test.end()
})
