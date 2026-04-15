---
name: cards
description: Create and manage virtual cards for AI agents. Use when you or the user wants to issue a virtual card, create a debit card, freeze a card, view card details, or check card transactions.
user-invocable: true
disable-model-invocation: false
allowed-tools: ["Bash(npx @agentwallex/cli@0.9.0 cards *)", "Bash(npx @agentwallex/cli@0.9.0 status*)"]
---

# Agent Virtual Cards

Issue virtual Visa cards for AI agents. Each card is tied to an agent's balance and controlled by the Policy Engine.

## Confirm wallet is connected

```bash
npx @agentwallex/cli@0.9.0 status
```

If not configured, refer to the `setup` skill.

## Issue a Card

```bash
# Interactive mode
npx @agentwallex/cli@0.9.0 cards create <agent-id>

# Direct mode
npx @agentwallex/cli@0.9.0 cards create <agent-id> --limit 500 --tag "AWS"
```

The first time you issue a card, you'll be asked to set up cardholder information (name, address) for KYC verification. This only happens once.

## View Cards

```bash
npx @agentwallex/cli@0.9.0 cards list <agent-id>
```

## View Card Details (Number + CVV)

```bash
npx @agentwallex/cli@0.9.0 cards details <card-id>
```

You'll be asked to confirm before sensitive card data is revealed. Details are shown for 30 seconds.

## Freeze / Unfreeze / Cancel

```bash
npx @agentwallex/cli@0.9.0 cards freeze <card-id>
npx @agentwallex/cli@0.9.0 cards unfreeze <card-id>
npx @agentwallex/cli@0.9.0 cards cancel <card-id>
```

## Card Transactions

```bash
npx @agentwallex/cli@0.9.0 cards transactions <card-id>
```

## How Funding Works

- Card spending is deducted from the **agent's balance** (same pool as x402 and Stripe payments)
- If auto-topup is enabled, the agent's balance is automatically replenished from the main account
- Policy Engine limits (daily/monthly/per-tx/approval) apply uniformly across all payment methods

## Input Validation

| Field | Format | Example |
|-------|--------|---------|
| agent-id | UUID | `agt_8f2k4p1abc123` |
| card-id | UUID | `card_3x9m7q2def456` |
| --limit | Positive number | `500`, `1000.50` |
| --tag | String, max 100 chars | `"AWS"`, `"SaaS subscriptions"` |

## CLI Commands

| Command | Purpose |
|---------|---------|
| `npx @agentwallex/cli@0.9.0 cards create <agent-id>` | Issue a virtual card |
| `npx @agentwallex/cli@0.9.0 cards list <agent-id>` | List agent's cards |
| `npx @agentwallex/cli@0.9.0 cards details <card-id>` | Reveal card number + CVV |
| `npx @agentwallex/cli@0.9.0 cards freeze <card-id>` | Temporarily freeze card |
| `npx @agentwallex/cli@0.9.0 cards unfreeze <card-id>` | Reactivate frozen card |
| `npx @agentwallex/cli@0.9.0 cards cancel <card-id>` | Permanently cancel card |
| `npx @agentwallex/cli@0.9.0 cards transactions <card-id>` | View card transactions |

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Cardholder not found" | Run `cards create` to set up cardholder info first |
| "Card issuing disabled" | Contact admin to enable card issuing for your account |
| "Insufficient balance" | Top up the agent's balance: `awx account allocate --agent <id>` |
| "KYC verification required" | Complete the cardholder setup with valid information |
