---
name: check-balance
description: Check wallet balances. Use when you or the user wants to check balance, see funds, view wallet, or when verifying before a payment.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 balance *)
  - Bash(npx @agentwallex/cli@0.1.0 account balance*)
---

# Check Balance Skill

Check token balances for a specific agent wallet or for the main account across all agents.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- For agent-level balance: you need the agent ID.

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured.

2. **Determine what balance to check.** Ask the user whether they want:
   - **Agent balance**: Balance for a specific agent wallet.
   - **Account balance**: Aggregate balance across the entire account.

3. **Run the appropriate command.**
   - For an agent: `npx @agentwallex/cli@0.1.0 balance <agent-id>`
   - For the main account: `npx @agentwallex/cli@0.1.0 account balance`

4. **Display the results.** Show the available balance, locked balance, and pending income. Highlight which chain and token each balance entry refers to.

5. **Interpret the results for the user.** If the user is checking before a payment, confirm whether the available balance is sufficient. If the balance is zero, suggest the `deposit` or `fund-agent` skill.

## Balance Fields

| Field             | Description                                    |
|-------------------|------------------------------------------------|
| `available`       | Funds available for immediate spending         |
| `locked`          | Funds locked in pending transactions           |
| `pending_income`  | Incoming funds not yet confirmed on-chain      |
| `total_deposited` | Lifetime total deposited                       |
| `total_withdrawn` | Lifetime total transferred out                 |
| `total_paid`      | Lifetime outbound payments                     |
| `total_earned`    | Lifetime earned income                         |

## Input Validation

| Field    | Rule                                           | Example          |
|----------|-------------------------------------------------|------------------|
| Agent ID | Non-empty string, typically `agent-` prefix     | `agent-a1b2c3d4` |

- If the user does not provide an agent ID and asks for "my balance," ask whether they mean a specific agent or the main account.
- If only one agent exists, you may default to that agent.

## CLI Command Reference

| Command                                                  | Description                              |
|----------------------------------------------------------|------------------------------------------|
| `npx @agentwallex/cli@0.1.0 balance <agent-id>`         | Check balance for a specific agent       |
| `npx @agentwallex/cli@0.1.0 balance <agent-id> --json`  | Agent balance with JSON output           |
| `npx @agentwallex/cli@0.1.0 account balance`            | Check account-level aggregate balance    |
| `npx @agentwallex/cli@0.1.0 account balance --json`     | Account balance with JSON output         |

## Example Session

**User:** Check the balance for agent-a1b2c3d4

**Assistant:**

Let me check the balance:

```bash
npx @agentwallex/cli@0.1.0 balance agent-a1b2c3d4
```

Output:
```
Agent: agent-a1b2c3d4

  Chain     Token   Available   Locked   Pending
  base      USDC    150.00      10.00    0.00
  base      USDT    0.00        0.00     0.00
  ethereum  USDC    25.50       0.00     5.00
```

Your agent has 150.00 USDC available on Base and 25.50 USDC on Ethereum. There is 10.00 USDC locked in a pending transaction on Base, and 5.00 USDC pending income on Ethereum.

**User:** What about my overall account?

**Assistant:**

```bash
npx @agentwallex/cli@0.1.0 account balance
```

Output:
```
Account Balance (all agents):

  Token   Total Available   Total Locked   Total Pending
  USDC    1,250.00          10.00          5.00
  USDT    500.00            0.00           0.00
```

Your total account balance is 1,250.00 USDC and 500.00 USDT available across all agents.

## Troubleshooting

| Problem                          | Solution                                                                |
|----------------------------------|-------------------------------------------------------------------------|
| `Not connected`                  | Run the `setup-wallet` skill to configure your API key.                 |
| `Agent not found`                | Verify the agent ID. List agents with `npx @agentwallex/cli@0.1.0 agents list`. |
| Balance shows 0 after deposit    | On-chain deposits may take a few minutes to confirm. Wait and retry.    |
| Balance on wrong chain           | Each chain has its own balance. Specify the chain or check all chains.  |

## Notes

- Balances are returned per chain and per token (one row for each combination).
- EVM chains (Ethereum, BSC, Base, Polygon) may share a wallet address but have separate balances.
- Use `--json` flag for machine-readable output suitable for programmatic use.
- Always check balance before sending a payment to ensure sufficient funds.
