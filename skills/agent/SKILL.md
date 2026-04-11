---
name: agent
description: Create and manage AI agents with multi-chain wallets. Use when you or the user wants to create, list, view, delete, or suspend an agent.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@latest status*)
  - Bash(npx @agentwallex/cli@latest agents *)
---

# Agent Skill

Create and manage AI agents with multi-chain wallets. Each agent gets its own wallet address and can send payments, hold balances, and operate under spending policies.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (all params specified)
awx agents create my-agent --chain base

# Interactive mode (guided prompts)
awx agents create
```

In interactive mode, you will be prompted for:
- Agent name
- Chain selection (base, ethereum, bsc, tron, polygon, solana)

## Supported Chains

| Chain    | Mainnet    | Testnet (Sandbox)  |
|----------|------------|--------------------|
| Base     | `base`     | `base-sepolia`     |
| Ethereum | `ethereum` | `ethereum-sepolia` |
| BSC      | `bsc`      | `bsc-testnet`      |
| Tron     | `tron`     | `tron-nile`        |
| Polygon  | `polygon`  | `polygon-amoy`     |
| Solana   | `solana`   | `solana-devnet`    |

## Steps

### Creating an Agent

1. **Check connection status.** Run `npx @agentwallex/cli@latest status`.

2. **Gather details from the user.** You need:
   - **Name** (required): A descriptive name for the agent (e.g., `research-bot`).
   - **Chain** (required): Which blockchain the agent's wallet will be on.
   - **Description** (optional): What the agent does.

3. **Create the agent.** Run `npx @agentwallex/cli@latest agents create <name> --chain <chain>`.

4. **Report the result.** Show the agent ID, wallet address, and status.

### Listing Agents

Run `npx @agentwallex/cli@latest agents list` to see all agents.

### Getting Agent Details

Run `npx @agentwallex/cli@latest agents get <id>` to see full details.

### Deleting an Agent

Run `npx @agentwallex/cli@latest agents delete <id>`. The CLI will ask for confirmation. Use `-y` to skip.

### Suspending an Agent

Run `npx @agentwallex/cli@latest agents suspend <id>` to temporarily disable an agent.

## Input Validation

| Field       | Rule                                                   | Example         |
|-------------|--------------------------------------------------------|-----------------|
| Name        | Non-empty string, alphanumeric and hyphens             | `research-bot`  |
| Chain       | One of: base, ethereum, bsc, tron, polygon, solana     | `base`          |
| Description | Optional free text                                     | `My research agent` |

## CLI Command Reference

| Command                                                                           | Description              |
|-----------------------------------------------------------------------------------|--------------------------|
| `npx @agentwallex/cli@latest agents list`                                         | List all agents          |
| `npx @agentwallex/cli@latest agents list --json`                                  | List agents (JSON)       |
| `npx @agentwallex/cli@latest agents create <name> --chain <chain>`                | Create a new agent       |
| `npx @agentwallex/cli@latest agents create <name> --chain <chain> --description <desc>` | Create with description |
| `npx @agentwallex/cli@latest agents get <id>`                                     | Get agent details        |
| `npx @agentwallex/cli@latest agents delete <id>`                                  | Delete an agent          |
| `npx @agentwallex/cli@latest agents suspend <id>`                                 | Suspend an agent         |

## Example Session

**User:** Create an agent called research-bot on Base

**Assistant:**

```bash
npx @agentwallex/cli@latest agents create research-bot --chain base
```

Output:
```
Agent "research-bot" created.

  ID:      agt_a1b2c3d4
  Name:    research-bot
  Chain:   base
  Status:  active
  Wallet:  0x1234...abcd
  Created: 2026-04-10T12:00:00Z
```

Agent `research-bot` has been created with wallet address `0x1234...abcd` on Base. You can now fund it using the `fund` skill and send payments using the `send` skill.

## Troubleshooting

| Problem                      | Solution                                                          |
|------------------------------|-------------------------------------------------------------------|
| `Not connected`              | Run the `setup` skill to configure your API key.                  |
| `Agent name already exists`  | Choose a different name or delete the existing agent first.       |
| `Invalid chain`              | Use one of: base, ethereum, bsc, tron, polygon, solana.           |

## Notes

- Each agent has its own isolated wallet and balance.
- Agents can be suspended to temporarily prevent transactions.
- Deleting an agent is permanent. Collect any remaining funds first using the `fund` skill.
- Use `--json` flag for machine-readable output.
