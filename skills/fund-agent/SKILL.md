---
name: fund-agent
description: Allocate funds from main account to an agent wallet. Use when you or the user wants to fund, top up, allocate, or add money to an agent.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 account *)
  - Bash(npx @agentwallex/cli@0.1.0 balance *)
---

# Fund Agent Skill

Allocate funds from the main account to an agent wallet, collect funds back from an agent, or get a deposit address for external funding.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- The agent must already exist (use the `create-agent` skill if needed).
- For allocation: the main account must have sufficient balance.

## Steps

### Allocating Funds to an Agent

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured.

2. **Check the main account balance.** Run `npx @agentwallex/cli@0.1.0 account balance` to see available funds.

3. **Gather allocation details.** You need:
   - **Agent ID** (required): The agent to fund.
   - **Token** (required): `USDC` or `USDT`.
   - **Amount** (required): How much to allocate (must be positive and not exceed account balance).

4. **Confirm with the user.** Display a summary of the allocation before proceeding.

5. **Allocate funds.** Run `npx @agentwallex/cli@0.1.0 account allocate --agent <id> --token <token> --amount <amount>`.

6. **Verify the allocation.** Run `npx @agentwallex/cli@0.1.0 balance <agent-id>` to confirm the agent received the funds.

### Collecting Funds from an Agent

1. **Check the agent's balance.** Run `npx @agentwallex/cli@0.1.0 balance <agent-id>`.

2. **Collect funds.** Run `npx @agentwallex/cli@0.1.0 account collect --agent <id> --token <token> --amount <amount>`.

### Getting a Deposit Address

1. **Get the deposit address.** Run `npx @agentwallex/cli@0.1.0 account deposit --chain <chain> --token <token>`.

2. **Show the address to the user.** Remind them that deposits may take a few minutes to confirm on-chain.

## Input Validation

| Field    | Rule                                                | Example          |
|----------|-----------------------------------------------------|------------------|
| Agent ID | Non-empty string                                    | `agent-a1b2c3d4` |
| Token    | One of: `USDC`, `USDT`                              | `USDC`           |
| Amount   | Positive number, up to 2 decimal places              | `100.00`         |
| Chain    | One of: base, ethereum, bsc, polygon, tron, solana   | `base`           |

- Verify the allocation amount does not exceed the account's available balance.
- Reject negative or zero amounts.

## CLI Command Reference

| Command                                                                                        | Description                              |
|------------------------------------------------------------------------------------------------|------------------------------------------|
| `npx @agentwallex/cli@0.1.0 account balance`                                                  | Check main account balance               |
| `npx @agentwallex/cli@0.1.0 account balance --json`                                           | Account balance with JSON output         |
| `npx @agentwallex/cli@0.1.0 account allocate --agent <id> --token <tkn> --amount <amt>`       | Allocate funds to an agent               |
| `npx @agentwallex/cli@0.1.0 account collect --agent <id> --token <tkn> --amount <amt>`        | Collect funds back from an agent         |
| `npx @agentwallex/cli@0.1.0 account deposit --chain <chain> --token <tkn>`                    | Get a deposit address for the account    |
| `npx @agentwallex/cli@0.1.0 balance <agent-id>`                                               | Check agent balance after allocation     |

## Example Session

**User:** Fund agent-a1b2c3d4 with 100 USDC

**Assistant:**

Let me check the account balance first:

```bash
npx @agentwallex/cli@0.1.0 account balance
```

Output:
```
Account Balance:

  Token   Available    Locked
  USDC    1,250.00     0.00
  USDT    500.00       0.00
```

You have 1,250.00 USDC available. Here is the allocation summary:

- **To Agent:** agent-a1b2c3d4
- **Amount:** 100.00 USDC

Shall I proceed?

**User:** Yes

**Assistant:**

```bash
npx @agentwallex/cli@0.1.0 account allocate --agent agent-a1b2c3d4 --token USDC --amount 100
```

Output:
```
Allocation successful.

  Agent:   agent-a1b2c3d4
  Amount:  100.00 USDC
  Status:  completed
```

Let me verify the agent's updated balance:

```bash
npx @agentwallex/cli@0.1.0 balance agent-a1b2c3d4
```

Output:
```
  Chain   Token   Available
  base    USDC    250.00
```

Done. Agent agent-a1b2c3d4 now has 250.00 USDC available (100.00 newly allocated).

## Troubleshooting

| Problem                           | Solution                                                                 |
|-----------------------------------|--------------------------------------------------------------------------|
| `Insufficient account balance`    | Deposit more funds using `account deposit` to get a deposit address.     |
| `Agent not found`                 | Verify the agent ID. List agents with `agents list`.                     |
| `Not connected`                   | Run the `setup-wallet` skill to configure your API key.                  |
| `Invalid token`                   | Use `USDC` or `USDT`. Note Tron only supports USDT.                     |

## Notes

- Allocation moves funds from the main account pool to a specific agent's wallet.
- Collection is the reverse: it moves unspent funds from an agent back to the main account.
- Use `account deposit` to get a blockchain address for receiving external deposits.
- EVM chains (Ethereum, BSC, Base, Polygon) share the same deposit address.
- Deposits may take a few minutes to confirm depending on the blockchain.
- Use `--json` flag for machine-readable output.
