/**
 * Seed synthetic employees for mongodb-developer/mern-stack-example
 * Matches server: db "employees", collection "records" (see mern/server/db/connection.js).
 *
 * Usage (non-production cluster only):
 *   mongosh "$ATLAS_URI" seed.mongosh.js
 *
 * Idempotent with respect to these _id values: re-run skips duplicates.
 */
const records = [
  {
    _id: ObjectId("674000000000000000000001"),
    name: "Avery Chen",
    position: "Software Engineer",
    level: "Senior",
  },
  {
    _id: ObjectId("674000000000000000000002"),
    name: "Jordan Mills",
    position: "Product Designer",
    level: "Junior",
  },
  {
    _id: ObjectId("674000000000000000000003"),
    name: "Riley Park",
    position: "DevOps Engineer",
    level: "Senior",
  },
  {
    _id: ObjectId("674000000000000000000004"),
    name: "Sam Okonkwo",
    position: "Data Analyst",
    level: "Intern",
  },
  {
    _id: ObjectId("674000000000000000000005"),
    name: "Taylor Brooks",
    position: "Engineering Manager",
    level: "Senior",
  },
  {
    _id: ObjectId("674000000000000000000006"),
    name: "Casey Nguyen",
    position: "Frontend Developer",
    level: "Junior",
  },
  {
    _id: ObjectId("674000000000000000000007"),
    name: "Morgan Singh",
    position: "Backend Developer",
    level: "Junior",
  },
  {
    _id: ObjectId("674000000000000000000008"),
    name: "Quinn Rivera",
    position: "Site Reliability Engineer",
    level: "Senior",
  },
];

const target = db.getSiblingDB("employees").getCollection("records");
let inserted = 0;
for (const doc of records) {
  const r = target.updateOne(
    { _id: doc._id },
    { $setOnInsert: { name: doc.name, position: doc.position, level: doc.level } },
    { upsert: true }
  );
  if (r.upsertedCount === 1) inserted++;
}
print(`employees.records: inserted ${inserted} new document(s); existing _id(s) left unchanged.`);
