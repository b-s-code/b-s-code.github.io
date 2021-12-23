---
﻿title: "JavaScript: Find Largest Array Element"
tags: javascript max largest array item element value
---
Suppose that we have an array `[1,5,23,7,3,78,4]` and we want to find the largest value contained in it.

It will suffice to run the following.
```js
let arr = [1,5,23,7,3,78,4];
let biggest = Math.max(...arr);
console.log(biggest);
```
We then see that the largest value is `78`.  Note the use of spread syntax `...`.

## Application
Suppose we have an array of strings and wish to find the length of the longest string contained.

We can apply the above technique along with an arrow function and `map()`.
```js
let ourStrings = ['Alice', 'Bob', 'Catherine'];
let theirLengths = ourStrings.map(x => x.length);
let longestLength =  Math.max(...theirLengths);
console.log(longestLength);
```
This logs `9`.
