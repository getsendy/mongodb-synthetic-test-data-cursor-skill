# mongodb-synthetic-test-data (Cursor skill)

This repository contains a **Cursor Agent Skill** that guides the AI when generating **synthetic MongoDB documents** for tests (fixtures, seeds, QA data), including safe write policies, insert ordering, reproducibility, and optional **Atlas Search** alignment.

It also includes **example seed data** for the official [MERN stack example](https://github.com/mongodb-developer/mern-stack-example) tutorial app.

## Contents

| Path | Description |
|------|--------------|
| [`.cursor/skills/mongodb-synthetic-test-data/`](.cursor/skills/mongodb-synthetic-test-data/) | Skill source: `SKILL.md`, `examples.md`, `reference.md` |
| [`mongodb-synthetic-test-data-skill.zip`](mongodb-synthetic-test-data-skill.zip) | Same skill packaged for download (unzip → copy folder into your skills path) |
| [`mern-stack-example-seed/`](mern-stack-example-seed/) | Synthetic `employees.records` fixtures and an idempotent `mongosh` seed script |

## Install the skill (Cursor)

**Option A — this repo (project skill)**  
Clone the repo and open it in Cursor. The skill is already under `.cursor/skills/`.

**Option B — personal skills (all projects)**  
Copy the folder to your user skills directory (name must stay `mongodb-synthetic-test-data`):

```bash
cp -R .cursor/skills/mongodb-synthetic-test-data ~/.cursor/skills/
```

**Option C — from the zip**  
Unzip `mongodb-synthetic-test-data-skill.zip`, then move `mongodb-synthetic-test-data` to either:

- `~/.cursor/skills/mongodb-synthetic-test-data` (personal), or  
- `<your-repo>/.cursor/skills/mongodb-synthetic-test-data` (project)

Restart or reload Cursor if the skill does not appear. Reference it in chat with **`@mongodb-synthetic-test-data`** (or your Cursor skills UI).

## Requirements

- **MongoDB MCP** in Cursor if you want the agent to run live `insert-many` / reads against your cluster (optional; the skill still supports emitting fixtures and `mongosh` scripts without MCP).
- Other MongoDB skills from the Cursor MongoDB plugin work well alongside this one (`mongodb-schema-design`, `mongodb-search-and-ai`, `mongodb-natural-language-querying`, `mongodb-mcp-setup`).

## MERN example seed data

See [`mern-stack-example-seed/README.md`](mern-stack-example-seed/README.md) for database name, collection, field rules, and commands. **Use a non-production cluster only**; keep `ATLAS_URI` in environment variables, not in committed files.

## Contributing

Issues and PRs are welcome—for example, clearer examples, extra reference material, or tighter wording in `SKILL.md` (keep the main file concise; add depth in `reference.md`).

## License

No license file is bundled in this snapshot. Add one (for example MIT or Apache-2.0) if you fork or redistribute the skill.
