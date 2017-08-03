---
layout: post
date: 2017-05-02 23:00
title:  "The way npm handles common misspellings"
category: blog
tags: npm
---
I was reading through the [`npm`](https://github.com/npm/npm) source code and noticed [this section](https://github.com/npm/npm/blob/d46015256941ddfff1463338e3e2f8f77624a1ff/lib/npm.js#L68) that was too funny to not share:

```js
var commandCache = {}
var aliasNames = Object.keys(aliases)

var littleGuys = [ 'isntall', 'verison' ]
var fullList = cmdList.concat(aliasNames).filter(function (c) {
  return plumbing.indexOf(c) === -1
})
var abbrevs = abbrev(fullList)

// we have our reasons
fullList = npm.fullList = fullList.filter(function (c) {
  return littleGuys.indexOf(c) === -1
})
```
This allows you to validly run commands like `npm isntall` and `npm verison`.


It would be a fun project to grab the most common misspellings of other core commands from Google searches, and implement them in the same way.