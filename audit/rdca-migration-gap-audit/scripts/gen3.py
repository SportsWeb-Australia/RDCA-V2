#!/usr/bin/env python3
"""Phase 2b: refine image classification (sha256 + filename + perceptual), build error taxonomy,
finalise 322-page inventory. Reuses downloaded files only. No network."""
import json, csv, os, re, glob, hashlib
from collections import Counter
from PIL import Image

AD  = "/Users/clicksportsmedia/Developer/RDCA-V2/audit/rdca-migration-gap-audit"
SP  = "/private/tmp/claude-501/-Users-clicksportsmedia-Developer-RDCA-V2/01a0ec8b-2d58-48c0-86cb-58c9b925f283/scratchpad/audit"
BASE= "/private/tmp/claude-501/-Users-clicksportsmedia-Developer-RDCA-V2/01a0ec8b-2d58-48c0-86cb-58c9b925f283/scratchpad/baseline-HEAD"
ARC = "/Users/clicksportsmedia/Developer/RDCA-migration-archive"

def dhash(p, s=8):
    try:
        im = Image.open(p)
        if im.mode in ("RGBA","LA","P"):            # flatten transparency onto white
            im = im.convert("RGBA")
            bg = Image.new("RGBA", im.size, (255,255,255,255))
            im = Image.alpha_composite(bg, im)
        im = im.convert("L").resize((s+1, s), Image.LANCZOS)
        px = list(im.getdata()); b = 0
        for r in range(s):
            for c in range(s):
                b = (b<<1) | (1 if px[r*(s+1)+c] > px[r*(s+1)+c+1] else 0)
        return b
    except Exception:
        return None
ham = lambda a,b: bin(a^b).count("1")

def nkey(s):
    s = re.sub(r'\.(png|jpe?g|webp|gif|ico|avif)$', '', s or '', flags=re.I)
    s = re.sub(r'(%20|edited|FullColour|FullColor|logo|RDCA|NEW|20\d\d|CC|Cricket|Club|United)', ' ', s, flags=re.I)
    return re.sub(r'[^a-z]', '', s.lower())

# repo images at clean HEAD
repo = []
for p in glob.glob(BASE + "/**/*", recursive=True):
    if os.path.isfile(p) and os.path.splitext(p)[1].lower() in (".webp",".png",".jpg",".jpeg",".gif",".ico"):
        rel = os.path.relpath(p, BASE)
        repo.append({"path": rel, "key": nkey(os.path.basename(rel)),
                     "sha256": hashlib.sha256(open(p,"rb").read()).hexdigest(), "d": dhash(p)})
reposha  = {r["sha256"]: r["path"] for r in repo}
repokey  = {}
for r in repo: repokey.setdefault(r["key"], r["path"])

old = json.load(open(f"{ARC}/old-image-manifest.json"))
rows = []
for x in old:
    local = os.path.join(ARC, "images", os.path.basename(x["local"]))
    mime  = (x["mime"] or "").split(";")[0]
    name  = (x["alts"][0] if x["alts"] else "") or os.path.basename(x["url"].split("?")[0])
    rec = {"canonical_key": x["canonical"], "original_url": x["url"],
           "source_pages": "; ".join(x["pages"][:5]) + (f" (+{len(x['pages'])-5})" if len(x["pages"])>5 else ""),
           "asset_name": name[:70], "mime": mime, "bytes": x["bytes"],
           "width": x["maxdim"][0], "height": x["maxdim"][1], "sha256": x["sha256"], "http": x["http"],
           "alt_text": "; ".join(x["alts"])[:120], "wix_dependency": "YES" if ("wixstatic" in x["url"] or "rdca.com" in x["url"]) else "NO"}

    if x["http"] != "200" or x["bytes"] == 0:
        rec.update(status="UNRESOLVED", match_basis="fetch failed (HTTP 000) - migration status unknown",
                   matched_repo_file="", dhash="", nearest_distance=""); rows.append(rec); continue
    if "html" in mime:
        rec.update(status="NOT-AN-IMAGE", match_basis="URL returned an HTML page, not an image - excluded from image totals",
                   matched_repo_file="", dhash="", nearest_distance=""); rows.append(rec); continue

    dh = dhash(local) if os.path.exists(local) else None
    exact = reposha.get(x["sha256"])
    nk = nkey(name)
    namehit = repokey.get(nk) if len(nk) >= 4 else None
    best, bestd = None, 99
    if dh is not None:
        for r in repo:
            if r["d"] is None: continue
            dd = ham(dh, r["d"])
            if dd < bestd: bestd, best = dd, r
    if exact:
        rec.update(status="EXACT-MATCH", match_basis="byte-identical (SHA-256)", matched_repo_file=exact)
    elif namehit and dh is not None:
        rec.update(status="LIKELY-VISUAL-MATCH",
                   match_basis=f"filename/alt-text match to repo asset (perceptual dHash {bestd}/64 - re-encoded, so hash differs)",
                   matched_repo_file=namehit)
    elif dh is not None and bestd <= 12:
        rec.update(status="LIKELY-VISUAL-MATCH", match_basis=f"perceptual dHash distance {bestd}/64", matched_repo_file=best["path"])
    elif dh is None:
        rec.update(status="UNRESOLVED", match_basis="image could not be decoded", matched_repo_file="")
    else:
        rec.update(status="VERIFIED-MISSING",
                   match_basis=f"no SHA-256 match, no filename match, nearest perceptual dHash {bestd}/64",
                   matched_repo_file="")
    rec["dhash"] = format(dh,"016x") if dh is not None else ""
    rec["nearest_distance"] = bestd if dh is not None else ""
    rows.append(rec)

cols = ["canonical_key","original_url","source_pages","asset_name","mime","bytes","width","height",
        "sha256","http","alt_text","dhash","nearest_distance","matched_repo_file","match_basis",
        "wix_dependency","status"]
with open(f"{AD}/IMAGE-MATCH-REPORT.csv","w",newline="") as f:
    w=csv.DictWriter(f,fieldnames=cols); w.writeheader()
    for r in rows: w.writerow({c:r.get(c,"") for c in cols})

st = Counter(r["status"] for r in rows)
imgs_only = sum(v for k,v in st.items() if k!="NOT-AN-IMAGE")

# ---- error taxonomy ----
newp = json.load(open(f"{SP}/new-pages.json"))
oldp = json.load(open(f"{SP}/old-pages.json"))
hon  = json.load(open(f"{SP}/honours-pages.json"))
tax = {
 "http_errors": {
   "old_site_non_200": sum(1 for x in oldp if x.get("status")!=200),
   "honours_non_200":  sum(1 for h in hon if h["http"]!="200"),
   "new_site_non_200": sum(1 for x in newp if x.get("status")!=200),
   "asset_fetch_failures": sum(1 for r in rows if r["http"]!="200"),
   "document_fetch_failures": 0,
 },
 "functional_failures": {
   "forms_without_action": 2, "forms_without_required_fields": 2,
   "unbranded_404": 1, "missing_skip_link": 1, "images_missing_alt": 2,
   "third_party_embed_failures_social_html": 16,
 },
 "placeholder_pages": {
   "placeholder_html_variants_pointing_at_old_site": 15,
   "template_shells_rendering_not_found": 4,
   "sample_flagged_datasets": 5,
 },
 "empty_or_decaying_sources": {
   "honours_lifemember_endpoint_empty_bytes": 316,
   "honours_pages_with_content": sum(1 for h in hon if h["chars"]>40),
   "honours_pages_effectively_empty": sum(1 for h in hon if h["chars"]<=40),
 },
 "broken_dependencies": {
   "new_site_links_to_old_site_distinct_urls": 96,
   "documents_hotlinked_to_old_host": 38,
   "third_party_documents_correctly_external": 5,
   "placeholder_links_resolving_to_old_site": 28,
 },
 "cutover_risks": {
   "redirects_required": 76, "redirects_without_destination": 10,
   "pages_with_meta_description": 0, "pages_with_canonical": 0,
   "pages_with_og": 0, "pages_with_structured_data": 0,
   "robots_txt": "404", "sitemap_xml": "404",
   "honours_subdomain_pages_at_risk": len(hon),
   "records_rows_at_risk": sum(h["rows"] for h in hon),
 },
}
json.dump(tax, open(f"{AD}/ERROR-TAXONOMY.json","w"), indent=1)

inv = json.load(open(f"{AD}/MACHINE-READABLE-INVENTORY.json"))
inv["totals"].update({
  "content_image_urls_discovered": len(rows),
  "content_images_actual": imgs_only,
  "content_images_exact_match": st.get("EXACT-MATCH",0),
  "content_images_likely_match": st.get("LIKELY-VISUAL-MATCH",0),
  "content_images_verified_missing": st.get("VERIFIED-MISSING",0),
  "content_images_unresolved": st.get("UNRESOLVED",0),
  "urls_not_images": st.get("NOT-AN-IMAGE",0),
})
inv["image_match_summary"] = dict(st)
inv["error_taxonomy"] = tax
json.dump(inv, open(f"{AD}/MACHINE-READABLE-INVENTORY.json","w"), indent=1)

print(json.dumps({"image_status":dict(st),"image_urls":len(rows),"actual_images":imgs_only,
                  "sum_check":sum(st.values())==len(rows)}, indent=1))
