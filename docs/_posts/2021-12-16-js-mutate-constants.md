---
title: "JavaScript: Mutation of Constant Variables"
tags: javascript constant variables mutate
---

There are two important things to note about any variable declared with `const` in JavaScript:
1. it cannot be **re-assigned to**
2. it can be **mutated**, if it is an array or object

To elucidate these nuances, we will see how to change a constant variable's value from `[1,2,3]` to `[4,5,6]`.

## Example one

Let's try to assign a new value to a constant variable using the assignment operator `=`.

```javascript
const arr = [1,2,3];
arr = [4,5,6];
```
The above code will throw a TypeError and JavaScript will complain of "Assignment to constant variable." and the value of `arr` after running the code will still be
`[1,2,3]`

As described, variables declared with `const` in JavaScript cannot be **re-assigned** to.  But their values can be changed in a different way.  Mutation.

## Example two

Instead of attempting to re-assign the value of our constant variable itself, let's **mutate** the value of the variable.  This means we will change the value of the variable *in place*.

```javascript
const arr = [1,2,3];

//modify first element of arr
arr[0] = 4;
//now the second element
arr[1] = 5;
//and, lastly, the third element
arr[2] = 6;
```

The value of `arr` after running the code will still be
`[4,5,6]`.

This raises some questions...
>We knew all along that we wanted to change the value of the variable `arr` from `[1,2,3]` to `[4,5,6]`.
>
>Could we have changed `arr`'s value while avoiding the tedium of mutating it piece by piece?
>
>Can't we just declare `arr` again, this time with a new value?

The answer...
> No.

## Example three

Let's try to changed the value of `arr` without mutation.  Instead let's (try to) declare the variable again.

```javascript
const arr = [1,2,3];
const arr = [4,5,6];
```

JavaScript complains that "...'arr' has already been declared.".

---
So why are constant variables not able to be re-assigned to or re-declared?

Because they are meant to be *constant*.   Unchanging.  If you need to be able to re-assign or re-declare a variable, consider `let` or `var`.

But why, then, can the value of a constant variable be changed through mutation?

Arrays and objects are *mutable* types.  Changeable.  Programmers expect to be able to modify mutable values and this takes precedence over variable constancy.

## Further references

https://gomakethings.com/immutable-arrays-and-objects-in-vanilla-js/

