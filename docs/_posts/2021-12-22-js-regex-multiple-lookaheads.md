---
﻿title: "JavaScript: Multiple Positive Lookaheads in Regular Expressions"
tags: regular expressions regex regexp javascript positive lookahead
---
Consider the following situation.  We want to, in JavaScript, match just strings that:
* have between 5 and 10 characters (inclusive)
* contain only word characters
*  contain at least one digit, anywhere

We will see that this can be accomplished with a regular expression.

```js
let  myRegExp  =  /(?!.{11,})(?=\w{5,10})(?=\D*\d)/;
```

Here we have one negative lookahead `(?!...)`, two positive lookaheads `(?=...)`, and nothing else.  Let's unpack each of the three lookaheads.

$$/~\underbrace{(?!.\{11,\})}_{\substack{\text{total \# chars} \\ \text{from start} \\ \text{onwards } <~11 }}~~~\underbrace{(?=\backslash w\{5,10\})}_{\substack{\text{first n chars are} \\ \text{all word chars for} \\ \text{some n between} \\ \text{5-10 inclusive}}}~~~\underbrace{(?=\backslash D*\backslash d)}_{\substack{\text{a digit appears} \\ \text{somewhere}}}~/$$

Does this regular expression behave as intended?  Let's see.

```js
let myRegExp = /(?!.{11,})(?=\w{5,10})(?=\D*\d)/;

// digit can appear anywhere
let myString = "9aaaada";
console.log(myRegExp.test(myString));
// logs true


// digit must appear somewhere
myString = "aaaaada";
console.log(myRegExp.test(myString));
//logs false

// boundaries on length are inclusive
myString = "aaaa1";
console.log(myRegExp.test(myString));
myString = "abcde12345";
console.log(myRegExp.test(myString));
// both log true
```

Note that:
* One possible misconception: to match the regular expression, it is necessary for the string to be able to be partitioned into three sequential parts which each match the three lookaheads, respectively.  This is not the case.
* For a string to match the regular expression, it is necessary and sufficient:
	* for *some pattern*, beginning at the very first character of the string to satisfy the **first** lookahead,
	* and for *some pattern*, beginning at the very first character of the string to satisfy the **second** lookahead,
	*  and for *some pattern*, beginning at the very first character of the string to satisfy the **third** lookahead.

* The above point is contingent on the fact that there'ss nothing in the regular expression outside of and to the left of any lookahead.
	* JavaScript checks the string from the start for each of the three lookaheads in the absence of additional characters outside and to the left of the lookaheads.
	* In the presence of such additional characters, the lookaheads can be made to behave differently.
	* Such behaviour is described in more general terms by <a href="https://javascript.info/regexp-lookahead-lookbehind">this article from javascript.info</a>
* The `\D` is included in `(?=\D*\d)`: to allow for the possibility of the first digit not occuring as the very first character.
