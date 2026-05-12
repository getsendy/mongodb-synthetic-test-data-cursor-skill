---
name: mongodb-synthetic-test-data
description: >-
  Generates BSON-safe synthetic MongoDB documents from application design (collections, types, relationships, indexes) for integration tests, e2e fixtures, and manual QA seeds; respects insert order, unique indexes, schema validation, and batch limits; supports Atlas Search-oriented corpora when field paths match search mappings. Use when the user asks for synthetic data, seed MongoDB, test fixtures, populate a test database, fake or sample documents, reproducible seeds, or CI seed data. Requires MongoDB MCP for live inserts; may still emit fixtures or mongosh/driver scripts without MCP. Pair with mongodb-search-and-ai for $search index and query design.
disable-model-invocation: false
allowed-tools: mcp__mongodb__*
---

# MongoDB synthetic test data

Guide for producing **synthetic** (not anonymized production) datasets aligned to an app’s MongoDB model, then loading them safely.

## Related skills

- **Data modeling** (embed vs reference, document shape): `mongodb-schema-design`
- **Atlas Search** (mappings, `$search`, facets, autocomplete): `mongodb-search-and-ai`
- **Read-only verification queries**: `mongodb-natural-language-querying`
- **MCP connection setup**: `mongodb-mcp-setup`

## Reply checklist (copy into answers)

Use this so steps are not dropped between sessions:

1. **Environment:** Confirm non-production target; connection string via env/secret, not pasted into committed files.
2. **Idempotency:** Additive vs idempotent (fixed `_id` / upsert) vs destructive reset; how re-runs behave.
3. **Validation:** Match `$jsonSchema`, required fields, enums, and app invariants before bulk insert.
4. **Insert order:** Parents before children; batches under payload limits (see [reference.md](reference.md)).
5. **Approval:** Summarize writes; wait for explicit yes before any MCP write.
6. **Verify:** `count` / `find` / small `aggregate` after insert; note caches, triggers, or change streams if relevant.

## Workflow

1. **Gather design inputs:** collections; field names and BSON types; required fields and enums; cardinality per scenario; cross-collection references (`ObjectId` vs string); multi-tenant keys (`tenantId`, `orgId`) kept consistent; whether **Atlas Search** tests need rich text at mapped paths; **reproducibility** need (chat-only vs committed fixtures vs seeded script—see below).
2. **MCP discovery (when connected):** `list-databases` → `list-collections` → `collection-schema` (raise `sampleSize` if sparse) → `collection-indexes` → small `find` (few docs) for value patterns. Prefer **read-only** MCP where possible for discovery.
3. **Plan generation:** seed plan table: `collection | count | constraints | insert order`. Respect unique and **partial** unique indexes; **collation** on unique keys affects string equality. Avoid real PII; use obviously fake emails and names.
4. **Atlas Search (if applicable):** Put varied text at paths your search index maps; use stable categorical values for facets/filters. Bulk insert is unchanged—index definitions and queries belong in `mongodb-search-and-ai`.
5. **Deliverables:** Human-readable plan; documents as JSON arrays, `mongosh` `insertMany`, or driver script; optional post-seed reads. For **team/CI reproducibility**, promote outputs to **versioned repo artifacts** (fixtures or script + README command)—not chat-only blobs.
6. **Reproducibility tiers:** (a) **Bit-identical:** committed fixtures with fixed `_id`s. (b) **High:** script with fixed PRNG seed and stable order. (c) **Low:** one-off chat + `insert-many` for exploratory QA.

## Generation rules

- Match existing `_id` strategy (`ObjectId` vs UUID string). For deterministic tests, assign explicit `_id`s in fixtures or scripts.
- Dates: anchor “relative” windows to a fixed **as-of** instant so TTL and “last N days” queries stay stable in CI.
- **Time-series** and **capped** collections: follow MongoDB rules for those types; do not treat them like generic collections.
- **Transactions:** If multiple collections must commit together, document session order and failure handling (outside MCP if driver-only).
- **Side effects:** Atlas Triggers, change streams, webhooks, Redis—remind the user to flush or coordinate if tests assume a clean secondary state.
- **GridFS / S3 / signed URLs:** If the UI needs real blobs or resolvable URLs, note placeholders may not suffice; point to test doubles or fixture binaries.
- **Operational caps:** Default small counts in examples; warn before very large arrays; split `insert-many` per [reference.md](reference.md).
- **Scope:** Anonymized production dumps and compliance scrubbing are **out of scope** unless the user explicitly expands the task.

## Action policy (writes)

**Never execute write or destructive MCP operations without explicit user approval.**

Before `insert-many`, `update-many`, `create-collection`, `delete-many`, `drop-collection`, or `drop-database`:

1. State **exactly** what will run: database, collection(s), approximate document count, additive vs destructive impact.
2. Ask for **explicit** confirmation (yes/no). Do not proceed on vague replies.

**Read (generally safe):** `find`, `aggregate`, `collection-schema`, `collection-indexes`, `count`, `db-stats`—may use for discovery and verification.

**Your database, your decision:** show the operation, wait for approval, then execute.

## Examples and reference

- Multi-collection happy path: [examples.md](examples.md)
- Batching, payload, naming patterns: [reference.md](reference.md)
