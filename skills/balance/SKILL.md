---
name: balance
description: Check balances for an agent or the main account, by chain and token. Use when you or the user wants to check balance, see funds, view available amount, or check how much is left.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.1 status*)
  - Bash(npx @agentwallex/cli@0.1.1 balance *)
  - Bash(npx @agentwallex/cli@0.1.1 account balance*)
---

# Balance Skill

Check balances for a specific agent or the main account. View available, locked, and pending amounts broken down by chain and token.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (check a specific agent)
awx balance agt_a1b2c3d4

# Direct mode (check main account)
awx account balance

# Interactive mode (guided prompts — choose agent or account)
awx balance
```

## Steps

### Checking Agent Balance

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status`.

2. **Get the agent ID.** Ask the user which agent to check, or list agents with `npx @agentwallex/cli@0.1.1 agents list`.

3. **Check the balance.** Run `npx @agentwallex/cli@0.1.1 balance <agent-id>`.

4. **Display results.** Show available balance by chain and token.

### Checking Main Account Balance

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status`.

2. **Check the balance.** Run `npx @agentwallex/cli@0.1.1 account balance`.

3. **Display results.** Show available, locked, and total deposited amounts.

## CLI Command Reference

| Command                                                  | Description                    |
|----------------------------------------------------------|--------------------------------|
| `npx @agentwallex/cli@0.1.1 balance <agent-id>`         | Check agent balance            |
| `npx @agentwallex/cli@0.1.1 balance <agent-id> --json`  | Agent balance (JSON)           |
| `npx @agentwallex/cli@0.1.1 account balance`            | Check main account balance     |
| `npx @agentwallex/cli@0.1.1 account balance --json`     | Account balance (JSON)         |

## Example Session

**User:** Check the balance of my research-bot agent

**Assistant:**

```bash
npx @agentwallex/cli@0.1.1 balance agt_a1b2c3d4
```

Output:
```
  Chain   Available   Locked   Pending Income   Total Deposited   Total Transferred
  base    150.00      0.00     0.00             200.00            50.00
```

Your agent `agt_a1b2c3d4` has 150.00 USDC available on Base.

## Troubleshooting

| Problem                | Solution                                                          |
|------------------------|-------------------------------------------------------------------|
| `Agent not found`      | Verify the agent ID. List agents with `agents list`.              |
| `Not connected`        | Run the `setup` skill to configure your API key.                  |
| Balance shows 0        | Fund the agent using the `fund` skill or deposit using `topup`.   |

## Notes

- Balance is broken down by chain, showing available, locked, and pending amounts.
- Locked funds are reserved for pending transactions or approvals.
- Use `--json` flag for machine-readable output.
