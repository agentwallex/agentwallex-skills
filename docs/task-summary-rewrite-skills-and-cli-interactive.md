# Task Summary: Rewrite Skills & Add CLI Interactive Mode

**Date:** 2026-04-10

## Task 1: Rewrite Skills (8 skills)

### What was done

Deleted all 9 existing skill directories and created 8 new ones at `skills/`:

| # | Skill | Directory | Description |
|---|-------|-----------|-------------|
| 1 | setup | `skills/setup/` | Configure API key |
| 2 | agent | `skills/agent/` | Create/manage agents |
| 3 | balance | `skills/balance/` | Check balances (agent or account, by chain+token) |
| 4 | topup | `skills/topup/` | Get deposit addresses to receive crypto |
| 5 | send | `skills/send/` | Send payment from agent |
| 6 | fund | `skills/fund/` | Allocate/collect between main account and agents |
| 7 | policy | `skills/policy/` | Set spending limits + approve/reject transactions |
| 8 | pay | `skills/pay/` | Make paid API calls via x402/MPP |

Each SKILL.md includes:
- YAML frontmatter with `npx @agentwallex/cli@0.1.0` in allowed-tools
- Interactive mode documentation showing direct vs guided usage
- Steps, input validation, CLI command reference, example sessions, troubleshooting

README.md updated with the new 8-skill table and interactive mode mention.

## Task 2: Add Interactive Mode to CLI

### What was done

**New file:** `packages/cli/src/prompt.ts` -- shared prompt utilities using Node.js `readline` module (callback-based, avoids ESM/esbuild issues with `readline/promises`).

**Modified files:**

| File | Changes |
|------|---------|
| `src/commands/agents.ts` | `create` now takes `[name]` (optional). Without name, prompts for name + chain selection. |
| `src/commands/transfer.ts` | Renamed command from `transfer <agent-id>` to `send [agent-id]`. Without args, prompts for agent (list or manual), chain, token, address, amount, and confirmation. |
| `src/commands/account.ts` | `allocate` and `collect` options changed from `requiredOption` to `option`. Without args, prompts for agent, token, amount, confirmation. Added `registerTopup` export for `awx topup` alias. `deposit` also prompts interactively for chain/token. |
| `src/commands/policies.ts` | `create` agent option changed from `requiredOption` to `option`. Without args, prompts for agent, daily limit, monthly limit, per-tx limit, approval threshold. |
| `src/commands/approvals.ts` | `reject` note changed from `requiredOption` to `option`. Without note, prompts for rejection reason. |
| `src/index.ts` | Added `registerTopup` import and registration. |

### Key decisions

- Used callback-based `readline` instead of `readline/promises` to avoid esbuild resolution errors with tsup.
- `awx send` replaces `awx transfer` as the command name.
- `awx topup` registered as a top-level command (alias for `awx account deposit`).
- Agent selection in interactive mode tries to fetch and display agent list; falls back to manual text input on error.
- Confirmation prompts added before destructive operations (send, allocate, collect).

### Build

CLI builds successfully with `pnpm --filter @agentwallex/cli build`.
