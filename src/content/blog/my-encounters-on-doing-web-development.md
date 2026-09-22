---
title: "My encounters on doing web development"
description: ''
pubDate: '2021-12-14'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "web"
---

**MY ENCOUNTERS ON** doing web development, is a "small" writeup on the experiences and considerations I had when updating and re-writing a web-app used for a product at work. The web-app is an UI served from the product and is used to provide basic daily use, simple adjustment and advanced configuration on the product. This is **not** a tutorial on how to upgrade any web-app nor a guide on what and how to web development, its just an arbitrary list of topics I found interesting during the process.

(From here on the web-app will be referenced as "webui", as this is the internal name used for it.)

# Introduction

Let me make it clear, I'm no seasoned professional web developer. Its an exciting area and I've done lots of passive reading on the topics of JavaScript, React etc. Particularity I have great interest in new web programming languages like ReScript and F#/Fable. I did dabble a bit in those languages in my spare time, but only tiny projects that never evolved into something real. When it comes to JavaScript and React, I in fact did some pre-study at work on this particular webui and recommended React as framework. This was when React was version 0.13 (2015). Then for the next half year I was reviewer until the project got outsourced. Around 2018 the project had been inhouse a couple of years, and over the next years I did bugfixes, minor additions and package updates. Then in 2020 it was clear that the webui needed a major package update. The task fell on me. Generally all packages was from 2015 or 2016, so it was a huge task with great confusions, sweat and tears - but also with great satisfaction and a spike in the interest of doing some web development. Then came 2021 and we had to incorporate a new rest-api. This meant that the webui had to be re-rewritten as the old api's were tightly integrated into all of the source code.

With that in mind, I'm know the seasoned web-developer surely will find this post to be full of decisions and conclusions that might seem obvious, false, uneducated and perhaps even plain stupid... but thats exactly why I endeavoured into this task. It was exciting new territory for me, and the chance came up to learn something quite different from the usual C/C++ middleware programming. Although the job had a strict (and as usually, optimistic) deadline, I made a bid for the task and got it. Fear and joy at the same time.

The feeling I had during, especially, the beginning of the project was very much alike what is formulated in this post https://jrsinclair.com/articles/2019/what-i-wish-someone-had-explained-about-functional-programming/. Its a humbling feeling to fumble around with, what is perceived as basic stuff for the average web-developer. But I think its very healthy for every software developer to every once in a while to throw one self out in the deep end. Learn new stuff, gain experience, broaden the horizon.

# The tasks ahead

The package upgrade task in 2020 had landed the webui on React-16. This was good. I did look at upgrading to React-17, but most other packages didn't seem ready for this just yet.

Before beginning any "real" work, I wrote a document describing on how the current software worked, the technologies used and how I perceived how the path forward should go. I also contemplated on the fact of many of our bugs had been due to accessing huge data structures with no type information/safety - and then spelling errors in variables and properties. I also made a ball-park time estimate (which I grossly underestimated). Explaining to my self how something like React and Redux worked also went into the document. When you think you know something about a certain topic, but when you then have to explain it to someone else (or my self in this case), you often realize that you do not know as much as you think, or at least some concepts are only known vaguely.

## Dated react patterns

The original webui dated back before classes was added to Javascript (~2016). To facilitate a OOP experience, the React team provided a class like solution `createReactClass`. A good portion of the components utilized this feature

```js
export default createReactClass({
    getInitialState() {
        // initialization (constructor)
    },
    componentDidMount() {
    },
    componentDidUpdate() {
    },
    render() {
        // jsx/html
    }
})
```

React later transitioned to real class implementations of components, and a few of the components was made with this

```js
export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        // jsx/html
    }
}
```

Then in React-16.8 Facebook followed the consensus of the JavaScript community and went functional. With a feature called [hooks](https://reactjs.org/docs/hooks-intro.html), then changed the programming paradigm back to original JavaScript and implements _functional components_ using normal functions only.

My personal bias of preferring functional and functions over oop probably helped in the decision, but from all I could read this is the future for React. I also seemed like the general community of libraries either had, or is in the progress of, moving to hooks. So if a component would need a rewrite, I would convert it to a function component

## The state store

Along with React, Facebook provided a design philosophy [flux](https://facebook.github.io/flux/docs/overview) that specifies how to construct an app without the entangling complexity that often happens in typical MVC designs. They envisioned a design with unidirectional immutable data flow. When we started the project in 2015'ish [RefluxJs](https://github.com/reflux/refluxjs) was one the more promising implementations of the flux concept, and that is what we decided to use.

The design and implementation of stores in ReactJs are in concept very much alike the React part. The ReactJs stores, utilizes the mixin concept in React to integrate (mixin) the store state into scope and hook into the lifecycle functions of any view utilizing the store.

It was clear that ReactJs had to be replaced.

- **No longer maintained**. The project was abandoned by maintainers in 2016, which is before release of React-16 (2017). During the 2020 package upgrade I found a forked edition of RefluxJs, but that is only updated to not conflict on dependencies - some features of React-16 will either not work or even [break](https://github.com/reflux/refluxjs/issues/549) with RefluxJs.
    
- **Multiple stores**. The idea of implementing the flux pattern with multiple stores was pioneered by RefluxJs, and seemed like a very good idea in the beginning, but real world use have revealed that it often leeds to high coupling between components ("spaghetti code").
    
- **Uses React Mixins**. Mixins was an addition to React that should make reuse easier. In reality this feature has proven to do "too much magic", and actually generate nondeterministic/surprising outcomes. The React developers considers this a broken feature, and highly [discourage the use of mixins](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html).
    
- **Easy to misuse**. Several places in the source the state is modified outside of its update functions. This is of cause more at fault of the various developers than of the framework - but it is an easy mistake to make.
    

I still wanted a state store. It's a good concept, so I focused on finding framework that is plenty used, have very good documentation and is easy for find help for. The pick quickly ended on [redux](https://redux.js.org/) and [React-redux](https://react-redux.js.org/).

## Gulp

[Gulp](https://gulpjs.com/) is a build automation tool, and in the old webui this is the only entry point for executing compilation, linting etc.

I wanted to get rid of Gulp. All what we used Gulp for now is provided by Webpack plugins, and in my mind Gulp just adds an additional level of abstraction that makes the build process more opaque.

## Simulation server

I wanted some way to easily verify the webui during development. There was extensive [Selenium](https://www.selenium.dev/) coverage on the old webui. These tests were however tightly coupled with verifications and setup methods that used the old rest-api. Also the Selenium test where tightly bound to the source/structure of the old webui - something that would likely change in the rewrite. All in all this was not something that could easily be reused within the timeframe.

As the product rewrite was ongoing simultaneously with the webui rewrite, I decided to replicated what we had for the old webui. Create a simulation server that would act like a product, but have extra test features. For the old webui this had been extremely useful when doing development and bugfixing. It also allows for not having a real product (which are a scarce resource). This route would also allowed me to do features independently of the product developers, and in best case have features ready before them, so they could use the webui for real product interaction.

## New rest-api

The old webui used a hand-rolled api implementation, but as the new api was already specified in openapi format, I decided to use openapi for client generation.

  

* * *

# Languages

I had some wishes and considerations when choosing what language to use for the implementation. In the end I ended with just using JavaScript. There were several reasons for this. Certainly it would give the least friction when other colleagues would work on the project. I wanted to rewrite the old app replacing it step by step, module by module. With the attempted language alternatives, I could not really get low enough friction on, this to have the time overhead be acceptable. Last but not least, teachings, articles, blogs and youtube material is abundantly available for JavaScript - it was the safest bet for an inexperienced web developer

## ClojureScript

Once upon a time when we first endeavoured into making web-app's I recommended [ClojureScript](https://clojurescript.org/). This was from personal interest and fascination of the clojure language. This proposal was reject by the senior architect for being too unfamiliar. I could only agreed with that. Also the tooling was quite new and brittle at the time. As this rewrite was to be made by me alone, this was the perfect opportunity to use ClojureScript. I was sure that I would get some backlash, but I was prepared to take the discussion. If I could just show how beautiful an initial state store and a view that would reuse existing components would be, I was sure I could win the argument. Sadly I fell short even before that. Despite my best efforts, I could not find any online resources describing how to include ClojureScript into an existing React project and do partial porting step by step. I got the impression that the tooling is constructed to be greenfield projects only. That would not work for me... Darn'it

My only (tiny) worry with ClojureScipt was it being a dynamic untyped language. I had read plenty of articles promising that, due to the data oriented principals of Clojure, this was not an issue at all. I was willing to bet on it, but when that went bust I turned to the complete opposite - ReScript with types everywhere.

## ReScript

It might have been bad timing, but when deciding to go with [ReScript](https://rescript-lang.org/) this was right in the midst of the Reason to ReScript [rebranding](https://rescript-lang.org/blog/bucklescript-is-rebranding). That turmoil of uncertainties and discrepancies in the half-updated documentation kind of made the learning curve even more steep than it should have been.

I did manage to port one larger React component to ReScript - I can't recall feeling more proud than when everything finally compiled and worked. The interop with existing JavaScript was by far the major hurdle to grok.

So, documentation could be improved I think, but it might also just be that I was beginning to hit my learning overload limit, with React, redux, webpack, babel etc etc filling up the capacity in my brain 😄 Anyways, I really did like what I got a taste of. It felt like a great language with great ambitions that could be useful for a type safe web development experience. It prides itself on the interop features. I guess for me that part was a bit difficult - but its a focus point of theirs, and have been from the start, so if any language of this kind will make this work, ReScript could be it. I can't help comparing it slightly to F#/Fable. My vague feeling of F#/Fable is that the language is more production ready, but harder to incorporate into an existing JavaScript project.

Eventually I went against my personal wish and preference, I decided not to go with ReScript. I foresaw the language interop to be a big part of the ReScript task, and given the difficulties I have had with it, this would most likely break the time schedule. Instead I would try out TypeScript. Chances are that other people are to work on this codebase after me, and familiarity with TypeScript have higher chance than with ReScript

## TypeScript

I had a couple of attempts to port the project to [TypeScript](https://www.typescriptlang.org/). First was using [ts-migrate](https://github.com/airbnb/ts-migrate). Its a tool that can convert an entire JavaScript to TypeScript in one go. Unfortunately it kept failing to compile some of the source files. It also seem to have issues with resolving import aliases. Later in the project I did a second manual conversion, where I started porting a simple view and a simple store. Moving an existing project to support both JavaScript and TypeScript was not easy to grok. Especially the linting part gave me trouble. The webpack and babel configuration parts was no easy feat either. Got the impression that there is tons of ways to set this up, and everyone is doing it slightly differently or things are slightly outdated. The plethora of required babel, eslint and webpack plugins to install and configure just right, took me days of reading, guessing and doing/undoing/redoing to the point where I was quite frustrated. I don't remember the details, but eventually I finally made the project build for production and having hot-reloading working for development, and all linting working. In the end I was then blocked by not being able to make the openapi generated code (by typescript-fetch) communicate with the server. In a getter function it errorr'ed out from the deeps of the generated source with a type error. Eventually I was forced to abandon the porting due to lack of time. I could not justify the spending of time to my manager.

In the end of the project I did a third try on porting the project to TypeScript. I now had more experience generally and also now having had tried it twice before, I knew more of what to do. This time I managed to get the project converted and working. One first PR was getting all the compiler stuff working with all plugin settings etc setup. A final PR then tweaked the linter settings and ported a few files. The efforts was rejected in review though, and stranded on a branch. It was too late in the project to even consider a porting to TypeScript. 🤷

## Flow

After the first failed TypeScript attempt, I did try [flow](https://flow.org/) types. Including flow support in the toolchain was much easier. Initial experience was, that adding types to existing code somewhat spiralled into an huge graph of having to annotate more and more and more before being able to compile. This meant a huge upfront task. In the end I did not want to commit to spending the time. Also the general community was recommending against using flow, so I ended up abandoning flow.

  

* * *

# Implementation

## Redux

Confusion! Lots of confusion

When I started reading the redux documentation I had a good feeling about it; but for a C/C++ developer such as myself, there was a massive amount of new stuff to grok. So I decided to read the documentation from beginning to end. So I read and I read. Its extensively documented... in fact so massively extensive that I began loosing concentration before reaching the end 😂 When I finally figured I had read enough I had a vague, somewhat opaque, understanding of redux.

I decided to do a tiny sample project. This helped a lot to get understanding of the basics. The redux developers spoke highly of their new abstraction "Redux Toolkit" (RTK), so I decided to base the implementation on that. In retrospect this gave me some unexpected difficulties understanding stuff. The abstraction level is much higher, so its actually a bit hard to reason about what is going on. Also there was almost no examples to be found (this has improved since). Plenty examples on the "old" redux way, but that didn't seem to fit at all. Redux Toolkit being [Immerjs](https://github.com/immerjs/immer) based did stuff a completely different way. After the first couple of slices I got a pretty god grasp on how things were fitting together, and my mental picture of a redux application began to be enlightened to a level where I could make educated decisions instead of trail and error and guessing.

By the way, I wonder if Immerjs has any resemblance with [Immer](https://github.com/arximboldi/immer)? I was very exited watching Juanpe Bolívars YouTube videos of his immutable C++ library. Anyways I quickly became quite impressed of the easy creation of modified objects that is provided by Immerjs, and in the end I used it extensively. Didn't deep dive, but Immerjs seem to be some kind of proxy based technology. This makes introspecting difficult. The Redux Toolkit provides a function `current` that can help printing values.

Now when beginning a project on unfamiliar territory its not hard to imagine that stackoverflow will be visited a lot initially 😅 Having chosen to use the quite new Redux Toolkit narrowed down the helpful posts quite a bit. A few very well written blog post however did help tremendously. It appears that Redux has evolved over time and tried out several concepts in its lifetime. Sometimes when reading a blog or stackoverflow the answers would use solutions from different versions of Redux. I remember an episode having searching for a solution quite a while, then finally finding an answer using [`connect`](https://react-redux.js.org/api/connect) and [`mapStateToProps`](https://react-redux.js.org/api/connect#mapstatetoprops-state-ownprops--object). This left me quite perplexed. I had absolutely no recollection of reading about `connect`. Must admit I had a brief feeling of despair - looked like I hadn't grasped anything after all. Back to the Redux documentation... here I found why I had missed this concept when reading the redux docs. https://react-redux.js.org/tutorials/connect had this tip box:

> Tutorial: Using the connect API We now recommend using the React-Redux hooks API as the default. However, the connect API still works fine.

To not overload my brain with new info, I had simply skipped reading on `connect` related stuff, as I figured I would not need it. 😄 Similar experiences happened several other times, for same reasons. A Redux technique had been replaced by another.

Another "funny" story about my experience with the Redux Toolkit documentation, is regarding the `extraReducers` examples. All the exampled uses a JavaScript syntax that was unfamiliar to me

```js
    extraReducers: {
        [fetchSources.pending]: (state) => {
            state.status.sourceList = Status.loading
        },
        [fetchSources.fulfilled]: (state, { payload }) => {
```

I had no immediate luck on google on the syntax. Redux documentation did mention an alternative syntax of use `builder.addCase`, which gave me an understanding on what was going on. It wasn't actually until later when doing a porting to TypeScript that I learned that this is called [computed property name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) and was introduced in es2015 🤷

There were some concepts not possible in Redux - like emitting another action from the reducer. This was perfectly possible in ReactJs, but Redux is very opinionated on what can be done and how. At first this feels very limiting, and frustrating to some extend, but in the end its for the greater good, and helps keeping the overall design clean and orderly.

## Openapi

We had decided to use openapi to spec the rest-API. I find openapi to be some extremely valuable piece of software that makes developing rest-API a breeze compared to doing it manually.

However there are some definite quirks. The openapi framework uses different generators to generate server and/or client code in many different programming languages. These language generators are in various state of capabilities and qualities.

There are plenty more client generators than server generators. Maybe most use the same server or just roll their own, but fact is that generally the server implementations have loooooots of issues. Frankly I'm a bit dismayed by the state of the generators. For example then the kotlin server even generated completely invalid code (using 5.1.1).

Same goes for some situations of the go server. For example it has a kink in its query parameter handling. If having a query parameter defined as an enum, the generated golang code for the query handler will assume that it is a string, but the receiving functions are generated expecting a (non-optional) enum arguments. This ends up with code that attempts to do invalid value assignment to the enum instance, and ends up in a compile error. Had to hack the output a bit for that. Another (major) issue is that the generated golang server does not handle optional fields! This has been patched for the client generator https://github.com/OpenAPITools/openapi-generator/issues/522, but unfortunately not for the server generator 🥺 I had to do some sed and awk shenanigans on the generated output to get the [simulation server](#chapter-simulation-server) working.

The python server worked quite good, but for [other reasons](#openapi-python) I ended up ditching that.

For the client generators the situation is better. Most output works quite well. For javascript client source I used javascript-flowtyped. The output project from this, has an option to compile an end resulting javascript library without the type annotations. This way the generated client library can be used in a non-flow typed project, but the type annotated files could still be used for reference. This proved immensely useful.

The general framework of openapi also have some quirks. The spec is defined in yaml. This opens op for quite the flexibility in how items are defined. There is the openapi spec syntax that you have to adhere to, but there are lots of options to do things differently. However not all constructs works equally well.

I was hit by some "funny" quirk in the source generation. This issue occurred the same across all the outputs I tried: JavaScript, Go, C++ and C#. When having multiple types sharing the same content, it would be reused with the name from the first occurrence

```yaml
SoundAdjustments:
  type: object
    properties:
      bass:
        type: object
        properties:
          value:
            type: integer
          range:
            $ref: '#/components/schemas/IntegerRange'

SourceSettings:
  type: object
    properties:
      timeout:
        type: object
        properties:
          value:
            type: integer
          range:
            $ref: '#/components/schemas/IntegerRange'

```

In the above example, the object with value and range were recognized as a reoccurring artifact and extracted to a separate type and reused. Now this would give me two types, where only the first is obviously correct.

```go
type SourceAdjustments struct {
    Bass SoundAdjustmentBass
}

type SourceSettings struct {
    Timeout SoundAdjustmentBass
}
```

So here I had to refactor either to a common ValueRange type or multiple identical types with distinct names. I chose the latter to have the generated code be more self describing.

Even though I was very pleased with the output form the javascript-flowtype generator, that also had some issues. Calling an openapi function with wrong amount of parameters does not give any indications of error, and absolutely no feedback in console about what things are not working. I would have expected some kind of error thrown or at least a log entry. Invalid arguments would throw, so it did do input type validation 👍

A final warning about the openapi toolchain is to make sure what generator version is used. Our existing automated testing framework already handled several products also using openapi. The generator would use openapi toolchain version 4.0.1. Now our product reused a resource from another product, but added an `allOf` to the resource. This is a perfectly valid construct, but the generator would output an empty type for that construct - without any warnings! I had to do an upgrade to latest 4.x.x series (4.3.1) to get the generator to output correctly.

All in all the openapi tooling is an awesome piece of technology, and I'm extremely pleased that we chose to use it. It certainly has its kinks, but oh well, its free and it sort of works 🙂 It also have another huge benefit that I didn't mention. You can run a swagger instance on your target with the openapi spec loaded. Now you have a swaggerui running that enables you to manually access the rest-API in a very easy way. Immensely valuable to check things out when the webui is not done for that endpoint yet - or you're debugging issues in either server or client implementation.

  

* * *

# Simulation server

As mentioned in the [openapi section](#chapter-openapi) there was a lot of issues with the various server generator output. I had initially hoped to use Kotlin generator, as this would give me a chance to do some real work with that language. Truthfully I really wanted to use one of the F# generators, but I knew that would never fly, as this language is too far away from what is familiar to others developers (myself included). Kotlin I could better sell as being an improved Java. But as it generated invalid code, I just settled for python. This was also the pragmatic choice always lingering in the back of my head. We already use python-3 for automatic testing.

The generated python server worked really well. The dynamic features and introspection capabilities of python was cleverly utilized, and output was very pleasant to work with. Finally I did hit a roadblock. I wanted to have the server provide a cli interface where I could emit websocket notifications at will. I could not figure out how to incorporate this multitheaded feature with python-flask. I found some solutions with google, but they all had to resort to overly complex solutions to get it to work. When I then read a comment that this would be trivial in golang, I tried the golang server generator go-server.

I had zero prior golang experience, so it was an exiting thought to try out the golang generated server. It took me an amazingly short amount of time to port the python code to golang (fortunately this was early in the project). And true to the promise, the dual feature of having the rest server running with a cli, implemented trivially due to [go routines](https://golangdocs.com/goroutines-in-golang).

Now the output from the golang generator was not up to par with the quality of the python one. It had less types defined, and a bit more coding was needed. Also the python edition provided a way to add functionality with minimal changes to the generated code. The output from the golang generator required more poking in the generated code. This is important, as the api was not finished, and had to be re-generated multiple times. In the beginning it was not too bad. Manual merging only took few minutes every time, but over time it became more complex due to the manual patching needed to accommodate for the golang server [shortcomings](#openapi-golang).

## Golang

A few thoughts on the golang language itself... its incredible easy to get productive in. Don't know if its because I have C experience, but it took like zero time to get real code working. Additionally the documentation is great. Online help is plenty, and the simplicity of the language makes most solution straight forward and understandable. I get a very distinct C vibe, but with improved productivity. Things are easy, and you get to the end result fast. Hard to complain really, but I think some of the joy and excitement of programming is a little lost (this is of cause a entirely personal opinion). _Pragmatic and boring_ might be a fitting description.

Not all is good though. It didn't take long for me to bet a bit annoyed about golang. Main gripes are its lacking generics, its crippled enums and its repetitive error handling. I circumvented the enum issues by generating them instead. For this I used https://github.com/abice/go-enum

### Hot-reloading

As the compiler is quite the fast one, so it didn't take me long to wish for a hot-reloading development environment just like the JavaScript counterpart. Fortunately many others have had the same wish, so there was a lot of solutions for this. However it was not easy to find an working solution that would accommodate my requirements. The fact that I have a running cli interface broke each and every one of those. They all seem to parse the stdin/stdout and breaking when the program itself also use it. I ended up using [air](https://github.com/cosmtrek/air). This program allows for redirection of stdin, so I moved stdin to fd 3.

I tweaked the input scanner initialization

```go
var fd = os.Stdin
// Check if started with live reload by 'air' where air is started by moving stdin to fd 3 using `air 3>&0`
err := exec.Command("/bin/sh", "-c", "readlink -f /proc/self/fd/3 | grep -q '/dev/pts/0'").Run()
if err != nil {
    fmt.Println("Reading stdin from fd 3")
    fd = os.NewFile(3, "stdin")
}
scanner := bufio.NewScanner(fd)
```

and start air with redirection

```bash
» air 3>&0
```

Update: this issue appears now to be solved: https://github.com/cosmtrek/air/issues/102

  

* * *

# Libraries

My general wish was to include more functional approaches, and use this webui task as an opportunity to learn some more functional programming. This was not something I had extensive experience on. Sure I trivially use maps, filters, comprehensions and what not i various languages. I've also made some tiny programs in scheme, F# and other functional programming languages, but when it comes to leaning something, using it in actual real code makes a great difference.

There are many many sites about functional programming, but if you are new to functional programming and want a JavaScript point of view I would like to highlight two resources that I found very valuable.

First for general understanding: [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/)

Next [James Sinclair](https://jrsinclair.com/) has a series "Algebraic Data Types: Things I wish someone had explained about functional programming" which is very enlightening

1. [Faulty Assumptions](https://jrsinclair.com/articles/2019/what-i-wish-someone-had-explained-about-functional-programming/)
2. [Algebraic Structures](https://jrsinclair.com/articles/2019/algebraic-structures-what-i-wish-someone-had-explained-about-functional-programming/)
3. [Type classes](https://jrsinclair.com/articles/2019/type-classes-what-i-wish-someone-had-explained-about-functional-programming/)
4. [Algebraic Data Types](https://jrsinclair.com/articles/2019/algebraic-data-types-what-i-wish-someone-had-explained-about-functional-programming/)

I mentioned that I've made contributions to the webui before. One of the things I did was introducing [lodash.com](lodash) (well, actually first [underscore.js](https://underscorejs.org/) which I then later changed to lodash). I really love lodash and its plethora of useful functions. It helped in eliminating a large pool complexities in the code base.

Seems there are a lot of [opinions](https://til.hashrocket.com/posts/dnzttruljf-prefer-lodash-es-when-using-webpack) on how to import lodash. Wish there was pro/conn discussed at the lodash webpage ¯\\\_(ツ)\_/¯. I think the lodash site could do a better job explaining all the variants of the lodash library. It was by round-about ways I found that there is a [functional variant](https://github.com/lodash/lodash/wiki/FP-Guide) of lodash. Sure its **linked** to in the site, but its just an unexplained link, buried in a pile of other links.

Now there are some that mean that you should [move to](https://glebbahmutov.com/blog/lodash-to-ramda-example/) [ramda](https://ramdajs.com) instead. Then there is [sanctuary](https://sanctuary.js.org/) which thinks rambda is [no good](https://sanctuary.js.org/#section:ramda).

Sanctuary referenced [fantasy-land](https://github.com/fantasyland/fantasy-land) a lot, and in general the entire library seemed quite academic. Rambda talks a lot about lodash not being pure, and how they are doing things the right way (something which Sanctuary disputes). In the end, I found no good reasons for switching away from lodash. Maybe this is just because of our relative light use of it. The Sanctuary site linked to [Folktale](https://folktale.origamitower.com/). This library looks very interesting, well thought out and with good clean documentation.

One thing is for sure, JavaScript does not lack choice when it comes to functional libraries ( [stoeffel](https://github.com/stoeffel/awesome-fp-js), [xgrommx](https://github.com/xgrommx/awesome-functional-programming)). Fact is though, that JavaScript can do alot on its own. What actually improved much of the code experience the most, was using the "new" [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator `?.` and the [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) operator `??`. Both helps avoiding long blocks of `if-else` null/undefined checking. I want this in every other language now!

## dollar-if

I often find myself thinking "This could be so much nicer if this `if` statement could just return a value directly. [dolla-if](https://github.com/delanni/if-expression) to the rescue. There are other libraries out there doing the similar, but I settled for this because the syntax was very similar to usual promise handling syntax. [two-little-libraries](https://tgvashworth.com/2017/04/07/two-little-libraries.html) is another example. The syntax though, looks more like pattern matching.

I bit later into the use of dollar-if I found i had certain "disadvantages" that made is less desirable. In its `if-then-else` form both branches are evaluated. This makes it usable for things like

```js
import $if from 'dolla-if'

<FormattedMessage id={$if(hasActiveSource).then(active_source.text).else(no_active_source.text)} />
```

This won't work, as all properties are not available for all branches

```js
import $if from 'dolla-if'

$if(source.data.index).then(
    <Component index=${source.data.index}></Component>
).elseIf(source.data.id).then(
    <Component index=${source.data.id}></Component>
).else(
    <Component />
)
```

Instead the documentation hints that the `if-thenDo-elseDo` form should be used, as that do not execute all branches...

```js
import $if from 'dolla-if'

$if(source.data.index).thenDo(() => {
    <Component index=${source.data.index}></Component>
}).elseIf(source.data.id).thenDo(() => {
    <Component index=${source.data.id}></Component>
}).elseDo(() => {
    <Component />
})
```

In most of my cases, this didn't add much over the native ternary operator. One could even speculate reduced performance in dollar-if give the extra function calls. Also there is the added unfamiliarity for coworkers.

```js
(source.data.index) ? (
    <Component index=${source.data.index}></Component>)
) : (source.data.id) ? (
    <Component index=${source.data.id}></Component>)
) : (
    <Component />)
)
```

I ended up using it only a few places, and eventually most of it was refactored to use the ternary operator (`?:`)

## daggy

There are plenty of libraries that do sum type and/or pattern matching for JavaScript. This is just a short list of the libraries I discovered.

- [https://match-toy.github.io](https://match-toy.github.io)
- [https://moritzploss.github.io/ex-patterns](https://moritzploss.github.io/ex-patterns)
- [https://gitlab.com/harth/stags](https://gitlab.com/harth/stags)
- [https://github.com/fantasyland/daggy](https://github.com/fantasyland/daggy)
- [https://github.com/andrejewski/tagmeme](https://github.com/andrejewski/tagmeme)
- [https://github.com/Zaid-Ajaj/tagmeme-analyzer](https://github.com/Zaid-Ajaj/tagmeme-analyzer)
- [https://github.com/foxdonut/static-tagged-union](https://github.com/foxdonut/static-tagged-union)
- [https://folktale.origamitower.com/api/v2.3.0/en/folktale.adt.union.html](https://folktale.origamitower.com/api/v2.3.0/en/folktale.adt.union.html)
- [https://github.com/geigerzaehler/sum-types](https://github.com/geigerzaehler/sum-types)
- [https://github.com/phenax/enum-fp](https://github.com/phenax/enum-fp)
- [https://github.com/JAForbes/sum-type](https://github.com/JAForbes/sum-type)

In the end, I chose from the amount of articles available on it. From the fantasy-land repo I ended up using [daggy](https://github.com/fantasyland/daggy). This is a library for sum types. Its a simple library but it works remarkable well.

I wish I had introduced this library into the code earlier. I think it provided great help in simplifying many constructs. In many cases, a function would do almost the same but with slight variations. Instead of making individual functions or a myriad of parameters, daggys capability to carry information and having the receiver easily distinguish its type was a real eye opener of the concept.

```js
const ClickAction = daggy.taggedSum('ClickAction', {
    Activation: ['Id'],
    Cancel: []
})

<ChoiceDialog
    onLeftClick={() => onButtonClick(ClickAction.Cancel)}
    onRightClick={() => onButtonClick(ClickAction.Activation(currentId))} >
```

## Pratica

Inspired by James Sinclairs article [Elegant error handling with the JavaScript Either Monad](https://jrsinclair.com/articles/2019/elegant-error-handling-with-the-js-either-monad/) I wanted to use a `Result` type to do error handling.

I figured finding a functional library would be a good approach. Perhaps I would get other things for "free" also. I already had "lodash/fp" of cause, but figured I would look into other libraries to supplement. Turns out there is an "infinite" variety of functional libraries for JavaScript. Below is just a tiny fraction of the possibilities

- [https://github.com/rametta/pratica](https://github.com/rametta/pratica)
- [https://fpromises.io](https://fpromises.io)
- [https://monet.github.io/monet.js/](https://monet.github.io/monet.js/)
- [https://www.7urtle.com/](https://www.7urtle.com/)
- [https://folktale.origamitower.com/](https://folktale.origamitower.com/)
- [https://github.com/fantasyland/fantasy-land](https://github.com/fantasyland/fantasy-land)
- [https://ramdajs.com](https://ramdajs.com)
- [https://sanctuary.js.org/](https://sanctuary.js.org/)
- [https://github.com/fluture-js/Fluture](https://github.com/fluture-js/Fluture)
- [https://rubico.land](https://rubico.land)

I settled on [Pratica](https://github.com/rametta/pratica). It have good documentation and is not too big, not too small. I found the experience to be very good.

Below is an code example of how I used the result type (`Ok`, `Err`) from Pratica to handle some data validation

```js
const handlePeqData = (callback, event) => {
    event
        .cata({
            Ok: (event) => {
                Ok(event)
                    .map((event) => event.target.result)
                    .chain(parseJson)
                    .chain(listToItem)
                    .chain(validateLoadedPeq)
                    .chain(convertJsonPeqFormat)
                    .cata({
                        Ok: (peq) => {
                            callback(Ok(peq))
                        },
                        Err: (msg) => {
                            callback(Err(msg))
                        }
                    })
            },
            Err: (event) => {
                callback(Err(`Peq load error! (code=${event.target.error.code})`))
            }
        })
}
```

  

* * *

# Conclusions

In the end the project ended up with 18 greenfield Redux stores and 25 React views reimplemented practically from scratch. Most of the sub-components and helper libraries could be reused with none or only minor changes.

Redux was great. Same was using React with hooks.

The tooling landscape of web development is vast. I have no trouble understanding why tools like [Create React App](https://create-react-app.dev/) exists. I think I ended up having a good understanding the moving parts of webpack and its plugins; but its clear that without stackoverflow and other helpful guiding blog-post, this would have been an (even more) uphill battle. Getting rid of Gulp was a good move. For a duration I had building working with both Gulp and webpack directly. I experienced more that once in the transition period, that the Gulp build method swallowed/hided process errors. It might be due to misconfigurations, but that just justifies getting rid of the additional layer of complexity.

One decision I took before beginning the task, was to write a work log. Web development was new territory for me, and lots of new information needed to be processes. So each day I would do meticulous logging, noting each problem I had and the solutions I found. For the initial package updating task I noted some 3500 lines, and for the final rewrite the log was about 4800 lines (both including a daily headline of date). These logs were extremely valuable. First of all I was the only person on the task (although others would review), but putting things to "paper" would manifest things better and I had to reason about decisions. It was also very valuable to be able to go back in history, and see why I took certain decisions later on. Generally I learned a lot. Recording this knowledge hopefully helps me remembering this stuff longer. At least I know where to find the information again. From a more project planning perspective it also allowed me to better see how much time I was using during the project. And lastly it was a good reference for use in the daily standup sessions when come monday you forgot what you did on friday 😄

[As mentioned](#many-bugs), the two primary reasons for bugs in the old webui was:

1. Access mistakes in deep nested complex data structures.
2. Spelling errors in functions and variables.

The former was a direct consequence of the old rest-API being very complex. In the re-write the rest-API was designed as simple and flat as possible. Having Redux as an intermediate between the views and openapi also benefited.

For the second range of issues, I from the beginning configured linting to be mandatory, strict and cover as much as possible with every useful extension enabled. This helped tremendously during development.

Still some issues manage to repeat itself

- Incomplete or half done refactorings would go unnoticed until runtime
- Linter not able to see and validate data from Redux stores used in views.
- There are many settings in a slice in Redux Toolkit, and they are all strings. Any copy/paste or spelling mistake here is extremely difficult to find as nothing will complain, the slice will just not work.

Despite these issues the situation of using plain JavaScript was not at all as problematic as I initially imagined, but some facts also assists this experience. I was the sole developer on this and worked non-stop from begin to end. The old app had 7-8 different people working on it from time to time over a range of years. I still think I would prefer to have some guidance from a typed language like ReScript or TypeScript where the compiler would insist on helping.

I do find a bit comfort in that the lines of code reduced pretty significant. There were several reasons for this. First of all, second time around writing the "same" implementation, the level of insight into the domain is just that better. Equally significant is the change to openapi and the fact that the new rest-API is simpler. The old API had complex resources with flexible capabilities information and endpoints being dynamically discoverable at runtime.

Regarding the implementation I set out to keep the design very lean and data oriented. No enterprise design patterns or too many higher order functions - simple and straight forward ([kiss](https://en.wikipedia.org/wiki/KISS_principle)). Inspired (and somewhat enforced) by the Redux philosophy I also handled data immutable as much as possible. Where feasible I practiced functional paradigms but kept it pragmatic and mixed styles at best fit.

I have the deepest respect for web developers. They have to master just about everything between a quantum generator and a ludo game in this line of work. But no denying the JavaScript landscape is such an exiting arena. There seem to be an endless amount possibilities and the development is fast paced. There seems to be a continuous stream of new technologies, libraries and frameworks that promises to do things better and simpler. I can imagine its hard to keep up with all what is happening... Some of it is perhaps also self-inflicted by the community or even the developers themselves. Just while doing this project, not only did I explore different languages, I also several times wished I did the project in [svelte](https://svelte.dev/) and [esbuild](https://esbuild.github.io/) because this looked cool and could be the new next thing. I think I found a good middle-ground that allowed me to learn a lot, but also build a project that is possible for the next person to pick up.
