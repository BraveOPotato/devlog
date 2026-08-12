// ============================================================
//  blogLinks.js - Add your blog post raw GitHub URLs here
//  Format: {
//    url:   "raw_github_url",       // required
//    date:  "YYYY-MM-DD",           // required, drives ordering
//    tags:  ["tag1", "tag2"],       // optional, shown as the category eyebrow
//    cover: "posts/img/shot.png",   // optional, story-card artwork
//    alt:   "Describe the image",   // required when cover is set
//  }
//  The title & excerpt are auto-parsed from the Markdown file.
// ============================================================

var BLOG_LINKS = [
  {
    url: "https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/meshtalk.md",
    date: "2026-03-28",
    tags: ["Distributed Systems", "PWA", "WebRTC"],
    cover: "posts/img/p2p-star-arch.png",
    alt: "Diagram of MeshTalk's star peer-to-peer topology",
  },
  {
    url: "https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/flowboard.md",
    date: "2026-04-02",
    tags: ["Offline-first", "IndexedDB", "Service Workers"],
    cover: "posts/img/flowboard-board.png",
    alt: "The FlowBoard kanban board running in a browser",
  },
  {
    url: "https://raw.githubusercontent.com/BraveOPotato/devlog/refs/heads/main/posts/i-cant-believe-i-ever-hated-typescript.md",
    date: "2026-05-20",
    tags: ["Learned a Lesson", "TypeScript", "React", "SPA"],
  },
];
