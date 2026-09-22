---
title: "Why Lambda?"
description: ''
pubDate: '2008-03-19'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "lua"
  - "programming"
  - "python"
---

**I HAVE BEEN** reading up on Python programming lately (more on that in a [later post](http://monzool.net/blog/2008/03/21/core-python-programming/)). I've now been introduced to anonymous functions. In Python, anonymous functions are available using the `lambda` keyword. Anonymous functions are great, but I think the Lua syntax for anonymous functions is superior to the syntax adopted in Python.

A normal function, in Python, is defined using the `def` keyword along with a function name.

```pycon
>>> def f1(x, y):
...     return x + y
... 
>>> f1(1, 2)
3

```

In Python anonymous functions are created by a lambda expression.

```pycon
>>> f2 = lambda x, y: x + y
>>> f2(1, 2)
3

```

Similar to anonymous function, normal Python functions are first class objects and can be assigned to other variables.

```pycon
>>> f = f1
>>> f(1, 2)
3

```

However direct assignment of a function deceleration is not possible.

```pycon
>>> f = def f3(x, y):
  File "", line 1
    f = def f3(x, y):
           ^
SyntaxError: invalid syntax

```

This last example resembles the concept of the anonymous function syntax chosen in Lua. First a look on how a normal function is defined in Lua. Its not that different from the Python version.

```lua
> function f1(x, y)
>>   return x + y
>> end
> print( f1(1, 2) )
3

```

Like in Python, functions are first class objects in Lua and thus also supports aliasing functions.

```lua
> f = f1
> print( f(1, 2) )
3

```

The syntax for anonymous function in Lua differs not much for how normal functions are defined. The function name is omitted (hence anonymous) and secondly the function definition is wrapped in parentheses.

```lua
> f2 = (function(x, y)
>>   return x + y 
>> end)
> print( f2(1, 2) )
3
> -- Or as one-liner if preferred
> f2 = (function(x, y) return x + y end)
> print( f2(1, 2) )
3

```

In Lua a function is a function and defined as such - being anonymous or not. I think this approach is more elegant that using a dedicated `lambda` keyword.
