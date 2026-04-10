# Task Summary: Create 9 SKILL.md Files for AgentWallex Skills

## Date
2026-04-10

## Objective
Create 9 individual SKILL.md files for the AgentWallex skills directory, following the Coinbase agentic-wallet-skills pattern with YAML frontmatter, step-by-step instructions, input validation, CLI command references, and example sessions.

## Files Created

| # | Skill | Path | Size |
|---|-------|------|------|
| 1 | setup-wallet | `skills/setup-wallet/SKILL.md` | ~4.1 KB |
| 2 | create-agent | `skills/create-agent/SKILL.md` | ~5.3 KB |
| 3 | check-balance | `skills/check-balance/SKILL.md` | ~5.3 KB |
| 4 | send-payment | `skills/send-payment/SKILL.md` | ~7.0 KB |
| 5 | fund-agent | `skills/fund-agent/SKILL.md` | ~6.1 KB |
| 6 | set-policy | `skills/set-policy/SKILL.md` | ~7.2 KB |
| 7 | approve-transaction | `skills/approve-transaction/SKILL.md` | ~6.2 KB |
| 8 | pay-for-service | `skills/pay-for-service/SKILL.md` | ~7.1 KB |
| 9 | deposit | `skills/deposit/SKILL.md` | ~6.4 KB |

## SKILL.md Structure (each file)
- **YAML frontmatter**: name, description, user-invocable, disable-model-invocation, allowed-tools
- **allowed-tools**: Bash commands using `npx @agentwallex/cli@0.1.0`
- **Prerequisites section**
- **Step-by-step instructions** (5-7 steps per skill)
- **Input validation table** with rules and examples
- **CLI command reference table** with `--json` flag variants
- **Example session** showing user/assistant conversation
- **Troubleshooting table**
- **Notes section**

## Key Design Decisions
- All CLI commands use `npx @agentwallex/cli@0.1.0` (not the `awx` alias) for consistency
- API key prefix is `awk_` (matching project conventions)
- Default chain is `base` when not specified
- Default token is `USDC` when not specified
- All skills cross-reference other skills (e.g., send-payment references fund-agent for insufficient balance)
- Human confirmation is emphasized for transfer/approve/reject operations
