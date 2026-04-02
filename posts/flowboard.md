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
Leveraging PWAs means that I don't have to bundle a Chromium runtime with the application, meaning that installing it is near instantaneous for the end user. This opens the door to mobile & desktop distribution.

#### Service Workers
Service Workers let you control what the web app caches. For an offline-first application, this means that the logic for presenting the application for the end-user and the interactivity are saved so that the user can quickly resume their work.

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

I hate to end it on a not so great note, but we're currently at this stage. I highly encourage you all to give it a try!
