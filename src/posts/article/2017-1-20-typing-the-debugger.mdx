---
layout: post
title:  "How the Debugger got into the flow"
date:   2017-1-20
categories: DevTools JS
---

Last spring we kicked off a [re-write][re-write] of the Debugger frontend with the goal of being as developer friendly as possible.  

We believed that the only way to build a great developer tool was to have a process where anyone could get started hacking in 5 minutes with npm install, start.

We also wanted the architecture to be contributor friendly.  Redux was very helpful here because it answered two main questions:

1. What data is available? *e.g. where are the breakpoints stored*
2. What is the app API? *e.g. how do i add a breakpoint*

We also wanted to type the Debugger API and data. What’s wonderful about adding types is that  a contributor can come in, make a change, and if the type checker is happy, there is a good chance the Debugger will work.

 The way we thought about it,  type checking was the natural extension of linting.  It’s a tool that helps onboard new team members by finding all of the gotchas.

Here are some types to give you an idea of what we’re talking about here:

```js
type Breakpoint = {
  id: string,
  location: Location,
  loading: boolean,
  disabled: boolean,
  text: string,
  condition: ?string,
};
```

```js
type Location = {
  sourceId: string,
  line: number,
  column?: number
};
```

With these types we could write redux actions for **adding** and **removing** breakpoints:

```js
function addBreakpoint(location: Location) {
  // ...
}

function removeBreakpoint(breakpoint: Breakpoint) {
  // ...
}
```

There are a couple advantages to this style:
1. the code is easier to read
2. we get a warning if we accidentally call `addBreakpoint` without passing a location in or we try to pass too many arguments in.
3. anyone can look up the `Breakpoint` type and see what data it has. I do this *all* the time now!

Here’s the story of how we added types to the Debugger. It took us about six months.

### Typing the Debugger

In the summer we set what we thought was a modest [goal][mvp] of adding types in all of the major components of our app: actions, reducers, UI components, utils, and browser client. We just reached it, which is a sign that typing a sufficiently large application does take time and you should expect to do it incrementally.

Here’s the story of how we added types. There are some interesting lessons here and there are certainly a **lot** of people to thank.

**Step 1:  go to the center**

The core of the Debugger is the client that speaks with the browser. The Debugger started off with two simple modules `firefox.js` and `chrome.js` which were responsible for sending API commands and receiving events. One *great* decision we made early on was that the Chrome and Firefox clients would share the same API, so there would be only one way to set a breakpoint. James started adding types here [1][types-1]   [2][types-2]. The rationale was that if we got reliable data back from the client the rest of the Debugger would be a whole lot saner. In fact, if Chrome and Firefox shared the same API, then as long as we built the Chrome client to spec nothing else should change. This is still true today.

**Step 2: It’s about the data stupid**

We chose to use  **TComb** for typing the application in May. We chose it because we wanted a runtime type checker. At the time, we were not sure if would have a build step and using a runtime type checker meant that we would not be changing the syntax of the code. I also believed at the time that a runtime type checker would catch more issues. I  underestimated how  powerful static type checking can be.

We switched to Flow in July because we were running into issues incorporating Tcomb and immutable.js 1 . This is mostly incidental, but one benefit of using Flow is that a static type checker simplifies the way the data is represented at runtime. You don’t necessarily have to pass around wrapped objects. Also, after adding types twice, once for tcomb and once for flow, I can safely say that you should budget *atleast* two days to get everything working out alright.  There are a lot of inconsistencies in the code and complicated relationships like Redux Actions that require a thoughtful approach.

Once we added Flow, we  began typing our actions and reducers.

We started representing our Debugger actions in terms of a union type:

```js
type SourceAction =
  { type: "TOGGLE_PRETTY_PRINT", source: Source }
  | { type: "SELECT_SOURCE", source: Source, line?: number }

export type Action = SourceAction | BreakpointAction
```

These types have caught so many would be bugs, it’s not even funny. It’s like a fly zapper strapped to a drone.

**Step 3: UI matters**

Initially, I wrongly believed that our types would exclusively be used for the client and actions.  The reason I thought this was that the Debugger’s redux actions are the public API that it exposes to our UI and other potential extensions.

In October, [@Zacquary][zackary] asked if we could add types to Call Stack component. The reason for this was that we were seeing a surprising bug where when the App was active the Frames prop was null instead of an empty immutable list.  Adding types to the component meant that we could type the selectors and then add guarantees in all of our render methods so that they knew what to expect.

We’ve recently added types to the Seachbar, which helped us write safer code with the Editor and source text.  We want to add types to our other UI components so that we can have guarantees that we’re passing good data into our action dispatches as well.

**Step 4: connecting the dots**

As with many things, it comes down to doing a lot of little things. For us, there were some small wins along the way that made a big difference:

[Sankha][sankha] added types to our source map worker in October. The source map worker is responsible for receiving a text location from a bundle and translating it into a location in an original file and vice-versa. For instance, if you add a breakpoint in `my-awesome.ts`, the worker figures out where to add the breakpoint in `my-awesome.js`. Needless to say, this is some scary code and adding types makes it *much* clearer.

[Bryan][bryan] started adding types in October to our utility functions, which are touched in many places. He also added types in our [Sources][sources-actions], which was our second action/reducer pair to get types.

[Fernando][fernando] added types to our Pause action/reducer in November. I cannot overstate how important this is,  the debugger is *all about* showing pause data and it is complicated.

[Giorgio][giorgio], [Bryan][bryan], and I worked on adding types to our [client][client-types]. These types landed in January, but were complicated enough to be a month in the making. Once they landed [Arthur][arthur] did the really important work of using the client types in the Debugger. This was the first time that we wrote types in one npm package and used them in another, which was pretty scary at the time.

### Conclusion

Adding type checking last summer was one of the better decisions we made. It continues to help us write safer code and adds an additional automated check  during code reviews.

Like many projects, it has been a team effort and to get to where we are now.  Thanks, [James][james], [Bryan][bryan], [Sankha][sankha], [Fernando][fernando], [Zacquary][zackary], [Arthur][arthur]!

If you’re interested in helping us improve our coverage, here’s our current [report][report] and flow related [ssues][flow-issues].


[mvp]:https://github.com/devtools-html/debugger.html/issues/1585
[james]:https://twitter.com/jlongster
[zackary]:https://twitter.com/XerxesQados
[arthur]:https://github.com/arthur801031
[giorgio]:https://github.com/ppold
[sankha]:https://twitter.com/sankha93
[bryan]:https://twitter.com/clarkbw
[report]:http://jasonlaster.github.io/debugger-flow-report/
[fernando]:https://twitter.com/montogeek
[client-types]:https://github.com/devtools-html/devtools-core/blob/master/packages/devtools-client-adapters/src/types.js
[flow-issues]:https://github.com/devtools-html/debugger.html/labels/flow
[types-1]:https://github.com/devtools-html/debugger.html/pull/325
[types-2]:https://github.com/devtools-html/debugger.html/pull/222/files
[re-write]:https://medium.com/mozilla-tech/introducing-debugger-html-8629b943dcf6#.kwp9uxevn
