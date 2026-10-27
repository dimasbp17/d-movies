# D-Movies

A modern, cinematic movie & TV discovery app built with React, Vite and Tailwind CSS on top of the [TMDB API](https://developer.themoviedb.org/).

## Features

- **Cinematic home** — auto-playing trending hero with official title logos & trailers, Trending (today / this week), Now Playing, Popular, Top 10, Browse by Genre, Upcoming spotlight, Popular TV, Popular People, Top Rated Series.
- **Explore movies & TV** — category tabs (Popular, Now Playing, Top Rated, Upcoming / Airing Today, On The Air) plus Discover filters: multi-genre, sort, year, minimum rating, original language and keyword.
- **Rich detail pages** — trailer player, certification, key crew, cast, videos/backdrops/posters gallery with lightbox, reviews, where-to-watch providers (Indonesia, US fallback), budget/revenue/profit, production companies or networks, keywords, external links, recommendations & similar titles.
- **TV seasons & episodes** — latest / next episode, season browser, episode list with stills, ratings, director and guest stars.
- **People** — popular people, biographies, socials, photo gallery and a filterable filmography by department & media type.
- **Collections** — full sagas in chronological order with average score.
- **Search** — command-palette quick search (`Ctrl K` or `/`) across movies, TV and people, plus a full results page with per-type counts.
- **Watchlist** — save any movie or show; stored locally in the browser with filters and sorting.

## Getting started

```bash
cp .env.example .env   # fill in your TMDB credentials
npm install
npm run dev
```

| Variable          | Example                         |
| ----------------- | ------------------------------- |
| `VITE_BASEURL`    | `https://api.themoviedb.org/3`  |
| `VITE_BASEIMGURL` | `https://image.tmdb.org/t/p`    |
| `VITE_APIKEY`     | TMDB v3 API key                 |
| `VITE_TOKEN`      | TMDB v4 read token (used if no API key) |

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
