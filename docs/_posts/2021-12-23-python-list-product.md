---
title: "Python: Product of List Items"
tags: higher order functions product multiply list items iterable
---
Say you have a list `[1,2,3]`.  If you want to find the sum of all elements of the list, you use `sum([1,2,3])`.  Easy.  Simple.  But say you want to find the product of all elements in the list.

It would be nice to have a function `product()` that could be applied to an iterable in the same way as `sum()`.  Alas, we do not.

Instead, we can use a lambda function that multiplies two arguments together, in combination with the `reduce()` function from the `functools` module.
```python
from functools import reduce

result = reduce(lambda x, y: x * y, [1,2,3])
# this is as close as we can get to something like
# result = product([1,2,3]) without defining a
# new function ourselves

print(result)
# prints 6 because ((1*2)*3) is 6
```

## Further references
https://docs.python.org/3/library/functools.html#functools.reduce
