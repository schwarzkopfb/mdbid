[![view on npm](http://img.shields.io/npm/v/mdbid.svg?style=flat-square)](https://www.npmjs.com/package/mdbid)
[![downloads per month](http://img.shields.io/npm/dm/mdbid.svg?style=flat-square)](https://www.npmjs.com/package/mdbid)
[![node version](https://img.shields.io/badge/node-%3E=0.12-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/mdbid.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/mdbid)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/mdbid.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/mdbid)
[![license](https://img.shields.io/npm/l/mdbid.svg?style=flat-square)](https://github.com/schwarzkopfb/mdbid/blob/development/LICENSE)

# mdbid

This package can be used to generate unique string identifiers in a _very_ performant way.
The algorithm is identical to the one that [MongoDB](https://www.mongodb.com/) uses to create its document identifiers.

## Usage

```js

const oid = require('mdbid')

oid() // '579b64ac12b43732a08531d8'

```

## API

`mdbid()` ⇒ `string` <br>
`mdbid.machineId`: 3-byte integer to use as machine identifier. <br>
`mdbid.processId`: 2-byte integer to use as process identifier. <br>
`mdbid.sequence`: Initial value of the sequence counter. It's a 3-byte integer. <br>
`mdbid.version`: The version string from package manifest.

## Installation

With npm:

    npm install mdbid

## Benchmark

The benchmark measures elapsed time it takes to perform 1500000 calls.
(Which means that lower values are better.)

Here are the results of similar packages:

```
bson: 1571ms
mdbid: 593ms
mongoid: 6153ms
objectid: 6154ms
mongoid-js: 396ms
```

## Motivation

In many of my projects [Redis](http://redis.io/) is used as the primary database,
which means that it's not just the caching layer of the system,
but actual documents (users, sessions, accounts, etc.) are stored in it.

Thus I need identifiers to include in Redis keys,
but Redis does not provide any built-in solution for id generation.

It is true that you can create incremental numeric ids easily with atomic counters,
but those ids are only identical _per schema_ and a user can predict new ids.
And that's unacceptable in a lot of real-life situations.

Mongo's id model seems like a good choice, because ids are guaranteed to be unique per server per process
up to a _really huge_ (2^(5*8)) cluster of servers (with proper configuration). So I decided to use it.

There are some already existing packages out there with the same purpose but some of them
* are inefficient when the expected output is string
* are not identical to Mongo's object id specification (last three bytes of an id must be a "counter, starting with a _random_ value")
* are not well-tested despite they're providing a unnecessarily complex API.

[`mongoid-js`](https://github.com/andrasq/node-mongoid-js) seemed like the best approach, but
* it's code is unmaintained and messy
* it not follows Node's coding-style standards
* the [use](https://github.com/andrasq/node-mongoid-js/blob/master/mongoid.js#L68) of timers makes it _not truly_ sync
and [counting calls](https://github.com/andrasq/node-mongoid-js/blob/master/mongoid.js#L64) can have unintended side effects

So I decided to re-implement it in a sustainable manner. That's the story of `mdbid`.

## License

[MIT](/LICENSE)