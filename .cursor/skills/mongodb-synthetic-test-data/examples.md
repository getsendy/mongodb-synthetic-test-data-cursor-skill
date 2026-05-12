# Example: multi-collection seed order

Use this pattern when collections reference each other by `_id`.

## Collections

- `orgs` — root tenant or organization
- `users` — references `orgs._id` as `orgId`
- `orders` — references `users._id` as `userId` and optionally `orgId`

## Insert order

1. Insert `orgs` first; capture each inserted `_id` (or use fixed `_id`s in committed fixtures).
2. Insert `users` with valid `orgId` values from step 1.
3. Insert `orders` with valid `userId` (and `orgId` if denormalized).

## Minimal documents (illustrative)

Org:

```json
{
  "_id": { "$oid": "674000000000000000000001" },
  "name": "Acme Test Org",
  "plan": "enterprise",
  "createdAt": { "$date": "2026-01-15T12:00:00.000Z" }
}
```

User (references org):

```json
{
  "_id": { "$oid": "674000000000000000000101" },
  "orgId": { "$oid": "674000000000000000000001" },
  "email": "qa.user+acme@example.invalid",
  "displayName": "Synthetic User 1",
  "role": "member"
}
```

Order (references user):

```json
{
  "_id": { "$oid": "674000000000000000002001" },
  "userId": { "$oid": "674000000000000000000101" },
  "orgId": { "$oid": "674000000000000000000001" },
  "status": "paid",
  "totalCents": 1999,
  "createdAt": { "$date": "2026-01-16T09:30:00.000Z" }
}
```

## Reproducibility

For CI or golden tests, commit these documents (or a `mongosh` script that `insertMany`s them) so every teammate loads the same `_id` graph. For exploratory runs only, MongoDB-assigned `ObjectId`s are fine but will differ per run.

## Atlas Search smoke

If `orders` or `products` is indexed for search, include a few varied `title` or `description` strings at the mapped paths so `$search` tests return non-empty results.
