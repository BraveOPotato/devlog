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

<p align="center">
  <img src="https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/img/p2p-star-arch.png" alt="Star-architecture"/>
</p>

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

### Chosen architecture: Snowflake + backup!

I'm calling this architecture **Snowflake** (even though it's basically a sophisticated tree). What is it? it's mix of star + distributed clusters. To make it extra redundant, I'll add a fallback/backup node. Let me explain!

Here's the spec for the architecture:
- Each node can have up to n children (7 in my case).
- Each node can have up to 1 primary parent.

In addition to that, I'm adding the following for redundancy:
- Each node can have up to m random backup nodes (1 in my case).
 
This way there's always a way for traffic to flow, and it'll be mostly optimized. This architecture does need supplemental code for failure and recovery handling. So, let's dig into that!

Here's the pros of this architecture:
- **Fair & Scalable:** Each node will only be connected to the max of n nodes, therefore limiting CPU usage & distributing load semi-equally throughout the cluster. This alone will make it scale since no one node is doing all the heavy lifting.
- **Reliable:** As opposed to gossip, this will reliably deliver messages to all nodes, in the cluster.
- **Low Latency:** As opposed to binary trees, having up to 7 children will decrease the number of layers (or hops) needed to deliver messages therefore decreasing latency. For example, in my architecture, 100,000 nodes will only need 6 layers. Binary tree would need 16 layers.

<p align="center">
  <img src="https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/img/p2p-snowflake-arch.png" alt="Snowflake-architecture"/>
</p>

### Failure detection & recovery:

Each node is given a list of all the nodes in the cluster.

Each node is given the ID of the grandparent in case the parent suddenly disconnects.

Heartbeat pings will happen every second, and after 3 second of no response from the upstream, the upstream is considered offline.

Each parent of children will tell the immediate children which one will be the successor incase the parent suddenly disconnects.

When the parent suddenly disconnects, the successor child will absorb its siblings as children of his own, and connect into the grandparent. 
NOTE: If this child had any children of its own, it will also have told the children which will be the successor, and the successor will absorb the 
siblings and connect to it.

If both the parent and grandparent both disconnect at the same time, advanced recovery procedure will begin. 
- When check the list of all the nodes in the cluster, and iteratively check each node.
- If a node is alive, ask how many decendants it has connected to its mesh.
    * If the current mesh has more, it'll provide a the mesh topology to the peer's root (so that the target root can connect to our mesh).
    * If the target mesh has more, we'll be provided a topology of the target mesh, and the root of the current mesh will find the most
    appropriate node to connect to.

Periodically, Web Worker will check all the nodes in the cluster to see if there's split brain situation in the cluster, and either absorb them or have
them absorb us according to the previously discussed recovery procedure.

Due to this setup, a cycle might occur where messages keep passing around, so we need to keep track of the IDs we've already seen. Also, any child node that sends a message,
have it be grayed out until a confirmation is received from a parent that it received the message. This way the user will be informed from the UI whether their message
was actually received by the cluster or not.

### Types of nodes:

1. Root node: The root is the center of the entire structure. Only sends messages down. 
2. Leaf node: The outer-most edges of the structure. Only send messages up.
3. Peer node: Between the root and the leaf. Bi-directional message passing.

### Voice/video chat

For the voice/video chat feature, a special caveat had to be introduced that rearranges the cluster when someone joins/leaves the voice/video chat. Why? Well, because if voice data flows through the entire cluster, there would be too much unnecessary "noise" in the cluster flowing through nodes which don't need to receive the data stream. In addition to that, latency would increase to nodes which want to receive the data stream. So what is the voice/video chat ruleset?
- If a node labeled itself as a voice chat node for a specific channel, only other voice chat nodes for the same specific channel can attach as children.
- If you're about to join a voice call and you have children, check see if any of your children are not voice chat nodes. Then:
  - If you have non-voice chat nodes (or of a different channel) as children, assign one of them as the new parent, and tell all the other (non-voice children  chat nodes or voice chat nodes of a different channel) to connect to the new parent. After which, you (and your children in the same VC channel) will connect to the parent you just assigned.
  - If all your children are of the same channel, stay stay the way you are.
- Use the same optimized joining logic for voice chat sub cluster (closer to the root voice chat node, the better with the max of 7 immediate children per node).
- Send voice chat data to children, and upstream (only if the upstream is a voice chat node for that specific channel).

**NOTE:** there are so many edge cases to the rules above, handling them will be a pain for anyone who tries to replicate this architecture which is why I might make a library that facilitates this cluster/sub-cluster setup.

This new ruleset makes voice chats very optimized since audio/video streams only flow through nodes that need it. The architecture is the important part, adding audio/video/screen-share capabilities is as simple as tacking on a data stream.

