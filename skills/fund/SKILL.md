---
name: fund
description: Allocate funds from main account to agents or collect funds back. Use when you or the user wants to fund, allocate, collect, or move money between account and agents.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.1 status*)
  - Bash(npx @agentwallex/cli@0.1.1 account *)
  - Bash(npx @agentwallex/cli@0.1.1 balance *)
  - Bash(npx @agentwallex/cli@0.1.1 agents list*)
---

# Fund Skill

Allocate funds from the main account to an agent wallet, or collect funds back from an agent to the main account.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).
- The agent must already exist (use the `agent` skill if needed).
- For allocation: the main account must have sufficient balance (use `topup` to deposit first).

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (all params specified)
awx account allocate --agent agt_a1b2c3d4 --token USDC --amount 100

# Interactive mode (guided prompts)
awx account allocate
```

In interactive mode, you will be prompted for:
- Agent ID (select from a list or type manually)
- Token (USDC / USDT)
- Amount
- Confirmation before executing

The same interactive flow applies to `awx account collect`.

## Steps

### Allocating Funds to an Agent

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status`.

2. **Check the main account balance.** Run `npx @agentwallex/cli@0.1.1 account balance` to see available funds.

3. **Gather allocation details.** You need:
   - **Agent ID** (required): The agent to fund.
   - **Token** (required): `USDC` or `USDT`.
   - **Amount** (required): How much to allocate (must be positive and not exceed account balance).

4. **Confirm with the user.** Display a summary of the allocation before proceeding.

5. **Allocate funds.** Run `npx @agentwallex/cli@0.1.1 account allocate --agent <id> --token <token> --amount <amount>`.

6. **Verify the allocation.** Run `npx @agentwallex/cli@0.1.1 balance <agent-id>` to confirm the agent received the funds.

### Collecting Funds from an Agent

1. **Check the agent's balance.** Run `npx @agentwallex/cli@0.1.1 balance <agent-id>`.

2. **Collect funds.** Run `npx @agentwallex/cli@0.1.1 account collect --agent <id> --token <token> --amount <amount>`.

## Input Validation

| Field    | Rule                                                | Example          |
|----------|-----------------------------------------------------|------------------|
| Agent ID | Non-empty string                                    | `agt_a1b2c3d4`   |
| Token    | One of: `USDC`, `USDT`                              | `USDC`           |
| Amount   | Positive number, up to 2 decimal places              | `100.00`         |

- Verify the allocation amount does not exceed the account's available balance.
- Reject negative or zero amounts.

## CLI Command Reference

| Command                                                                                  | Description                              |
|------------------------------------------------------------------------------------------|------------------------------------------|
| `npx @agentwallex/cli@0.1.1 account balance`                                            | Check main account balance               |
| `npx @agentwallex/cli@0.1.1 account allocate --agent <id> --token <tkn> --amount <amt>` | Allocate funds to an agent               |
| `npx @agentwallex/cli@0.1.1 account collect --agent <id> --token <tkn> --amount <amt>`  | Collect funds back from an agent         |
| `npx @agentwallex/cli@0.1.1 balance <agent-id>`                                         | Check agent balance after allocation     |

## Example Session

**User:** Fund agt_a1b2c3d4 with 100 USDC

**Assistant:**

Let me check the account balance first:

```bash
npx @agentwallex/cli@0.1.1 account balance
```

Output:
```
  Chain   Token   Available    Locked
  base    USDC    1,250.00     0.00
```

You have 1,250.00 USDC available. Here is the allocation summary:

- **To Agent:** agt_a1b2c3d4
- **Amount:** 100.00 USDC

Shall I proceed?

**User:** Yes

**Assistant:**

```bash
npx @agentwallex/cli@0.1.1 account allocate --agent agt_a1b2c3d4 --token USDC --amount 100
```

Output:
```
Funds allocated.

  Order ID:       ord_x1y2z3
  Transaction ID: txn_a4b5c6
  Amount:         100.00
  Token:          USDC
  Status:         completed
```

100.00 USDC has been allocated to agent agt_a1b2c3d4.

## Troubleshooting

| Problem                           | Solution                                                                 |
|-----------------------------------|--------------------------------------------------------------------------|
| `Insufficient account balance`    | Deposit more funds using the `topup` skill.                              |
| `Agent not found`                 | Verify the agent ID. List agents with `agents list`.                     |
| `Not connected`                   | Run the `setup` skill to configure your API key.                         |
| `Invalid token`                   | Use `USDC` or `USDT`.                                                    |

## Notes

- Allocation moves funds from the main account pool to a specific agent's wallet.
- Collection is the reverse: it moves unspent funds from an agent back to the main account.
- Use `--json` flag for machine-readable output.
