---
title: "Help On Python Regular Expressions"
description: ''
pubDate: '2007-10-15'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "python"
  - "regular-expressions"
---

**REGULAR EXPRESSIONS ARE** a powerful friend, but the friendship doesn't come easy. [Regular expressions](http://www.regular-expressions.info/ "Regular Expression information") can be somewhat baffling getting a grasp on, but when finally understood, the possibilities are almost endless.

When developing the searching expression used in [HTML Parsing With Beautiful Soup](http://monzool.net/blog/2007/10/15/html-parsing-with-beautiful-soup/) I realized that my regular expression knowledge had gotten a bit rusty. Fortunately I had double-up on the luck. 1) It was a Python program, hence the Python shell was available. 2) I found [David Mertz](http://en.wikipedia.org/wiki/David_Mertz)'s book [Text Processing in Python](http://gnosis.cx/TPiP/).

The Python shell makes it easy to experiment and tweak any regular expressions on the fly, but the downside is that its not easy to visually evaluate the outcome of your current expression. David's book helped two folds. It has extensive theory on Python regular expression syntax, but most superhero-like is the small function provided, that makes it possible to see the outcome of an evaluated expression.

```python
# Credits: David Mertz
def re_show(pat, s):
    print re.compile( pat, re.M ).sub( "{\g<0>}", s.rstrip() ), '\n'

```

Using regular expressions in Python requires importing of the regular expression libirary.

```python
import re

```

If using the Python shell just enter the same in the shell prompt. The function by David Mertz can also be typed directly into the shell

```pycon
>>> import re
>>> def re_show(pat, s):
...    print re.compile( pat, re.M ).sub( "{\g<0>}", s.rstrip() ), '\n'
>>>

```

The `re_show` wrapper displays the source and emphasizes the result of the expression, as being the contents between the '{' and '}' pair.

Next is creation of some example text on which to experiment.

```pycon
>>> s = 'if (Hulk.color != "green"): print "Grey Hulk"'

```

Now the experiments can begin. The following searches for everything between the first '(' to the last ')'.

```pycon
>>> re_show(r'\(.*\)', s)

```

Result:

`if` **`{`** `(Hulk.color != "green")` **`}`** `: print "Grey Hulk"`

Another example could be an case-insensitive match on the colors of Hulk.

```pycon
>>> re_show(r'(?i)green|(?i)grey', s)

```

Result:

`if (Hulk.color != "` **`{`** `green` **`}`** `"): print "` **`{`** `Grey` **`}`** `Hulk"`

This is just at minuscule introduction to the powers of regular expressions. If your into regular expressions in Python, I highly recommend to buying the book - or donate and read it online.
