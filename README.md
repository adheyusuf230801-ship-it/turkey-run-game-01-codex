[![make.fun bounty](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/adheyusuf230801-ship-it/turkey-run-game-01-codex/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard)
[![reward](https://make.fun/badge/turkey-run-game-01/adheyusuf230801-ship-it/turkey-run-game-01-codex/reward.svg)](https://make.fun/bounty/turkey-run-game-01)

# Feather Fugitive

A turkey escapes Thanksgiving dinner, chased by the farmer while dodging ovens and carving knives. Survive three stages and reach the Freedom Gate at 1200m.

## How to play

- **Enter:** start.
- **Space / Up / W or click:** jump; jump again in the air for a double jump.
- **Down / S:** duck.
- **P:** pause.
- **M:** mute.
- **R:** restart.

## Run locally

Use Node 22 with built-in TypeScript type stripping (22.18 or newer). No dependencies or build step are needed.

```sh
node serve.ts
```

Open http://localhost:8080 to play. Set `PORT` to use another port.

To produce the hand-in output, including the game, screenshots, and dossier:

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The screenshot renders must be present in `screenshots/` before building. `shots.json` defines the four deterministic views to capture. Without `MAKEFUN_OUTPUT_DIR`, output goes to `/output`.

## File layout

- `game/index.html` — playable browser entry point.
- `game/src/` — game logic, rendering, input, audio, and deterministic shot views.
- `screenshots/` — captured game renders for the hand-in.
- `shots.json` — screenshot names and query strings.
- `main.ts` — copies hand-in assets and generates `dossier.json`.
- `serve.ts` — local static server for `game/`.
- `vendor/makefun-game.ts` — provided dossier builder.
- `.makefun/owner.json` — owner wallet metadata.
- `LICENSE` — MIT license text.

## License

MIT. Copyright (c) 2026 adhe-yusuf. See [LICENSE](LICENSE).
