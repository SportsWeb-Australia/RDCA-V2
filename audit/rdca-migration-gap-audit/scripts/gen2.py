#!/usr/bin/env python3
"""Phase 2: honours classification, 322-page reconciliation, perceptual image matching,
PDF semantic comparison, error taxonomy. Reuses all existing crawl data. No network."""
import json, csv, os, re, glob, hashlib, subprocess, zipfile, html
from collections import Counter, defaultdict
from PIL import Image

AD  = "/Users/clicksportsmedia/Developer/RDCA-V2/audit/rdca-migration-gap-audit"
SP  = "/private/tmp/claude-501/-Users-clicksportsmedia-Developer-RDCA-V2/01a0ec8b-2d58-48c0-86cb-58c9b925f283/scratchpad/audit"
BASE= "/private/tmp/claude-501/-Users-clicksportsmedia-Developer-RDCA-V2/01a0ec8b-2d58-48c0-86cb-58c9b925f283/scratchpad/baseline-HEAD"
ARC = "/Users/clicksportsmedia/Developer/RDCA-migration-archive"
S   = {}

# ---------------------------------------------------------------- TASK 1: honours
hon   = json.load(open(f"{SP}/honours-pages.json"))
hlink = json.load(open(f"{SP}/honours-links.json"))
label = {}
for pid, pairs in hlink.items():
    for h, t in pairs:
        label.setdefault("https://honours.rdca.com/" + h.lstrip("/"), t)

def kind(u):
    if "ID=premiers" in u and "grade=" in u: return "Premiership record (by grade)"
    if "ID=averages" in u:                   return "Batting/bowling averages (by grade)"
    if "ID=awards" in u and "club=" in u:    return "Club award history"
    if "ID=bestfairest" in u:                return "Best & Fairest medals"
    if "ID=allrounder" in u:                 return "All-Rounder trophies"
    if "ID=snrcc" in u:                      return "Club Championship"
    if "ID=bac" in u:                        return "Best Administered Club"
    if "ID=other" in u:                      return "Other awards"
    if "ID=honor" in u:                      return "Board of Management history"
    if "ID=lifemember" in u:                 return "Life members"
    if "ID=premiers" in u:                   return "Premierships (index)"
    if "ID=awards" in u:                     return "Awards (index)"
    return "Honours record (other)"

hrows = []
for h in hon:
    u = h["url"]
    empty = h["chars"] <= 40
    hrows.append({
        "old_url": u, "record_type": kind(u), "label": label.get(u, ""),
        "http": h["http"], "bytes": h["bytes"], "text_chars": h["chars"],
        "tables": h["tables"], "table_rows": h["rows"],
        "new_url": "", "new_equivalent": "NONE",
        "status": "BROKEN" if empty else "MISSING",
        "match_confidence": "high",
        "notes": ("Source page returns effectively empty content - already decaying."
                  if empty else
                  "No equivalent on the new site. New site carries 42 table rows in total across all pages."),
    })
with open(f"{AD}/HONOURS-GAP-MATRIX.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(hrows[0].keys())); w.writeheader(); w.writerows(hrows)
S["honours_rows"]   = len(hrows)
S["honours_status"] = dict(Counter(r["status"] for r in hrows))
S["honours_types"]  = dict(Counter(r["record_type"] for r in hrows))
S["honours_chars"]  = sum(h["chars"] for h in hon)
S["honours_tblrows"]= sum(h["rows"] for h in hon)

# ---------------------------------------------------------------- TASK 4: perceptual hashing
def dhash(p, s=8):
    try:
        im = Image.open(p).convert("L").resize((s + 1, s), Image.LANCZOS)
        px = list(im.getdata())
        bits = 0
        for r in range(s):
            for c in range(s):
                bits = (bits << 1) | (1 if px[r*(s+1)+c] > px[r*(s+1)+c+1] else 0)
        return bits
    except Exception:
        return None

def ahash(p, s=8):
    try:
        im = Image.open(p).convert("L").resize((s, s), Image.LANCZOS)
        px = list(im.getdata()); avg = sum(px)/len(px)
        b = 0
        for v in px: b = (b << 1) | (1 if v > avg else 0)
        return b
    except Exception:
        return None

ham = lambda a, b: bin(a ^ b).count("1")

# repo assets at clean HEAD
repo = []
for p in glob.glob(BASE + "/**/*", recursive=True):
    if os.path.isfile(p) and os.path.splitext(p)[1].lower() in (".webp",".png",".jpg",".jpeg",".gif",".ico"):
        repo.append({"path": os.path.relpath(p, BASE),
                     "sha256": hashlib.sha256(open(p,"rb").read()).hexdigest(),
                     "d": dhash(p), "a": ahash(p)})
reposha = {r["sha256"]: r["path"] for r in repo}
S["repo_images"] = len(repo)
S["repo_images_hashed"] = sum(1 for r in repo if r["d"] is not None)

old = json.load(open(f"{SP}/old-image-manifest.json"))
irows = []
for x in old:
    local = os.path.join(ARC, "images", os.path.basename(x["local"]))
    dh = dhash(local) if os.path.exists(local) else None
    ah = ahash(local) if os.path.exists(local) else None
    exact = reposha.get(x["sha256"]) if x["sha256"] else None
    best, bestd = None, 99
    if dh is not None:
        for r in repo:
            if r["d"] is None: continue
            dd = ham(dh, r["d"])
            if dd < bestd: bestd, best = dd, r
    if exact:
        st, conf, match = "EXACT-MATCH", "byte-identical (SHA-256)", exact
    elif dh is None:
        st, conf, match = "UNRESOLVED", "image could not be decoded or was not retrieved", ""
    elif bestd <= 6:
        st, conf, match = "LIKELY-VISUAL-MATCH", f"dHash distance {bestd}/64 (strong)", best["path"]
    elif bestd <= 12:
        st, conf, match = "LIKELY-VISUAL-MATCH", f"dHash distance {bestd}/64 (moderate - needs human confirm)", best["path"]
    else:
        st, conf, match = "VERIFIED-MISSING", f"no repo image within dHash 12 (nearest {bestd}/64)", ""
    irows.append({
        "canonical_key": x["canonical"], "original_url": x["url"],
        "source_pages": "; ".join(x["pages"][:5]) + (f" (+{len(x['pages'])-5})" if len(x["pages"])>5 else ""),
        "filename": os.path.basename(x["url"].split("?")[0]),
        "bytes": x["bytes"], "width": x["maxdim"][0], "height": x["maxdim"][1],
        "sha256": x["sha256"], "http": x["http"], "alt_text": "; ".join(x["alts"])[:140],
        "dhash": format(dh, "016x") if dh is not None else "",
        "ahash": format(ah, "016x") if ah is not None else "",
        "nearest_repo_file": match, "nearest_dhash_distance": bestd if dh is not None else "",
        "match_basis": conf, "status": st,
        "wix_dependency": "YES" if ("wixstatic" in x["url"] or "rdca.com" in x["url"]) else "NO",
    })
with open(f"{AD}/IMAGE-MATCH-REPORT.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(irows[0].keys())); w.writeheader(); w.writerows(irows)
S["image_status"] = dict(Counter(r["status"] for r in irows))
S["image_total"]  = len(irows)

# ---------------------------------------------------------------- TASK 5: PDF semantics
def text_of(p):
    e = os.path.splitext(p)[1].lower()
    try:
        if e == ".pdf":
            return subprocess.run(["pdftotext", p, "-"], capture_output=True, text=True, timeout=90).stdout
        if e == ".docx":
            with zipfile.ZipFile(p) as z:
                x = z.read("word/document.xml").decode("utf8", "replace")
            return re.sub(r"<[^>]+>", " ", x)
        raw = open(p, "rb").read().decode("utf8", "replace")
        if "<html" in raw.lower(): return re.sub(r"<[^>]+>", " ", raw)
        return raw
    except Exception:
        return ""

norm = lambda s: re.sub(r"[^a-z0-9 ]", " ", html.unescape(s or "").lower())
def toks(s):
    return [w for w in norm(s).split() if len(w) > 3]
def cos(a, b):
    A, B = Counter(a), Counter(b)
    if not A or not B: return 0.0
    inter = set(A) & set(B)
    num = sum(A[w]*B[w] for w in inter)
    den = (sum(v*v for v in A.values())**.5) * (sum(v*v for v in B.values())**.5)
    return num/den if den else 0.0

docs = json.load(open(f"{SP}/doc-manifest-raw.json"))
oldtxt = []
for d in docs:
    p = os.path.join(ARC, "documents", os.path.basename(d["local"]))
    oldtxt.append((d, toks(text_of(p)) if os.path.exists(p) else []))

pdfrows = []
for rp in ["docs/RDCA-Code-of-Conduct.pdf", "docs/RDCA-Junior-Documents-README.pdf"]:
    fp = os.path.join(BASE, rp)
    rt = toks(text_of(fp))
    scored = sorted(((cos(rt, ot), d) for d, ot in oldtxt), key=lambda z: -z[0])
    for sim, d in scored[:5]:
        pdfrows.append({"repo_pdf": rp, "repo_pdf_bytes": os.path.getsize(fp), "repo_pdf_words": len(rt),
                        "old_document": d["t"], "old_url": d["u"], "old_bytes": d["bytes"],
                        "cosine_similarity": round(sim, 4)})
    S.setdefault("pdf", {})[rp] = {"words": len(rt), "top_sim": round(scored[0][0], 4),
                                   "top_match": scored[0][1]["t"], "top_bytes": scored[0][1]["bytes"]}
with open(f"{AD}/PDF-SEMANTIC-COMPARISON.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(pdfrows[0].keys())); w.writeheader(); w.writerows(pdfrows)

# ---------------------------------------------------------------- TASK 2: reconcile 322
pg = list(csv.DictReader(open(f"{AD}/PAGE-GAP-MATRIX.csv")))
S["www_rows"] = len(pg)
S["www_status"] = dict(Counter(r["status"] for r in pg))
comb = Counter(S["www_status"]); comb.update(S["honours_status"])
S["combined_status"] = dict(comb)
S["combined_total"] = sum(comb.values())

inv = json.load(open(f"{AD}/MACHINE-READABLE-INVENTORY.json"))
inv["audit_version"] = "2.0"
inv["totals"].update({
    "old_pages_www": len(pg),
    "old_pages_honours": len(hrows),
    "old_pages_total": len(pg) + len(hrows),
    "content_images_discovered": S["image_total"],
    "content_images_exact_match": S["image_status"].get("EXACT-MATCH", 0),
    "content_images_likely_match": S["image_status"].get("LIKELY-VISUAL-MATCH", 0),
    "content_images_verified_missing": S["image_status"].get("VERIFIED-MISSING", 0),
    "content_images_unresolved": S["image_status"].get("UNRESOLVED", 0),
})
inv["totals"].pop("old_pages_discovered", None)
inv["totals"].pop("old_pages_total_incl_honours", None)
inv["totals"].pop("old_honours_subsystem_pages", None)
inv["totals"].pop("content_images_migrated", None)
inv["page_status_counts_www"] = S["www_status"]
inv["page_status_counts_honours"] = S["honours_status"]
inv["page_status_counts_combined"] = S["combined_status"]
inv.pop("page_status_counts", None)
inv["honours_pages"] = hrows
inv["image_match_summary"] = S["image_status"]
inv["pdf_semantic_summary"] = S["pdf"]
json.dump(inv, open(f"{AD}/MACHINE-READABLE-INVENTORY.json", "w"), indent=1)

json.dump(S, open(f"{SP}/phase2-summary.json", "w"), indent=1)
print(json.dumps(S, indent=1))
