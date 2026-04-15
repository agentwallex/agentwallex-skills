# AgentWallex Skills

[Agent Skills](https://agentskills.io) for AI agent financial control. These skills enable AI agents to manage wallets, send payments, set policies, and more using the [`awx`](https://www.npmjs.com/package/@agentwallex/cli) CLI.

## Available Skills

| Skill | Description |
|-------|-------------|
| [setup](./skills/setup/SKILL.md) | Configure API key and connect to AgentWallex |
| [agent](./skills/agent/SKILL.md) | Create and manage AI agents with multi-chain wallets |
| [balance](./skills/balance/SKILL.md) | Check balances for an agent or the main account (by chain + token) |
| [topup](./skills/topup/SKILL.md) | Get deposit addresses to receive crypto (select chain + token) |
| [send](./skills/send/SKILL.md) | Send payment from an agent (select chain + token + address + amount) |
| [fund](./skills/fund/SKILL.md) | Allocate or collect funds between main account and agents |
| [policy](./skills/policy/SKILL.md) | Set spending limits, approval thresholds, and approve/reject transactions |
| [pay](./skills/pay/SKILL.md) | Make paid API calls via x402 or MPP protocol |
| [cards](./skills/cards/SKILL.md) | Issue and manage virtual cards for AI agents |

## Installation

Install with [Vercel's Skills CLI](https://skills.sh):

```bash
npx skills add agentwallex/agentwallex-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

All `awx` commands support **interactive mode** -- running a command without arguments enters a step-by-step guided flow. For example:

```bash
# Direct mode (all params specified)
awx send --agent agt_xxx --to 0x1a2b --chain base --token USDC --amount 10

# Interactive mode (guided prompts)
awx send
```

**Examples:**

```text
Set up my AgentWallex wallet
```

```text
Create an agent called research-bot on Base
```

```text
Send 10 USDC to 0x1a2b...3c4d from my research-bot
```

```text
Set a $500 daily spending limit on research-bot
```

## Supported Chains

| Chain | Mainnet | Testnet |
|-------|---------|---------|
| Base | ✅ | Base Sepolia |
| Ethereum | ✅ | Sepolia |
| BNB Chain | ✅ | BSC Testnet |
| Tron | ✅ | Nile |
| Polygon | ✅ | Amoy |
| Solana | ✅ | Devnet |

## Supported Protocols

| Protocol | Description |
|----------|-------------|
| x402 | HTTP 402 micropayments for agent-to-agent transactions |
| MPP | Machine Payments Protocol with Stripe and multi-method support |
| Stripe SPT | Fiat payments via credit/debit card binding |

## License

MIT
