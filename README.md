[![view on npm](http://img.shields.io/npm/v/mdbid.svg?style=flat-square)](https://www.npmjs.com/package/mdbid)
[![downloads per month](http://img.shields.io/npm/dm/mdbid.svg?style=flat-square)](https://www.npmjs.com/package/mdbid)
[![node version](https://img.shields.io/badge/node-%3E=0.12-brightgreen.svg?style=flat-square)](https://nodejs.org/download)
[![build status](https://img.shields.io/travis/schwarzkopfb/mdbid.svg?style=flat-square)](https://travis-ci.org/schwarzkopfb/mdbid)
[![test coverage](https://img.shields.io/coveralls/schwarzkopfb/mdbid.svg?style=flat-square)](https://coveralls.io/github/schwarzkopfb/mdbid)
[![license](https://img.shields.io/npm/l/mdbid.svg?style=flat-square)](https://github.com/schwarzkopfb/mdbid/blob/development/LICENSE)

# mdbid

This package can be used to generate unique string identifiers in a _very_ performant way.
The algorithm is identical with the one that [MongoDB](https://www.mongodb.com/) uses to create its document identifiers.

## Usage

```js

const oid = require('mdbid')

oid() // '579b64ac12b43732a08531d8'

```

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

MongoDB's id model seems like a good choice, because ids are guaranteed to be unique per server per process
up to a _really huge_ (2^(5*8)) cluster of servers (with proper configuration).

## License

[MIT](/LICENSE)