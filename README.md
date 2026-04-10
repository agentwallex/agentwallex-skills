# AgentWallex Skills

[Agent Skills](https://agentskills.io) for AI agent financial control. These skills enable AI agents to manage wallets, send payments, set policies, and more using the [`awx`](https://www.npmjs.com/package/@agentwallex/cli) CLI.

## Available Skills

| Skill | Description |
|-------|-------------|
| [setup-wallet](./skills/setup-wallet/SKILL.md) | Configure API key and connect to AgentWallex |
| [create-agent](./skills/create-agent/SKILL.md) | Create an AI agent with a multi-chain wallet |
| [check-balance](./skills/check-balance/SKILL.md) | Check agent wallet or main account balances |
| [send-payment](./skills/send-payment/SKILL.md) | Send USDC/USDT to addresses across 6 chains |
| [fund-agent](./skills/fund-agent/SKILL.md) | Allocate funds from main account to agent wallets |
| [set-policy](./skills/set-policy/SKILL.md) | Configure spending limits, approval thresholds, and auto-funding |
| [approve-transaction](./skills/approve-transaction/SKILL.md) | Review and approve/reject pending transactions |
| [pay-for-service](./skills/pay-for-service/SKILL.md) | Make paid API requests via x402 or MPP protocols |
| [deposit](./skills/deposit/SKILL.md) | Get deposit addresses to receive crypto on any chain |

## Installation

Install with [Vercel's Skills CLI](https://skills.sh):

```bash
npx skills add agentwallex/agentwallex-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

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
