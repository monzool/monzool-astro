---
title: "Unsuccessful ClojureScript Quick-Start"
description: ''
pubDate: '2017-09-14'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "web"
---

**CLOJURESCRIPT HAS BEEN** something I've been following on the sidelines for quite a while now. Poking a bit around with React at work, let my interest towards Om.Next. Contemplating on creating my own web-app, I wanted to give this lispy thing a go. The Om.Next documentation led me to the [ClojureScript quick-start](https://clojurescript.org/guides/quick-start) guide.

Tutorial: Create structure and file

```
  mkdir -p src/hello_world;touch src/hello_world/core.cljs

```

Me copy-pasta

```
  mkdir -p src/hello_world;touch src/hello_world/core.cljs

```

* * *

Tutorial: edit the src/hello\_world/core.cljs to look like the following:

```
(ns hello-world.core)
(enable-console-print!)
(println "Hello world!")

```
Me copy-pasta

```
ns hello-world.core)
(enable-console-print!)
(println "Hello world!")

```

* * *

Tutorial: Add the following Clojure code to build.clj

```
(require 'cljs.build.api)
(cljs.build.api/build "src" {:output-to "out/main.js"})

```

Me copy-pasta

```
(require 'cljs.build.api)
(cljs.build.api/build "src" {:output-to "out/main.js"})

```

* * *

Tutorial: build it

```
java -cp cljs.jar:src clojure.main build.clj

```

Me copy-pasta

```
java -cp cljs.jar:src clojure.main build.clj

```

* * *

Tutorial: Create a file index.html

```

    
        
    

```
    
        
    

Me copy-pasta
    
        
    

```

    
        
    

```

* * *

Tutorial: open in browser and see error:

```
Uncaught ReferenceError: goog is not defined

```

Me  
_Check_

* * *

Tutorial: modify index.html

```

    
        
        
        
            goog.require("hello_world.core");
            // Note the underscore "_"!
        
    

```

Me copy-pasta

```

    
        
        
        
            goog.require("hello_world.core");
            // Note the underscore "_"!
        
    

```
        
    

* * *

Tutorial: Refresh your index.html and you should finally see "Hello world!"

Me

```
base.js:677 goog.require could not find: hello_world.core
    goog.logToConsole_ @ base.js:677
    goog.require @ base.js:709
    (anonymous) @ index.html:6
base.js:711 Uncaught Error: goog.require could not find: hello_world.core
    at Object.goog.require (base.js:711)
    at index.html:6
goog.require @ base.js:711
(anonymous) @ index.html:6

```

Wut??? Being a first attempter hello-world implementer surely doesn't make one familiar with the error messages of a new compiler. So I was somewhat perplexed on what was wrong, what to do, how to debug and generally where to look

Did a list of files, although I had no idea what to look for

```
hello-world» find
.
./build.clj
./out
./out/main.js
./out/goog
./out/goog/math
./out/goog/math/integer.js
./out/goog/math/long.js
./out/goog/debug
./out/goog/debug/error.js
./out/goog/reflect
./out/goog/reflect/reflect.js
./out/goog/dom
./out/goog/dom/nodetype.js
./out/goog/deps.js
./out/goog/asserts
./out/goog/asserts/asserts.js
./out/goog/base.js
./out/goog/string
./out/goog/string/stringbuffer.js
./out/goog/string/string.js
./out/goog/array
./out/goog/array/array.js
./out/goog/object
./out/goog/object/object.js
./out/cljs
./out/cljs/core.cljs
./out/cljs/core.js.map
./out/cljs/core.js
./out/process
./out/process/env.js
./out/process/env.js.map
./out/process/env.cljs
./out/process/env.cljs.cache.json
./cljs.jar
./index.html
./src
./src/hello_world
./src/hello_world/core.cljs

```

Look okay I guess. If anything, only the file I've could have messed up would be`src/hello_world/core.cljs`, but it seemed correct. I then began cat'ing files and found abvious nothing wrong. A bit frustrated, I followed the next steps in the tutorial which refactored some of the build and dependency stuff. The same error however still appeared.

For reasons unbeknownst to my self, I then opened the file in VSCode - the colorcoding immediately revealed something was wrong. The top line of the clojurescript file was not colored like the others

```
ns hello-world.core)
(enable-console-print!)
(println "Hello world!")

```

Great Scott! I've made a copy-pasta error and missed a begin-parens `:-O`

Wrong `ns hello-world.core)`

Right

```
(ns hello-world.core)

```

Here I was cursing and swearing at the quick-guide. I was definit sure that I'd done it right, but alas a syntax violation was committed

I do wonder though, why the compiler did not error out on this!??
