/**
 * @module mdbid
 * @exports generateId
 *
 * Inspired by node-mongoid-js from Andras Radics.
 */

'use strict'

exports = module.exports = generateId

var os     = require('os'),
    assert = require('assert'),
    crypto = require('crypto'),
    pad    = require('zerop')

var digits = [
    '0', '1', '2', '3',
    '4', '5', '6', '7',
    '8', '9', 'a', 'b',
    'c', 'd', 'e', 'f'
]

var unique, pid, mid,
    time, timestamp,
    seq, seqpref, ctr

setDefaults()

/**
 * Initialize values for calculations.
 */
function setDefaults() {
    // sequence: generate a random 3-byte integer initial value for the sequence counter
    if (seq === undefined)
        seq = ~~(Math.random() * 0xffffff)

    // processId: 2-byte integer derived from the PID assigned by the OS
    if (pid === undefined)
        pid = process.pid % 0xffff

    // machineId: first three bytes of the md5 hash calculated from OS hostname
    if (mid === undefined)
        mid = crypto.createHash('md5')
                    .update(os.hostname())
                    .digest()
                    .slice(0, 3)
                    .readUIntBE(0, 3)

    // reset the counter
    // (if `mid` or `pid` changes then previously allocated ids in the current second are freed)
    ctr = 0

    // `unique` is the fixed-length composition of `mid` and `pid`
    unique = pad(mid, 6, 16) + pad(pid, 4, 16)

    // calculate the initial sequence prefix
    seqpref = pad(~~(seq / 16), 5, 16)
}

/**
 * Calculate the current timestamp if needed,
 * otherwise return the last cached one.
 *
 * @return {string}
 */
function getTimestamp() {
    // use `Math.floor()` here to avoid the "Unix Millennium Bug"
    var now = Math.floor(Date.now() / 1000)

    // it's another second since the last id were created,
    // so we need to regenerate the timestamp
    if (time !== now) {
        ctr       = 0
        timestamp = pad(time = now, 8, 16)
    }
    // Since changing parts of an identifier are the timestamp and
    // the sequence; the count of maximum allocatable ids in a second
    // is limited by the sequence size (3-bytes = about 16 million).
    // Otherwise uniqueness is not guaranteed.
    else
        assert(++ctr < 0x1000000, 'more than 16 million ids generated in 1 second')

    return timestamp
}

/**
 * Increase or reset sequence counter and recalculate prefix when needed.
 *
 * @return {string}
 */
function getSequence() {
    var mod = ++seq % 16

    // reset counter
    if (seq > 0xffffff)
        seq = mod = 0

    // If counter is divisible by 16 then
    // the sequence prefix should be regenerated.
    // Otherwise only the last digit changed,
    // so we don't need to update the prefix.
    if (!mod)
        seqpref = pad(~~(seq / 16), 5, 16)

    return seqpref + digits[ mod ]
}

/**
 * Generate unique identifiers like MongoDB does.
 * @see {@link https://docs.mongodb.com/manual/reference/method/ObjectId}
 *
 * @return {string}
 */
function generateId() {
    return getTimestamp() + unique + getSequence()
}

/**
 * Assert a configurable value.
 *
 * @param {string} name
 * @param {number} val
 * @param {number} max
 */
function assertRange(name, val, max) {
    assert.equal(typeof val, 'number', name + ' must be a number')
    assert(!isNaN(val), 'number', name + ' must be a number')

    if (val > max)
        throw new RangeError(name + ' must be lower than ' + max + ', but is ' + val)
    else if (val < 0)
        throw new RangeError(name + ' must be greater than or equal to zero, but is ' + val)
    else if (val % 1)
        throw new RangeError(name + ' must be an integer')
}

Object.defineProperties(exports, {
    __proto__: null,

    /**
     * @prop {number} sequence - Initial value of the sequence counter.
     */
    sequence: {
        enumerable: true,

        get: function () {
            return seq
        },

        set: function (value) {
            if (seq === value)
                return
            else if (typeof value === 'string')
                value = parseInt(value, 16)

            assertRange('sequence', value, 0xffffff)
            seq = value
            setDefaults()
        }
    },

    /**
     * @prop {number} machineId - The machine identifier to use for id generation.
     */
    machineId: {
        enumerable: true,

        get: function () {
            return mid
        },

        set: function (value) {
            if (mid === value)
                return
            else if (typeof value === 'string')
                value = parseInt(value, 16)

            assertRange('machineId', value, 0xffffff)
            mid = value
            setDefaults()
        }
    },

    /**
     * @prop {number} processId - The process identifier to use for id generation.
     */
    processId: {
        enumerable: true,

        get: function () {
            return pid
        },

        set: function (value) {
            if (pid === value)
                return
            else if (typeof value === 'string')
                value = parseInt(value, 16)

            assertRange('processId', value, 0xffff)
            pid = value
            setDefaults()
        }
    },

    /**
     * @prop {string} version - The version string from package manifest.
     */
    version: {
        enumerable: true,

        get: function () {
            return require('./package.json').version
        }
    }
})
