---
title: "Interruption At Work Created A Mishap"
description: ''
pubDate: '2009-08-30'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "c"
  - "entertainment"
  - "lua"
  - "personal"
  - "programming"
---

**INTERRUPTIONS AT WORK** is a frequent occurrence but generally its not a big problem. This time however the unavoidable loss of focus on what you was doing before, gave an unpleasant surprise.

I was adding some new functionality and had just written the following:

```
switch (state) {
    case Step3:
        configuration.length = 10;
        break;
}

```

Next I added a line to specify the configuration data on index zero. With the intention of doing this for the remaining nine data indexes, I copy-pasted the first line and incremented the index.

```
switch (state) {
    case ConfigureTask:
        configuration.data[0] = 
        configuration.data[1] = 
        configuration.length = 10;
        break;
}

```

But this was at the exact moment a colleague asked a question. To figure out the answer I had to browse around in the same file I was just editing. Not finding the complete answer there, the hunt led on to opening a bunch of other files. Eventually the situation evolved to a discussion using a white-board.

Now, even though the above code is incomplete, it compiles to perfectly valid code!. What the above code does is to initialize `configuration.data[0]`, `configuration.data[1]` and `configuration.length` to 10. Naturally this behavior was never the desired behavior for that code...

Later, returning to my workstation, I had completely forgotten about the unfinished implementation I worked on before. In my mind it was already done and I proceeded on other things that would eventually allow me to run some basic tests for the new implementations. The nature of the code is to delegate a state dependent number of black-box data to a task. The receiving task is found by peeking into the first byte of the black-box data (`configuration.data[0]`). Unfortunately '10' is a perfect match for the first task to be configured. So when unit-testing, at first everything seemed to be okay.

Later some strange behavior appeared, for which I could find no good reasons. Eventually I found the faulting situation in great dismay.

This kind of logic errors is the kind that can become extremely difficult to find, and I've learned my lesson: if leaving in the middle of writing some source code, be sure to quickly add some non-code that will not compile.
