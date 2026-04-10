---
name: set-policy
description: Configure spending policies for an agent. Use when you or the user wants to set limits, configure spending rules, set approval thresholds, or manage auto-funding.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 policies *)
  - Bash(npx @agentwallex/cli@0.1.0 agents get *)
---

# Set Policy Skill

Create and manage spending policies for an agent. Policies define limits, approval thresholds, and spending rules that control how an agent can use its funds.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- The agent must already exist (use the `create-agent` skill if needed).

## Policy Options

| Option                   | Description                                              | Example    |
|--------------------------|----------------------------------------------------------|------------|
| `--daily-limit`          | Maximum total spending per day (24h rolling window)       | `500`      |
| `--monthly-limit`        | Maximum total spending per month (30d rolling window)     | `5000`     |
| `--per-tx-limit`         | Maximum amount per individual transaction                 | `100`      |
| `--approval-threshold`   | Transactions above this amount require human approval     | `50`       |
| `--allowed-tokens`       | Restrict to specific tokens                               | `USDC`     |
| `--allowed-chains`       | Restrict to specific chains                               | `base,ethereum` |

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured.

2. **Verify the agent exists.** Run `npx @agentwallex/cli@0.1.0 agents get <agent-id>` to confirm the agent is active.

3. **Gather policy details from the user.** Determine which limits and rules they want:
   - Daily spending limit
   - Monthly spending limit
   - Per-transaction limit
   - Approval threshold (transactions above this amount need human approval)
   - Allowed tokens and chains (optional restrictions)

4. **Create the policy.** Run the appropriate `policies create` command with the desired options.

5. **Confirm the policy.** Show the created policy details to the user.

6. **Explain the behavior.** Transactions within limits proceed automatically. Transactions exceeding the approval threshold are held for review via the `approve-transaction` skill.

## Input Validation

| Field               | Rule                                               | Example     |
|---------------------|-----------------------------------------------------|-------------|
| Agent ID            | Non-empty string                                    | `agent-a1b2c3d4` |
| Daily limit         | Positive number                                     | `500`       |
| Monthly limit       | Positive number, should be >= daily limit            | `5000`      |
| Per-tx limit        | Positive number, should be <= daily limit            | `100`       |
| Approval threshold  | Positive number                                     | `50`        |
| Allowed tokens      | Comma-separated: USDC, USDT                         | `USDC,USDT` |
| Allowed chains      | Comma-separated valid chain names                    | `base,ethereum` |

- Monthly limit should be greater than or equal to daily limit.
- Per-tx limit should be less than or equal to daily limit.
- Approval threshold should be less than or equal to per-tx limit for meaningful approval workflows.

## CLI Command Reference

| Command                                                                                              | Description                |
|------------------------------------------------------------------------------------------------------|----------------------------|
| `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt>`                       | Create with daily limit    |
| `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt> --monthly-limit <amt> --per-tx-limit <amt> --approval-threshold <amt>` | Create with all limits |
| `npx @agentwallex/cli@0.1.0 policies create --agent <id> --daily-limit <amt> --allowed-tokens USDC --allowed-chains base,ethereum` | Create with restrictions |
| `npx @agentwallex/cli@0.1.0 policies list --agent <id>`                                             | List policies for an agent |
| `npx @agentwallex/cli@0.1.0 policies update <policy-id> --daily-limit <amt>`                        | Update a policy            |
| `npx @agentwallex/cli@0.1.0 policies delete <policy-id>`                                            | Delete a policy            |
| `npx @agentwallex/cli@0.1.0 policies list --agent <id> --json`                                      | List policies with JSON    |
| `npx @agentwallex/cli@0.1.0 agents get <agent-id>`                                                  | Check agent details        |

## Example Session

**User:** Set a daily limit of 500 USDC for agent-a1b2c3d4 with approval required above 100

**Assistant:**

Let me verify the agent first:

```bash
npx @agentwallex/cli@0.1.0 agents get agent-a1b2c3d4
```

Output:
```
  Agent ID:   agent-a1b2c3d4
  Name:       payment-bot
  Chain:      base
  Status:     active
```

Now creating the spending policy:

```bash
npx @agentwallex/cli@0.1.0 policies create --agent agent-a1b2c3d4 --daily-limit 500 --per-tx-limit 200 --approval-threshold 100
```

Output:
```
Policy created successfully.

  Policy ID:            pol-x1y2z3
  Agent:                agent-a1b2c3d4
  Daily Limit:          500.00
  Per-TX Limit:         200.00
  Approval Threshold:   100.00
  Status:               active
```

Policy is active. Here is how it works:

- Transactions up to 100.00 USDC will be processed automatically.
- Transactions between 100.01 and 200.00 USDC will require human approval before execution.
- Transactions above 200.00 USDC will be rejected (exceeds per-tx limit).
- Total daily spending cannot exceed 500.00 USDC.

## Troubleshooting

| Problem                           | Solution                                                                   |
|-----------------------------------|----------------------------------------------------------------------------|
| `Agent not found`                 | Verify the agent ID with `agents list`.                                    |
| `Policy already exists`           | Use `policies update` to modify an existing policy, or delete and recreate.|
| `Invalid limit values`            | Ensure all limits are positive numbers.                                     |
| `Not connected`                   | Run the `setup-wallet` skill to configure your API key.                    |

## Notes

- A policy applies to all transactions from the specified agent.
- Multiple policies can be stacked on one agent; the most restrictive limits apply.
- Transactions that exceed the approval threshold are held in `pending_approval` status until approved or rejected via the `approve-transaction` skill.
- Policies can be updated or deleted at any time.
- Use `--json` flag for machine-readable output.
