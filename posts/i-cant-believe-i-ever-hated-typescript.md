# I Can't Believe I Ever Hated React, Typescript & OOP!

## The Background
I've always dealt with JavaScript as "it is what it is" and brushed runtime errors as "it's the status quo, deal with it." Granted, it's only recently that I 
started making multi-component in-browser tooling. At first, I was bragging that most of the web tools I was making were in web-native technologies like HTML, CSS, and JS. I was boasting 
about the performance I was gaining from not having something else that sits on-top of JavaScript like React. I was used to managing state by hand; you can also say that I was
stockholm syndrome-ed into liking it. Considering that most of the applications I was making were Single Page Applications (SPAs), not using React was a sin. "I'm not compromising even
the slightest performance for a pesky framework" I thought. 


Wnat to know the cherry ontop? I had all the JavaScript the application needed in one file (because that's AI output), and I thought "it's easier to ask the 
AI to read this one big file instead of many small files." Oh boy!


## Well if it isn't the consequences of my actions...

It wasn't until recently that I started pulling my hair at all the runtime errors I was getting becuase even though the conceptual architecture of the application at an abstract level is solid,
the underlying code architecture is shaky at best, and completely unmaintainable at worst. For example, my chat application (which uses P2P networking) would have complicated execution paths 
that I made a tool [seestack.cc](https://seestack.cc) just to map the call stack to see what's going on. Jumping throughout the file from line 10 to line 12,000 was so insanely tedious that 
I wanted to gouge my eyes out. I was thinking "well, AI is doing the coding for me, but I can read & debug if necessary." True, but I couldn't imagine how annoying reading unorganized code 
would be like. Reading it wasn't the problem, understanding it wasn't the problem, but maintaining it so was! 


What's even worse is that my application has many nested JSONs, and I have no way to know how each is structured or looks like without backwards full-tracing or debuggers.


"So this is why everyone called AI code slop, huh..." I realized.


## Why didn't AI just...
It was around this time when I was very interested in Rust. At first, I hated the Result<T, E>. "I just want the data, give it to me!" What a foolish thought. No wonder why I had so many 
runtime bugs. I'm not sure what changed or when, but something clicked.


"Result<T, E> is actually guiding me to recover from errors" it definitely clicked. I instantly became a fan of the Rust way of handling the errors that I wished JavaScript had something similar. 


Ding, ding, ding, ding... and the answer is... TypeScript!


I immediately starting forming so many opinions on the AI-generated code. "OOP wouldn've been perfect here", "state machine would've worked better here", "this runtime error would've been completely mitigated by TypeScript." Shoulda, coulda, wouldla and a bunch of regreta! 


Oh god, I'm so ashamed of the code. This is my doing. I allowed the AI agent to do this.

## So... why React?

Believe it or not, I've tried to make web components to re-use code & logic throughout my application, but the mess of the shadow DOM really made it inconvenient. I wanted my web components to have default styles but be easily styled. I achieved it, but with pain... much much pain. I figured "it would've been easier if my logic and style was around the same place so that I'm not jumping around all the time" ding, ding, ding! React w/ Tailwind got you!

## Senior devs just know more programming languages

A foolish belief I once had when I was a younger developer.


It's not necessarily wrong, but it's not the entire picture. Senior devs have built/maintained monsterous proejcts and have full understanding of the challenges of maintaining a large codebases 
and what it takes to mitigate those challenges. This is when I realized that even-though I have been programming for more than 5 years, I'm still not even close to a senior dev, not by a long shot.


## What did we learn?
- Dynamic-typing cannot get you far unless you use extensive docs like ESDoc, or opt into a static type system.
- Developer experience matters way more than a slightly longer initial load time (with React), ESPECIALLY if it's an SPA.
- I'm not gaining anything by using JavaScript over TypeScript; in fact, it's a net loss.
- USE A FRAMEWORK!

Since most of my applications are data-intensive SPAs, I'll be taking some time to re-write them with React & TypeScript. Not using a framework has driven me to as far as I can get. Unfortunately, since the application size has gotten very big, re-writing, even with AI, isn't as easy without maxxing the context window. This is my doing, I dug my grave with an excavator, and now I have to dig myself out of it with a stone.
