# Reference: batching, payloads, and value patterns

## insert-many batching

The MongoDB MCP `insert-many` tool accepts an array of documents. Very large arrays can exceed driver or gateway payload limits. Prefer:

- Start with **hundreds** of documents per call unless the user specifies load testing.
- If a batch fails or times out, **halve** the batch size and retry.
- Preserve **insert order across collections** (parents before children) even when batching within one collection.

## Extended JSON in fixtures

When storing fixtures as JSON files for humans and tools:

- Use Extended JSON for dates and ObjectIds, for example `{ "$date": "2026-01-01T00:00:00.000Z" }` and `{ "$oid": "..." }`.
- In `mongosh`, you can paste plain objects with `ObjectId("...")` and `ISODate("...")` instead.

## Naming and fake PII

- Email: use a reserved domain such as `example.invalid` or `example.com` plus a plus-tag (`user+test1@...`).
- Names and addresses: obvious placeholders (`Test User 7`, `123 Fake St`).
- Phone: use555 blocks or other obviously non-assignable patterns where your app validates format.

## Unique and partial unique indexes

Before generating random strings for a uniquely indexed field:

- Check `collection-indexes` for unique and partialFilterExpression.
- If uniqueness is global, widen the value space or add a monotonic suffix to avoid duplicate key errors on re-run.

## Collation

If a unique index specifies a collation, string comparison follows that collation when enforcing uniqueness—match generator output to the same normalization rules the app uses.

## Idempotency patterns

- **Additive only:** simplest; may duplicate on re-run unless the app dedupes.
- **Deterministic `_id`:** same fixture file yields duplicate key on re-run unless you skip existing or use replace semantics in a script.
- **Tagged delete:** add `seedTag: "v2"` then `deleteMany({ seedTag: "v2" })` before re-seed (destructive within that tag; requires approval like any delete).
