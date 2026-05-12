# Synthetic seed data (MERN stack example)

Targets [mongodb-developer/mern-stack-example](https://github.com/mongodb-developer/mern-stack-example): database **`employees`**, collection **`records`**, documents with **`name`**, **`position`**, **`level`** where `level` is one of **`Intern`**, **`Junior`**, **`Senior`**.

## Checklist (mongodb-synthetic-test-data)

1. **Environment:** Use a **non-production** cluster. Set `ATLAS_URI` in the shell (or `.env` for the server); do not commit secrets.
2. **Idempotency:** Use `seed.mongosh.js` for **fixed `_id`s** and safe re-runs (`$setOnInsert` upserts). Use `records.additive.json` only for a **one-time** `insertMany` when you want server-generated `ObjectId`s (duplicates possible if re-run).
3. **Validation:** Documents match the Express `POST /record` shape (no extra fields required by the sample app).
4. **Insert order:** Single collection; no parent/child ordering.
5. **MCP writes:** In Cursor, connect MongoDB MCP first; any `insert-many` requires your **explicit yes** with database `employees` and collection `records`.
6. **Verify:** `db.records.countDocuments()` or `find().limit(3)` in `mongosh`.

## Run (recommended)

From this directory:

```bash
mongosh "$ATLAS_URI" ./seed.mongosh.js
```

## Import fixture (Extended JSON)

```bash
mongoimport --uri="$ATLAS_URI" --db=employees --collection=records --mode=insert --file=records.fixture.json --jsonArray
```

If those `_id`s already exist, `mongoimport` fails; prefer `seed.mongosh.js` instead.

## Files

| File | Purpose |
|------|---------|
| `records.fixture.json` | 8 docs, fixed `_id`, Extended JSON |
| `records.additive.json` | 5 docs, **no** `_id` (additive smoke) |
| `seed.mongosh.js` | Idempotent upserts for the 8 fixed `_id` docs |
