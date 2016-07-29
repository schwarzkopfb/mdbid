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
objectid: 6153ms
mongoid-js: 396ms
```

## License

[MIT](/LICENSE)