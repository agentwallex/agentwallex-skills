---
name: create-agent
description: Create a new AI agent with a multi-chain wallet. Use when you or the user wants to create, set up, or initialize a new agent.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 agents *)
---

# Create Agent Skill

Create a new AI agent with its own dedicated wallet on a supported blockchain network.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- You need to know which blockchain the agent should operate on.

## Supported Chains

| Chain    | Mainnet        | Testnet (Sandbox)  | Supported Tokens |
|----------|----------------|--------------------|------------------|
| Base     | `base`         | `base-sepolia`     | USDC, USDT       |
| Ethereum | `ethereum`     | `ethereum-sepolia` | USDC, USDT       |
| BSC      | `bsc`          | `bsc-testnet`      | USDC, USDT       |
| Polygon  | `polygon`      | `polygon-amoy`     | USDC, USDT       |
| Tron     | `tron`         | `tron-nile`        | USDT             |
| Solana   | `solana`       | `solana-devnet`    | USDC, USDT       |

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured. If not connected, direct the user to the `setup-wallet` skill.

2. **Gather agent details from the user.** You need:
   - **Name** (required): A descriptive name for the agent (e.g., `payment-bot`, `invoice-processor`).
   - **Chain** (required): The blockchain network. Default to `base` if the user does not specify.
   - **Description** (optional): What the agent does.

3. **Create the agent.** Run `npx @agentwallex/cli@0.1.0 agents create <name> --chain <chain>` with optional `--description "<desc>"`.

4. **Show the result.** Display the agent ID, name, chain, wallet address, and status. Remind the user to save the agent ID for future operations.

5. **Suggest next steps.** Recommend the user fund the agent via the `fund-agent` or `deposit` skill.

## Input Validation

| Field       | Rule                                               | Example            |
|-------------|----------------------------------------------------|--------------------|
| Name        | Non-empty string, alphanumeric and hyphens only    | `payment-bot`      |
| Chain       | One of: base, ethereum, bsc, polygon, tron, solana | `base`             |
| Description | Optional free-text string                          | `Handles invoices` |

- If the user provides an invalid chain, show the list of supported chains and ask them to choose.
- Default to `base` if no chain is specified.

## CLI Command Reference

| Command                                                                      | Description                      |
|------------------------------------------------------------------------------|----------------------------------|
| `npx @agentwallex/cli@0.1.0 agents create <name> --chain <chain>`           | Create a new agent               |
| `npx @agentwallex/cli@0.1.0 agents create <name> --chain <chain> --description "<desc>"` | Create with description |
| `npx @agentwallex/cli@0.1.0 agents list`                                    | List all agents                  |
| `npx @agentwallex/cli@0.1.0 agents get <agent-id>`                          | Get agent details                |
| `npx @agentwallex/cli@0.1.0 agents list --json`                             | List agents with JSON output     |
| `npx @agentwallex/cli@0.1.0 agents delete <agent-id>`                       | Delete an agent                  |

## Example Session

**User:** Create a new agent called payment-bot on Base

**Assistant:**

Let me verify the connection first:

```bash
npx @agentwallex/cli@0.1.0 status
```

Connected. Now creating the agent:

```bash
npx @agentwallex/cli@0.1.0 agents create payment-bot --chain base
```

Output:
```
Agent created successfully.

  Agent ID:       agent-a1b2c3d4
  Name:           payment-bot
  Chain:          base
  Status:         active
  Wallet Address: 0x1234...abcd
  Created:        2026-04-10T12:00:00Z
```

Your agent `payment-bot` is ready on Base. Save the agent ID `agent-a1b2c3d4` for future operations. To fund this agent, use the `fund-agent` or `deposit` skill.

## Troubleshooting

| Problem                        | Solution                                                                 |
|--------------------------------|--------------------------------------------------------------------------|
| `Not connected`                | Run the `setup-wallet` skill to configure your API key.                  |
| `Agent name already exists`    | Choose a different name or list existing agents with `agents list`.      |
| `Invalid chain`                | Use one of: base, ethereum, bsc, polygon, tron, solana.                  |
| `Rate limit exceeded`          | Wait a moment and retry.                                                 |

## Notes

- Each agent gets its own dedicated wallet address on the specified chain.
- EVM chains (Ethereum, BSC, Base, Polygon) share the same address format (`0x...`).
- Tron addresses start with `T`, Solana addresses are Base58 encoded.
- Use `--json` flag for machine-readable output.
- Agents are created in `active` status by default.
