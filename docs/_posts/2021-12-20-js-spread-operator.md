---
title: "JavaScript: the Spread Operator"
tags: javascript
---

The spread operator in JavaScript is used to spread the elements of an iterable.

## Example one 
### Passing elements of an iterable as arguments to a function

Suppose we have already declared a variable `arr` with the value `[1,2,3]`.  Then we can compute `myFunction(1,2,3)` by running

```js
myFunction(...arr);
```
Note that `myFunction(arr)` would actually be equivalent to `myFunction([1,2,3])`

## Example two

### Including all elements of one array in another array

If we run
```js
var  arr  = [1,2,3];
var  arr2  = [...arr, 4, 5, 6];

console.log(arr2);
```
then the console will display `[1,2,3,4,5,6]`, rather than `[[1,2,3],4,5,6]`.

## Example three

### Creating an array of a given string's individual characters

If we run
```js
var  myString  =  'hello';
var  myArr  = [...myString];

console.log(myArr);
```
then the console will display `['h','e','l','l','o']`.
