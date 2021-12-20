---
title: "JavaScript: Preventing Object Mutation"
tags: javascript variables mutate
---


Objects are a mutable type in JavaScript.  An object variable can be modified in place, even if it it was declared with `const`.

## Example
If we run
```js
const myObject = {
	key1: 'value1',
	key2: 'value2'
};

myObject.key1 = 'newValue';
```
then the value of the variable `myObject` will be
`{
	key1: 'newValue',
	key2: 'value2'
}`.

Sometimes, we want to prevent object mutation.  This can be accomplished with the object method `Object.freeze()`.

## Example
If we run
```js
const myObject = {
	key1: 'value1',
	key2: 'value2'
};

Object.freeze(myObject);

myObject.key1 = 'newValue';
```
then the value of `myObject` will *not* change when we attempt to mutate it.

## Further references

https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/es6/prevent-object-mutation
