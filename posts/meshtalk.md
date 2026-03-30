# Journey of making MeshTalk
## A decentralized, peer-to-peer, no-signup, PWA-enabled, local-persistence-enabled chatting application.  
  
### The rabbit-holes:

#### WASM & PWA:
Before I even started on this project, I was interested in what technologies the browser has to offer besides the basic JavaScript runtime, and layout engine, and I found the WebAssembly (WASM) runtime and Progressive Web Apps (PWAs)!

This was a whole rabbit-hole. At first WASM was promising becuase it enabled near-native performance, and support for systems languages like Rust and C/C++. I had also encountered a WASM application that I really liked, [Wavacity](https://wavacity.com/), which allowed users to work on audio files within the browser. So naturally, I continued digging! 

Turns out that there's a big short-coming with WASM. WASM can only act as a compute API for data that JavaScript passes into it. What does this mean? Well, your WASM application cannot talk to the network directly or access the file system. You call JavaScript APIs like `fetch()`, and pass the data it returns into the WASM compute layer, and the compute layer returns data to the JavaScript layer. So, WASM is great for compute heavy tasks, but not ideal for IO operations. This makes WASM great for image/video/audio processing serverlessly within the browser.

PWA turned out to be more of a suplemental addon than a full feature. PWA technology enables you to "install" the application locally instead of heading to the URL via browser. It still has the same limitation of a browser because it's essentially a detached browser window that looks less browser-y. Combining with Service Workers, the application becomes usable offline, but again, still the same limitation of normal website. I really liked the idea and wanted to use it, but this wasn't the core problem that I was dealing with.

#### WebRTC:

WebRTC was the savior. WebRTC enables peer-to-peer communication in browsers NATIVELY! This was the golden ticket to the application. I wanted to architect the specifics of how communication, failure tolerance, and recovery works in this application but utilize the help of Claude Sonnet 4.6 for coding.

### Architecture choices:

There are so many architecture patterns that I considered for this application, let's explore some, and why I didn't choose them:

#### **Star**: A central elected peer that all other peers connect to.

This was my first choice, it centralized all of the power to the central peer. This makes it a lot easier to implement federation features and moderation capabilities into the application. I actually implemented many features to fix some of the problems of this architecture; like failure tolerance and recovery. That made the system recover very quickly from situations where the central peer (heart of the star architecture) disconnects. Another issue presented itself later that I should've anticipated: the scaling problem.

Unfortunately because all messages flow through the central peer, for each message sent, the central peer would have to send n_peers messages. So, if there are 100 peers connected, the central peer would send 100 messages for each message. This put a hard cap on the applicaiton which I can't take lying down. Since the problem is inherit to the architecture, I decided to redo it.

#### **Tree**: A binary tree of peers with a root peer.

The tree architecture makes it so that each peer only sends about 3 messages max per message; to the parent, and to the two siblings. So, less compute? Yay! Well... There's a downside. The structure is rigid, so failure and recovery might take precious seconds that can be noticable to the end user. For example, if it takes the system about 3 seconds to recognize failure, and 1 second to recover, that's 4 seconds total of message not sending. In a real-time chatting application, that's a death blow.

#### **Distributed Clusters**: Each cluster is composed of up to 6 total nodes, 5 childrens max and 1 parent. Cluster coordinators connect together.

This architecture had the upside of 1 minimum and 6 connections max. I was thinking maybe I can extend this more and make it so that there's cluster leader, cluster coordinators, cluster members. up to 5 cluster members connect to 1 cluster coordinator, and each cluster coordinator connects to the cluster leader. This wasn't a bad idea but it needed refining because in a 200 node cluster, there would be almost 40 cluster coordinators talking to the same cluster leader, and we'd have the same bottle neck issue again. Better, but not perfect.

#### **Gossip**: Pick 5-7 peers randomly, and tell them the message. They receive the message and pass it on recursivly.

This architecture would scale no doubt. There is an issue with this however. One of them is easy to fix, the other is not so much.
1. Message loops: Peer A sends message to Peer B. Peer B sends it to Peer C. Peer C sends it to Peer A. 
That's a easy problem to solve. We can store the last 10 messages IDs and if we've seen the IDs before, we don't pass the message.

2. Non-zero delivery failure chance: It's possible that a peer can be unlucky to not be picked randomly to get the message. Even with 2 or 3 passes, it's possible that the peer won't receive it. This non-zero chance bothered me so much, that I couldn't go through with this architecture. It would be annoying to send a message to someone, and they won't respond because they didn't see the message. The unreliability of this architecture was a huge dealbreaker, even more so than the scalability issue. 

So what did I choose? Let's mix it up!

### Chosen architecture:

I choose to do a mix of star + distributed clusters + gossip. Let me explain!
