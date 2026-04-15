"""
Apothecary Ledger — Kaggle Dataset Import Script
Run this AFTER running schema.sql in Supabase SQL Editor.
Usage: python3 import_kaggle_data.py
"""

import csv
import os
import re
import json
from supabase import create_client

# ── Config ────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")  # use service role for bulk insert
DATA_DIR = "/home/ovizit/Desktop/Pharmacy_Management/pharmacy_management/data/kaggle"  # put your CSV files here
BATCH_SIZE = 500            # rows per insert batch

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def batch_insert(table: str, rows: list):
    """Insert rows in batches to avoid timeout."""
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        supabase.table(table).upsert(batch).execute()
        print(f"  ✓ {table}: inserted rows {i+1}–{min(i+BATCH_SIZE, len(rows))}")

def extract_price(text: str) -> float | None:
    """Extract first BDT price from package_container string."""
    if not text:
        return None
    match = re.search(r'৳\s*([\d.]+)', text)
    return float(match.group(1)) if match else None

# ── 1. Dosage Forms ───────────────────────────────────────────
print("\n📦 Importing dosage_forms...")
rows = []
with open(f"{DATA_DIR}/dosage_form.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        rows.append({
            "id":          int(row["dosage form id"]),
            "name":        row["dosage form name"].strip(),
            "slug":        row["slug"].strip(),
            "brand_count": int(row["brand names count"] or 0),
        })
batch_insert("dosage_forms", rows)
print(f"  Total: {len(rows)} dosage forms")

# ── 2. Drug Classes ───────────────────────────────────────────
print("\n💊 Importing drug_classes...")
rows = []
with open(f"{DATA_DIR}/drug_class.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        rows.append({
            "id":             int(row["drug class id"]),
            "name":           row["drug class name"].strip(),
            "slug":           row["slug"].strip(),
            "generics_count": int(row["generics count"] or 0),
        })
batch_insert("drug_classes", rows)
print(f"  Total: {len(rows)} drug classes")

# ── 3. Indications ────────────────────────────────────────────
print("\n🏥 Importing indications...")
rows = []
with open(f"{DATA_DIR}/indication.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        rows.append({
            "id":             int(row["indication id"]),
            "name":           row["indication name"].strip(),
            "slug":           row["slug"].strip(),
            "generics_count": int(row["generics count"] or 0),
        })
batch_insert("indications", rows)
print(f"  Total: {len(rows)} indications")

# ── 4. Manufacturers ──────────────────────────────────────────
print("\n🏭 Importing manufacturers...")
rows = []
with open(f"{DATA_DIR}/manufacturer.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        rows.append({
            "id":             int(row["manufacturer id"]),
            "name":           row["manufacturer name"].strip(),
            "slug":           row["slug"].strip(),
            "generics_count": int(row["generics count"] or 0),
            "brand_count":    int(row["brand names count"] or 0),
        })
batch_insert("manufacturers", rows)
print(f"  Total: {len(rows)} manufacturers")

# ── 5. Generics (large — skip HTML description fields) ────────
print("\n🧪 Importing generics (19,565 rows — this may take a minute)...")
rows = []
with open(f"{DATA_DIR}/generic.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        rows.append({
            "id":                               int(row["generic id"]),
            "name":                             row["generic name"].strip(),
            "slug":                             row["slug"].strip(),
            "monograph_link":                   row.get("monograph link", "").strip() or None,
            "drug_class":                       row.get("drug class", "").strip() or None,
            "indication":                       row.get("indication", "").strip() or None,
            "storage_conditions":               row.get("storage conditions description", "").strip() or None,
        })
batch_insert("generics", rows)
print(f"  Total: {len(rows)} generics")

# ── 6. Medicines (21,714 rows) ────────────────────────────────
# ── 6. Medicines (Deduplicated) ───────────────────────────────
print("\n💉 Importing medicines (Cleaning duplicates first)...")
rows = []
seen_slugs = set() # This will track slugs we've already added

with open(f"{DATA_DIR}/medicine.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        slug = row["slug"].strip()
        
        # SKIP if we have already seen this slug in this run
        if slug in seen_slugs:
            continue
        
        price = extract_price(row.get("package container", ""))
        rows.append({
            "id":                int(row["brand id"]),
            "brand_name":        row["brand name"].strip(),
            "type":              row["type"].strip(),
            "slug":              slug,
            "dosage_form":       row.get("dosage form", "").strip() or None,
            "generic_name":      row.get("generic", "").strip() or None,
            "strength":          row.get("strength", "").strip() or None,
            "manufacturer_name": row.get("manufacturer", "").strip() or None,
            "package_container": row.get("package container", "").strip() or None,
            "package_size":      row.get("Package Size", "").strip() or None,
            "unit_price":        price,
            "stock_quantity":    0,
            "reorder_level":     10,
            "is_active":         True,
        })
        seen_slugs.add(slug)

# Now insert the unique rows only
batch_insert("medicines", rows)
print(f"  Total: {len(rows)} unique medicines imported.")
