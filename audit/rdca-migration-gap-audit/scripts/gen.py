#!/usr/bin/env python3
"""Generate all RDCA migration gap audit deliverables."""
import json, csv, os, re, urllib.parse
from collections import Counter, defaultdict

AD = "/Users/clicksportsmedia/Developer/RDCA-V2/audit/rdca-migration-gap-audit"
SP = "/private/tmp/claude-501/-Users-clicksportsmedia-Developer-RDCA-V2/01a0ec8b-2d58-48c0-86cb-58c9b925f283/scratchpad/audit"
os.makedirs(AD, exist_ok=True)
os.makedirs(f"{AD}/SCREENSHOTS", exist_ok=True)

old = json.load(open(f"{SP}/old-pages.json"))
new = json.load(open(f"{SP}/new-pages.json"))
hon = json.load(open(f"{SP}/honours-pages.json"))
docs = json.load(open(f"{SP}/doc-manifest-raw.json"))
imgs = json.load(open(f"{SP}/old-image-manifest.json"))

O = {urllib.parse.urlparse(x["url"]).path or "/": x for x in old}
N = {urllib.parse.urlparse(x["url"]).path or "/": x for x in new if not urllib.parse.urlparse(x["url"]).query}

# old path -> (new path, status, confidence, note)
M = {
 "/":                            ("/index.html","CHANGED","high","Full redesign. Old home is a thin visual splash (858 chars); new is a richer 10,134-char landing page. Not a content regression, but nothing is a like-for-like carry-over."),
 "/about-umpires":               ("/about-umpires.html","PARTIAL","high","4,482 -> 3,082 chars. ~31% of body text not carried across."),
 "/about-veterans":              ("/veterans.html","COMPLETE","medium","824 -> 3,202 chars; new page is a superset. Verify tone/wording with client."),
 "/appointments":                ("/umpire-appointments.html","PARTIAL","high","Old page is a OneDrive Excel embed (1drv.ms) carrying the live appointments. New page renders MOCK data and the spreadsheet is not migrated or linked."),
 "/awards":                      ("/awards.html","PARTIAL","high","Old page embeds honours.rdca.com?ID=awards, the root of 117 award sub-pages. New /awards.html has 0 tables and no award records."),
 "/become-an-umpire":            ("/become-an-umpire.html","COMPLETE","high","2,394 -> 2,621 chars. Content present."),
 "/blog":                        ("/news.html","PARTIAL","high","13 old posts vs 3 news + 6 archive + 4 article records on the new site; the 13 originals are not reproduced."),
 "/calendar-of-events":          ("/events.html","PARTIAL","high","Old page embeds eventscalendar.co + POWR countdown plugins. New /events.html has 3 static events; the live calendar is not migrated."),
 "/child-safety":                ("/child-safety.html","COMPLETE","high","1,578 -> 2,552 chars. Superset."),
 "/copy-2-of-rep-team-girls":    ("/placeholder.html","MISSING","high","U17 Girls rep line-up. New site renders placeholder.html with src pointing BACK at this old URL."),
 "/copy-of-contacts-1":          ("/umpires.html","PARTIAL","high","Old Umpires page carries 6 YouTube instructional videos; none appear on the new site."),
 "/copy-of-documents":           ("/documents.html","PARTIAL","medium","Women's Documents (22 doc links). No dedicated women's documents route on the new site."),
 "/copy-of-info":                ("/documents.html","PARTIAL","medium","Policies index. Folded into /documents.html; several policies have no destination."),
 "/copy-of-life-members":        ("/honours.html","OBSOLETE-CANDIDATE","high","Title is literally 'Copy of Life Members OLD'. Embeds honours.rdca.com?ID=lifemember which returns an EMPTY 316-byte page. Recommend retire; confirm with client."),
 "/copy-of-policies":            ("/contact.html","PARTIAL","medium","Titled 'Contacts' despite the URL. Split across /contact.html and /committees.html."),
 "/copy-of-rep-team-girls":      ("/placeholder.html","MISSING","high","U14 Girls rep line-up. Deferred to old site via placeholder."),
 "/copy-of-rep-team-u12-boys":   ("/placeholder.html","MISSING","high","U13 Boys rep line-up. Deferred to old site via placeholder."),
 "/copy-of-rep-team-u16-girls":  (None,"MISSING","high","U18 Girls rep line-up. NOT referenced by any placeholder variant either - wholly absent from the new site."),
 "/girls-comp":                  ("/womens.html","PARTIAL","medium","Girls competition detail folded into /womens.html."),
 "/good-sports-policy":          (None,"MISSING","high","5,404 chars of Good Sports policy. No corresponding route on the new site."),
 "/hall-of-fame":                ("/hall-of-fame.html","PARTIAL","high","Old page carries 28 inductee images; new page has 0 tables and no inductee imagery."),
 "/honour-board":                ("/honour-board.html","PARTIAL","high","Old embeds honours.rdca.com?ID=honor: 6 tables / 204 rows of Board of Management history. New page shows a 12-row life-members table instead."),
 "/honours-life-members":        ("/honours.html","PARTIAL","high","Old table has 80 rows of life members; new site carries 11."),
 "/info":                        ("/documents.html","NEEDS-HUMAN-DECISION","low","Generic 757-char 'Info' page. Purpose unclear; client to confirm whether it retires."),
 "/junior-committee":            ("/committees.html","PARTIAL","high","Committee members + photos; new /committees.html is consolidated and drops per-committee imagery."),
 "/junior-rep-girls":            ("/placeholder.html","MISSING","high","U12 Girls rep line-up. Deferred to old site via placeholder."),
 "/junior-state-rep-players":    ("/rep-cricket.html","PARTIAL","medium","State rep players list folded into /rep-cricket.html."),
 "/juniors-all-abilities-comp":  ("/juniors.html","PARTIAL","medium","All Abilities competition detail folded into /juniors.html."),
 "/juniors-annual-reports":      (None,"MISSING","high","92 images / 180 links of junior annual reports. No annual-reports route exists on the new site."),
 "/juniors-code-of-conduct":     ("/documents.html","PARTIAL","high","3,768 chars of junior code of conduct. New site links a newly-authored 4.6KB substitute PDF, not this text."),
 "/juniors-documents":           ("/documents.html","PARTIAL","high","Junior documents index (72 imgs / 141 links). Documents still hot-linked to Wix."),
 "/juniors-under-12s":           ("/placeholder.html","MISSING","high","U12 Boys rep line-up. Deferred to old site via placeholder."),
 "/juniors-under-14s":           ("/placeholder.html","MISSING","high","U14 Boys rep line-up. Deferred to old site via placeholder."),
 "/juniors-under-16s":           ("/placeholder.html","MISSING","high","U16 Boys rep line-up. Deferred to old site via placeholder."),
 "/juniors-under-18s":           ("/placeholder.html","MISSING","high","U17 Boys rep line-up. Deferred to old site via placeholder."),
 "/mycricket-database":          ("/competition.html","PARTIAL","medium","MyCricket integration guidance; new site points at PlayHQ. Confirm MyCricket is genuinely retired."),
 "/photos":                      ("/photos.html","PARTIAL","medium","Old gallery index vs new curated albums; photo sets not verified as carried across."),
 "/premiers":                    (None,"MISSING","high","Embeds honours.rdca.com?ID=premiers, the root of 129 per-grade premiership record pages. Nothing equivalent on the new site; new premiers data is flagged sample:true with EMPTY club names."),
 "/privacy-policy":              (None,"MISSING","high","2,224-char privacy policy. No privacy route on the new site - a legal/compliance gap."),
 "/rdca-clubs":                  ("/clubs.html","PARTIAL","high","Old: 7,714 chars, 39 club images, 41 Google Maps embeds, club contacts. New: 2,247 chars, no maps, and clubs[] carries no email/contact/website for any of the 38 clubs."),
 "/records":                     ("/honours.html","MISSING","high","Association records. No equivalent records content on the new site."),
 "/rep-cricket-seniors":         ("/rep-cricket.html","PARTIAL","medium","Teams & information folded into /rep-cricket.html."),
 "/senior-committee":            ("/committees.html","PARTIAL","high","Committee members + 9 photos; consolidated without imagery."),
 "/seniors-all-abilities-comp":  ("/seniors.html","PARTIAL","medium","Folded into /seniors.html."),
 "/seniors-annual-reports":      (None,"MISSING","high","178 images / 352 links - the largest asset set on the old site. No annual-reports route exists."),
 "/seniors-code-of-conduct":     ("/documents.html","PARTIAL","high","2,385 chars. Superseded by a newly-authored substitute PDF."),
 "/seniors-documents":           ("/documents.html","PARTIAL","high","Seniors documents index (80 imgs / 157 links). Documents still hot-linked to Wix."),
 "/seniors-inter-association":   ("/rep-cricket.html","PARTIAL","medium","Inter-association detail folded into /rep-cricket.html."),
 "/seniors-under-21s":           ("/seniors.html","PARTIAL","medium","U21 competition detail folded into /seniors.html."),
 "/seniors-womens-comp":         ("/womens.html","PARTIAL","medium","Folded into /womens.html."),
 "/social-media-policy":         (None,"MISSING","high","4,993-char social media policy. No corresponding route - a governance gap."),
 "/sponsorship":                 ("/sponsors.html","PARTIAL","high","Old page is the single largest on the site (18,366 chars) with 28 sponsor images. New /sponsors.html is 5,268 chars - roughly 71% of the sponsorship prospectus text is absent."),
 "/suspended-players":           (None,"MISSING","high","Suspended players table. No equivalent on the new site - an operational/compliance gap."),
 "/tables-for-pages":            (None,"OBSOLETE-CANDIDATE","high","Internal Wix scratch/staging page (3 tables, 33 images, socialstream widget). Almost certainly not for migration - confirm."),
 "/training":                    ("/umpire-training.html","COMPLETE","medium","950 -> 1,915 chars. Superset."),
 "/umpires-committee":           ("/committees.html","PARTIAL","high","Committee + 11 photos consolidated without imagery."),
 "/umpires-documents":           ("/umpire-documents.html","PARTIAL","high","Documents still hot-linked to Wix."),
 "/umpires-life-members":        ("/honours.html","PARTIAL","high","Umpire life members (1,098 chars) not separately represented."),
 "/veterans-annual-reports":     (None,"MISSING","high","84 images / 164 links of veterans annual reports. No annual-reports route exists."),
 "/veterans-code-of-conduct":    ("/documents.html","PARTIAL","high","2,386 chars superseded by substitute PDF."),
 "/veterans-committee":          ("/committees.html","PARTIAL","medium","Consolidated."),
 "/veterans-documents":          ("/documents.html","PARTIAL","high","Documents still hot-linked to Wix."),
 "/womens-committee":            ("/committees.html","PARTIAL","high","Committee + 5 photos consolidated without imagery."),
}
for p in O:
    if p.startswith("/post/"):
        M[p] = ("/article.html","MISSING","high","Blog post. The new site carries 4 unrelated article records; none of the 13 original posts are reproduced.")

# ---------------- PAGE-GAP-MATRIX.csv ----------------
rows = []
for p in sorted(O):
    o = O[p]
    npath, status, conf, note = M.get(p, (None, "NEEDS-HUMAN-DECISION", "low", "Unmapped."))
    n = N.get(npath) if npath else None
    otr = sum(t["rows"] for t in o.get("tables", []))
    ntr = sum(t["rows"] for t in n.get("tables", [])) if n else 0
    rows.append({
        "old_url": o["url"], "old_title": o.get("title", ""), "old_http": o.get("status"),
        "old_text_chars": o.get("textLen", 0), "old_images": len(o.get("images", [])),
        "old_tables": len(o.get("tables", [])), "old_table_rows": otr,
        "old_iframes": len(o.get("iframes", [])), "old_links": len(o.get("links", [])),
        "new_url": ("https://rdca-sportsweb-version2.vercel.app" + npath) if npath else "",
        "new_http": n.get("status") if n else "", "new_text_chars": n.get("textLen", 0) if n else 0,
        "new_images": len(n.get("images", [])) if n else 0, "new_tables": len(n.get("tables", [])) if n else 0,
        "new_table_rows": ntr, "status": status, "match_confidence": conf,
        "text_delta_pct": (round((n.get("textLen", 0) - o.get("textLen", 1)) / max(o.get("textLen", 1), 1) * 100)) if n else -100,
        "evidence_screenshot": o.get("screenshot", ""), "notes": note,
    })
with open(f"{AD}/PAGE-GAP-MATRIX.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)

# ---------------- DOCUMENT-MANIFEST.csv ----------------
drows = []
for d in docs:
    real = "html" not in d["mime"]
    drows.append({
        "title": d["t"], "category": d["c"], "source_page": "new site /documents.html (site-data.js)",
        "original_url": d["u"], "canonical_url": d["u"].split("?")[0], "filename": d["filename"],
        "declared_type": d["ty"], "mime": d["mime"].split(";")[0], "bytes": d["bytes"],
        "sha256": d["sha256"], "http": d["http"],
        "is_real_file": "YES" if real else "NO - links to an HTML page, not a document",
        "host": d["u"].split("/")[2],
        "in_repository": "NO", "on_new_site": "LINKED ONLY (hot-linked to old host)",
        "wix_dependency": "YES" if "rdca.com" in d["u"] else "NO (third-party)",
        "status": "EXTERNAL-DEPENDENCY" if "rdca.com" in d["u"] else "EXTERNAL-DEPENDENCY (third-party)",
    })
with open(f"{AD}/DOCUMENT-MANIFEST.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(drows[0].keys())); w.writeheader(); w.writerows(drows)

# ---------------- ASSET-MANIFEST.csv ----------------
arows = []
for a in imgs:
    ok = a["http"] == "200" and a["bytes"] > 0
    arows.append({
        "canonical_key": a["canonical"], "original_url": a["url"],
        "source_pages": "; ".join(a["pages"][:6]) + (f" (+{len(a['pages'])-6})" if len(a["pages"]) > 6 else ""),
        "filename": os.path.basename(urllib.parse.urlparse(a["url"]).path),
        "mime": a["mime"].split(";")[0] if ok else "", "bytes": a["bytes"],
        "width": a["maxdim"][0], "height": a["maxdim"][1],
        "sha256": a["sha256"], "http": a["http"],
        "alt_text": "; ".join(a["alts"])[:160],
        "in_repository": "NO",
        "on_new_site": "NO",
        "high_quality_preserved": "NOT PRESERVED" if ok else "UNABLE TO VERIFY",
        "wix_dependency": "YES" if "wixstatic" in a["url"] or "rdca.com" in a["url"] else "NO",
        "status": "MISSING" if ok else "UNABLE-TO-VERIFY",
    })
with open(f"{AD}/ASSET-MANIFEST.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(arows[0].keys())); w.writeheader(); w.writerows(arows)

# ---------------- LINK-AUDIT.csv ----------------
lrows = []
seen = set()
for x in new:
    src = urllib.parse.urlparse(x["url"]).path
    for l in x.get("links", []):
        h = l["href"]
        if not h: continue
        host = urllib.parse.urlparse(h).netloc
        internal = "rdca-sportsweb-version2.vercel.app" in host
        k = (src, h)
        if k in seen: continue
        seen.add(k)
        if internal and "placeholder.html" in h and "src=" in h:
            cat, st = "internal->old-site placeholder", "BROKEN-DEPENDENCY"
        elif "www.rdca.com" in host:
            cat, st = "old-site dependency", "EXTERNAL-DEPENDENCY"
        elif internal:
            cat, st = "internal", "OK"
        elif h.startswith("mailto:"): cat, st = "email", "OK"
        elif h.startswith("tel:"): cat, st = "telephone", "OK"
        elif h == "#" or h.endswith("#"): cat, st = "placeholder anchor", "BROKEN"
        else: cat, st = "external", "OK"
        lrows.append({"source_page": src, "link_url": h[:300], "link_text": l["text"][:80],
                      "target": l.get("target", ""), "category": cat, "status": st})
with open(f"{AD}/LINK-AUDIT.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(lrows[0].keys())); w.writeheader(); w.writerows(lrows)

# ---------------- SEO-REDIRECT-MAP.csv ----------------
srows = []
for p in sorted(O):
    o = O[p]
    npath, status, conf, note = M.get(p, (None, "NEEDS-HUMAN-DECISION", "low", ""))
    dest = npath if npath else "(NO DESTINATION - decision required)"
    srows.append({
        "old_url": o["url"], "old_title": o.get("title", ""),
        "old_meta_description": (o.get("metaDescription") or "")[:180],
        "old_canonical": o.get("canonical") or "", "old_robots": o.get("robots") or "",
        "old_og_title": o.get("ogTitle") or "", "old_og_image": "YES" if o.get("ogImage") else "NO",
        "old_structured_data": "YES" if o.get("jsonld") else "NO",
        "matched_new_url": dest, "match_confidence": conf, "content_parity": status,
        "redirect_required": "YES" if npath else "YES - destination undecided",
        "proposed_redirect": f"301 {p} -> {npath}" if npath else f"301 {p} -> ??? (client decision)",
        "new_title": (N.get(npath, {}).get("title", "") if npath else ""),
        "new_meta_description": "MISSING", "new_canonical": "MISSING",
        "new_og": "MISSING", "new_structured_data": "MISSING",
        "new_indexable": "NO robots.txt / NO sitemap.xml on new site",
    })
with open(f"{AD}/SEO-REDIRECT-MAP.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(srows[0].keys())); w.writeheader(); w.writerows(srows)

# ---------------- MACHINE-READABLE-INVENTORY.json ----------------
sc = Counter(r["status"] for r in rows)
inv = {
    "generated": "2026-09-06", "audit_version": "1.0",
    "baselines": {
        "old_site": "https://www.rdca.com/",
        "new_site": "https://rdca-sportsweb-version2.vercel.app/",
        "repo_head": "0878f3149719424b7beff598b897d7d65627b127",
        "note": "Uncommitted working-tree SitePulse changes are EXCLUDED from all audit evidence.",
    },
    "totals": {
        "old_pages_discovered": len(O),
        "old_honours_subsystem_pages": len(hon),
        "old_pages_total_incl_honours": len(O) + len(hon),
        "new_base_routes": len(N),
        "new_urls_incl_query_variants": len(new),
        "old_text_chars": sum(x.get("textLen", 0) for x in old),
        "old_honours_text_chars": sum(h["chars"] for h in hon),
        "old_honours_table_rows": sum(h["rows"] for h in hon),
        "new_text_chars": sum(x.get("textLen", 0) for x in N.values()),
        "new_table_rows_total": sum(sum(t["rows"] for t in x.get("tables", [])) for x in N.values()),
        "documents_discovered": len(docs),
        "documents_migrated_into_repo": 0,
        "content_images_discovered": len(imgs),
        "content_images_migrated": 0,
        "crawl_errors_old": 0, "crawl_errors_new": 0, "crawl_errors_honours": 0,
    },
    "page_status_counts": dict(sc),
    "pages": rows,
}
json.dump(inv, open(f"{AD}/MACHINE-READABLE-INVENTORY.json", "w"), indent=1)

print("PAGE STATUS:", dict(sc))
print("rows:", len(rows), "docs:", len(drows), "assets:", len(arows), "links:", len(lrows), "seo:", len(srows))
print("old text:", sum(x.get('textLen',0) for x in old), "hon text:", sum(h['chars'] for h in hon))
print("new text:", sum(x.get('textLen',0) for x in N.values()))
print("hon rows:", sum(h['rows'] for h in hon), "new rows:", sum(sum(t['rows'] for t in x.get('tables',[])) for x in N.values()))
