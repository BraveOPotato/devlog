# I Can't Believe I Ever Hated Typescript & OOP!

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


"So this is why everyone called AI code slop, huh..." I realized.
