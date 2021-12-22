---
title: "JavaScript: Regular Expressions - Multiple Positive Lookaheads"
tags: regular expressions regex regexp javascript positive lookahead
---
Consider the following regular expression.
```js
let myRegExp = /(?=\w{5,10})(?=\D*\d)/;
```
It contains two positive lookaheads `(?=...)`.

The first, `(?=\w{5,10})`, refers to patterns of length between 5 and 10 characters (inclusive) containing only word characters.

The second, `(?=\D*\d)`, specifies patterns that have any number (zero or more) of non-digit characters, followed by a digit.

So it may seem like the string `"1abcd"` would not be matched since the string cannot be split into two parts such that the first part matches `(?=\w{5,10})` and the second part matches `(?=\D*\d)`.  But `myRegExp` does indeed match the string `"1abcd"`.  Why?

* The entire string `"1abcd"` itself matches the pattern represented by the lookahead `(?=\w{5,10})`.
* The substring `"1"` matches the pattern represented by the lookahead `(?=\D*\d)`.
* So both positive lookaheads are present and thus the entire regular expression *is* matched. 
	* It does not matter that the substring `"1"` appears as part of the entire string, or at the beginning of it.  
	* JavaScript does not "keep track" of where it is in the string after checking the first lookahead.  JavaScript checks the whole string to see if any pattern matches the first lookahead.  Then it checks the *whole string* **again** in search of a match with the second lookahead.

To illustrate:

```js
let myRegExp = /(?=\w{5,10})(?=\D*\d)/;

let myString = "abcde12345";
console.log(myRegExp.test(myString));
// logs true
// as expected

myString = "1abcd";
console.log(myRegExp.test(myString));
// logs true
// strings beginning with a digit can be matched by the regular expression
// strings of length 5 can be matched by the regular expression

myString = "a123456789";
console.log(myRegExp.test(myString));
// logs true
// strings of length 10 can be matched by the regular expression
```
