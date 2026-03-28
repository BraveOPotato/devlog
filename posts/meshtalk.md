# Journey of making MeshTalk
## A decentralized, peer-to-peer, no-signup, PWA-enabled, local-persistence-enabled chatting application.  
---
  
### The rabbit-holes:

#### WASM & PWA:
Before I even started on this project, I was interested in what technologies the browser has to offer besides the basic JavaScript runtime, and layout engine, and I found the WebAssembly (WASM) runtime and Progressive Web Apps (PWAs)!

This was a whole rabbit-hole. At first WASM was promising becuase it enabled near-native performance, and support for systems languages like Rust and C/C++. I had also encountered a WASM application that I really liked, [Wavacity](https://wavacity.com/), which allowed users to work on audio files within the browser. So naturally, I continued digging! 

Turns out that there's a big short-coming with WASM. WASM can only act as a compute API for data that JavaScript passes into it. What does this mean? Well, your WASM application cannot talk to the network directly or access the file system. You call JavaScript APIs like `fetch()`, and pass the data it returns into the WASM compute layer, and the compute layer returns data to the JavaScript layer. So, WASM is great for compute heavy tasks, but not ideal for IO operations. This makes WASM great for image/video/audio processing serverlessly within the browser.

PWA turned out to be more of a suplemental addon than a full feature. PWA technology enables you to "install" the application locally instead of heading to the URL via browser. It still has the same limitation of a browser because it's essentially a detached browser window that looks less browser-y. Combining with Service Workers, the application becomes usable offline, but again, still the same limitation of normal website. I really liked the idea and wanted to use it, but this wasn't the core problem that I was dealing with.

#### WebRTC:

WebRTC was the savior. WebRTC enables peer-to-peer communication in browsers NATIVELY! This was the golden ticket to the application. I wanted to architect the specifics of how communication, failure tolerance, and recovery works in this application but utilize the help of Claude Sonnet 4.6 for coding.
