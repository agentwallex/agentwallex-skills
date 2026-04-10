---
name: policy
description: Set spending limits, approval thresholds, and review pending transactions. Use when you or the user wants to set limits, create policies, approve, reject, or manage spending rules.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 policies *)
  - Bash(npx @agentwallex/cli@0.1.0 approvals *)
  - Bash(npx @agentwallex/cli@0.1.0 agents list*)
---

# Policy Skill

Set spending limits and approval thresholds on agents, and review/approve/reject pending transactions.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).
- The agent must already exist (use the `agent` skill if needed).

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (all params specified)
awx policies create --agent agt_a1b2c3d4 --daily-limit 500 --approval-threshold 100

# Interactive mode (guided prompts)
awx policies create
```

In interactive mode for `policies create`, you will be prompted for:
- Agent ID
- Daily limit
- Monthly limit (optional)
- Per-transaction limit (optional)
- Approval threshold (optional)

For `approvals reject`, interactive mode prompts for:
- Rejection reason

## Steps

### Creating a Spending Policy

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status`.

2. **Gather policy details.** You need:
   - **Agent ID** (required): The agent to apply the policy to.
   - **Daily limit** (optional): Maximum daily spending amount.
   - **Monthly limit** (optional): Maximum monthly spending amount.
   - **Max transaction** (optional): Maximum single transaction amount.
   - **Approval threshold** (optional): Transactions above this amount require human approval.
   - **Require approval** (optional): Flag to require human approval for all transactions.

3. **Create the policy.** Run `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt>`.

4. **Report the result.** Show the policy ID and configured limits.

### Listing Policies

Run `npx @agentwallex/cli@0.1.0 policies list` to see all policies.
Filter by agent: `npx @agentwallex/cli@0.1.0 policies list --agent <id>`.

### Reviewing Pending Approvals

1. **List pending approvals.** Run `npx @agentwallex/cli@0.1.0 approvals list --status pending`.

2. **Approve or reject.** Run:
   - `npx @agentwallex/cli@0.1.0 approvals approve <id>` to approve.
   - `npx @agentwallex/cli@0.1.0 approvals reject <id> --note "<reason>"` to reject.

## Input Validation

| Field              | Rule                          | Example        |
|--------------------|-------------------------------|----------------|
| Agent ID           | Non-empty string              | `agt_a1b2c3d4` |
| Daily limit        | Positive number               | `500`          |
| Monthly limit      | Positive number               | `5000`         |
| Max transaction    | Positive number               | `100`          |
| Approval threshold | Positive number               | `50`           |
| Rejection note     | Non-empty string              | `Over budget`  |

## CLI Command Reference

| Command                                                                                      | Description                     |
|----------------------------------------------------------------------------------------------|---------------------------------|
| `npx @agentwallex/cli@0.1.0 policies list`                                                  | List all policies               |
| `npx @agentwallex/cli@0.1.0 policies list --agent <id>`                                     | List policies for an agent      |
| `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt>`               | Create a policy                 |
| `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt> --monthly-limit <amt> --max-txn <amt> --approval-threshold <amt>` | Create with all limits |
| `npx @agentwallex/cli@0.1.0 approvals list --status pending`                                | List pending approvals          |
| `npx @agentwallex/cli@0.1.0 approvals approve <id>`                                         | Approve a transaction           |
| `npx @agentwallex/cli@0.1.0 approvals reject <id> --note "<reason>"`                        | Reject a transaction            |

## Example Session

**User:** Set a $500 daily spending limit on agt_a1b2c3d4

**Assistant:**

```bash
npx @agentwallex/cli@0.1.0 policies create --agent agt_a1b2c3d4 --daily-limit 500
```

Output:
```
Policy created.

  Policy ID:         pol_x1y2z3
  Agent ID:          agt_a1b2c3d4
  Daily Limit:       500.00
  Monthly Limit:     -
  Max Txn:           -
  Approval Required: No
```

A daily spending limit of $500 has been set for agent agt_a1b2c3d4.

**User:** Check if there are any pending approvals

**Assistant:**

```bash
npx @agentwallex/cli@0.1.0 approvals list --status pending
```

Output:
```
  ID           Agent ID        Status    Created
  apr_a1b2     agt_a1b2c3d4    pending   2026-04-10T12:00:00Z
```

There is one pending approval. Would you like to approve or reject it?

## Troubleshooting

| Problem                      | Solution                                                          |
|------------------------------|-------------------------------------------------------------------|
| `Agent not found`            | Verify the agent ID. List agents with `agents list`.              |
| `Not connected`              | Run the `setup` skill to configure your API key.                  |
| `Policy already exists`      | An agent can have one active policy. Update or delete the existing one. |

## Notes

- Each agent can have one active spending policy.
- Policies apply to all outgoing transactions from the agent.
- Transactions exceeding the approval threshold are held until manually approved or rejected.
- Use `--json` flag for machine-readable output.
