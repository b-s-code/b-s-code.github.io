---
title: "JavaScript: Import/Export with Default Values"
tags: default import export javascript
---
## Default exports
When a variable or function is exported with the `export` statement, either:
* the variable/function is exported as a *named* export, or
* the variable/function is exported as a *default* export.

For example, suppose that we are working in a file named `somefunctions.js` want to export the following function.
```js
function timesThree(x) {
	return x * 3;
}
```
If we want `timesThree` to be the `default` export (and thus the value that is imported by default *from* this file) then we can accomplish our goal with only a slight modification of the function definition.
```js
export default function timesThree(x) {
	return x * 3;
}
```
## Importing default exports

Now let's suppose we are working in a different file in the directory containing `somefunctions.js`.

We can import the default export from `somefunctions.js` with any name that we like.  Let's say that we want to import the default export as `makeBigger` rather than `timesThree`.  We use
```js
import makeBigger from "./somefunctions.js";
```

Then we can use the function `makeBigger` to multiply an argument by 3.

Note that:
1. In contrast to importing named exports, we do not need to place `makeBigger` in curly brackets.
2. If we didn't care about `timesThree` being the default export, but wanted to import it elsewhere as `makeBigger`, we could have accomplished this using a named export and the following import syntax
```js
import { timesThree as makeBigger } from "./somefunctions.js";
```
