---
title: "JavaScript: Variable Scope"
tags: javascript scope variables
---

## Comparison of the keywords `var` and `let`

<div align="center"><img height="400px"  alt="View through a sniper rifle scope" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Edit_4x_rifle_scope.jpg/671px-Edit_4x_rifle_scope.jpg"></div>
<br>

When a variable is declared with `let`, the value assigned to the variable is assigned only in the scope of the block where the declaration appears (i.e. locally). 

### Example
If we run
```
let  myVariable  =  5;
console.log(myVariable);

if (true) {
let  myVariable  =  10;
console.log(myVariable);
}

console.log(myVariable);
```
then the console will show
```
5
10
5
```
By contrast, replacing `let`with `var` in the above example would display
```
5
10
10
```
in the console.

---
When a variable is declared with `var` its scope is either
* global, or
* local (if and only if the variable is declared inside a function)

### Example

If we run
```lang-js
var myVariable = 5;
console.log(myVariable);

function myFunction() {
	var myVariable = 10;
	console.log(myVariable);
}

myFunction();
console.log(myVariable);
```
then the console will show
```
5
10
5
```
---
### Further references
MDN Web Docs
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let

w3schools
https://www.w3schools.com/js/js_scope.asp

freeCodeCamp
https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/es6/compare-scopes-of-the-var-and-let-keywords
