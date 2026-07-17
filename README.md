# The Parallel Shelf 📚

A tiny walkable 3D bookshop that runs in your browser. Wander the aisles, pull real books off the shelves, and read them free (Project Gutenberg) or buy a copy — every book is a doorway.

**▶ Play it: https://stackaible.github.io/parallel-shelf/**

## What's inside

- **~3,900 pullable books** across six signed sections — Classics, Adventure, Sci-Fi & Fantasy, Mystery & Gothic, Big Ideas, and a Kids' Nook. Aim at a spine, it glows; click, and it slides off the shelf into your hand with a generated cover and a card linking to the full text on [Project Gutenberg](https://www.gutenberg.org) or a copy to buy.
- **Favorites** — tap the ♡ on any book (or press `F`) to save it. Your list persists between visits, and every saved book has a "→ shelf" button that walks you back to its section.
- **Cozy corners** — a reading nook with armchairs and a sleeping shop cat named Miso (click her), a window bench at dusk, bean bags in the kids' corner, and an author-event stage with podium, chairs, and coffee cart.
- **Sound** — door chime, page-flick when you pull a book, soft footsteps, a purring cat, and a quiet room tone. All synthesized in WebAudio; nothing loaded. Toggle with the ♪ button.
- **Touch support** — on phones and tablets: left thumb walks, right thumb looks, tap a book to pull it.

## Controls

| Input | Action |
|---|---|
| `W A S D` / arrows | walk |
| mouse | look (click once to grab the pointer) |
| click | pull a book / put it back |
| `F` | save the held book to favorites |
| `Esc` | put the book back, close panels, free the mouse |
| `Shift` | hurry (please don't) |

## Running locally

No build step, no dependencies — [three.js](https://threejs.org) r160 is vendored in the repo.

```sh
python3 -m http.server 8471
# open http://localhost:8471
```

## Tech notes

- Single ES module (`main.js`) + one HTML file. Everything — wood, rugs, signs, book covers — is drawn to canvas textures at runtime; there are no image assets.
- Books are `InstancedMesh`es (one per bookcase) with per-instance colors; pulling a book hides its instance and animates a real mesh with a generated cover into your hand.
- Favorites live in `localStorage` under `parallel-shelf-favorites`.
