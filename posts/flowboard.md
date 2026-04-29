# Making the best Kanban tool!
## An offline-first, no-signup, PWA-enabled, local-persistence-enabled Kanban that lives in your browser.  

Currently live at https://flowboard.cc.

### Why?

I really like Kanbans; they keep me oraganized. The thing I didn't like is that Kanbans are considered professional/productivity tool which comes with a premium. That premium makes it difficult to find a good tool that is good + free. If I'm going to make my own tool, I need it to not cost me anything to host. So, I have to pick the right combination of microservices.

Since I was learning about PWAs, Service Workers, and IndexedDB I figured that it's possible that a Kanban can be offline (even though the browser serves it), and have it be installed and running via browser.

### Why specifically these technologies:

#### Web Native Technologies
I prioritized speed in this project, and no frontend framework is faster than raw JavaScript (not even Yew, but don't quote me on that).

#### IndexedDB
A browser database. The API makes you want to gouge your eyes out, but it's better than using raw LocalStorage. 

#### PWA
Leveraging PWAs means that I don't have to bundle a Chromium runtime with the application (since I'm using the user's browser as a runtime), meaning that installing it is near instantaneous for the end user. This opens the door to mobile & desktop distribution.

#### Service Workers
Service Workers let you control what the web app caches. For an offline-first application, this means that the logic for presenting the application for the end-user and the interactivity are saved so that the user can quickly resume their work.

### Conflict-free Replicated Data Type (CRDT):
A special type of data that allows for real-time collaboration & easy merges. This data type is very facinating. The way I'm implementing this is instead of having the user upload the board state each time, they upload the operations they made on the board along with timestamps. Whenever the user reconnects to the server, the operations they made are uploaded to the server, and the operations they missed are sent to them. That way each client can reconstruct the board from the chain of operations made on the board. Kind-of like a block-chain.

#### Cloudflare (not sponsored I promise!)
Cloudflare KV was an easy pick. Cloudflare had all the necessary tools I could've asked for to make this project at the cost of $0.

- Serverless functions (Cloudflare Workers): Deploying it will be as easy as dragging and dropping the index.js file.
- Static hosting (Cloudflare Pages): Deploying the frontend is also as easy as dragging and dropping a ZIP file.
- Cloudflare Domains: Instead of having to buy a domain and configure it with GoDaddy, I can easily use Cloudflare's Domains (which are very very cheap), and configure the Cloudflare Pages to use them with few easy clicks.

Cloudflare's edge delivery network makes it blazingly fast at delivering the board data to the end-user.

### The result:
* No sign-up required
* Extremely fast
* In-browser
* Installable
* Offline-capable
* Collaboration-capable

and most importantly... Zero hosting cost!

### Ladies & gentlemen, quiet please!
Now that this very convenient application was made, end users must be flocking to use it... right? Well...

I'm currently showing it off to users so that they're aware of the product and hopefully will use it. Reddit's moderation is my enemy currenlty, they take down every post I make about the application, even though I legitmately gain nothing from it. Remember, no sign-ups, in-browser, open-source. I just wanted to spread the spirit of open-source software to the fine people.

#### Update (April 8th, 2026):
People seem to use this application daily. So far, it's been almost two weeks since the release and there has been a steady flow of people using flowboard.
proof:

<p align="center">
  <img src="https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/img/flowboard-04-07-26.png" alt="FlowBoard-statistics"/>
</p>

The cool part here is that becuase `Service Workers` cache almost every request, the load on the server is practically none (except when syncing boards).

#### Update (April 16th, 2026):
I've reached a point where the total requests for the webpage are 20x less than the requests for the serverless function. **What does this mean?** My optimization is working flawlessly! The users who want to use the application have cached the entire application, offloading repetitive requests to the server, and focusing on more important syncing tasks. 

<p align="center">
  <img src="https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/img/flowboard-04-16-26.png" alt="FlowBoard-statistics-04-16-26"/>
</p>
