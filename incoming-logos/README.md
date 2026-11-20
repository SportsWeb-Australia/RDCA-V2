# Incoming club logos — drop new logos here

This is the **staging folder** for refreshing club logos. The rule (Carson's):
the **new** logos go everywhere on the site, and the **original** logos we were
using stay **only on the T20 Big Bash page**.

That split is already wired up:

- The current logos were snapshotted to `logos/t20/<key>.webp` — these are the
  **T20 originals** and the T20 page reads them via each club's `logoT20` field.
- `clubs[].logo` (`logos/<key>.*`) is the **main** logo used **everywhere else**.
  Replacing it is all you need to do to roll out a new logo.

## How to add new logos

1. Name each file by the club's **key** (left column below), any format:
   `ainsliepark.png`, `bayswater.webp`, `standrews.svg`, `kilsyth.jpg` …
   (A transparent PNG or SVG is best.)
2. Drop the files in this folder.
3. Preview what will change (no files touched):
   ```bash
   node scripts/install-club-logos.mjs
   ```
4. Apply it:
   ```bash
   node scripts/install-club-logos.mjs --apply
   ```
   The script installs each logo as the club's main logo, updates
   `clubs[].logo` if the file extension changed, and **never touches the T20
   originals** in `logos/t20/`.
5. Bump the service-worker cache (`sw.js`: `rdca-vNN` → `rdca-v(N+1)`) and commit.

To change a **T20** logo too, replace the file in `logos/t20/<key>.webp`.

## Club keys

| key | club |
| --- | --- |
| `ainsliepark` | Ainslie Park CC |
| `bayswater` | Bayswater CC |
| `boronia` | Boronia CC |
| `chirnsidepark` | Chirnside Park CC |
| `coldstream` | Coldstream CC |
| `croydonnorth` | Croydon North CC |
| `croydonranges` | Croydon Ranges CC |
| `eastringwood` | East Ringwood CC |
| `eastfield` | Eastfield CC |
| `healesville` | Healesville CC |
| `heatherdale` | Heatherdale CC |
| `heathwood` | Heathwood CC |
| `hoddlescreek` | Hoddles Creek CC |
| `kilsyth` | Kilsyth CC |
| `lilydale` | Lilydale CC |
| `lusatiapark` | Lusatia Park CC |
| `montrose` | Montrose CC |
| `mooroolbark` | Mooroolbark CC |
| `mtevelyn` | Mt Evelyn CC |
| `northringwood` | North Ringwood CC |
| `norwood` | Norwood CC |
| `powelltown` | Powelltown CC |
| `seville` | Seville CC |
| `southcroydon` | South Croydon CC |
| `southwarrandyte` | South Warrandyte CC |
| `standrews` | St Andrews CC |
| `templeton` | Templeton CC |
| `vermont` | Vermont CC |
| `wandin` | Wandin CC |
| `wantirna` | Wantirna CC |
| `wantirnasouth` | Wantirna South CC |
| `warrandyte` | Warrandyte CC |
| `warranwood` | Warranwood CC |
| `wongapark` | Wonga Park CC |
| `yarraglen` | Yarra Glen CC |
| `yarrajunction` | Yarra Junction CC |

> Not sure of a key? Run `node scripts/install-club-logos.mjs` — it lists every
> incoming file it could and couldn't match, plus any clubs still missing a logo.
