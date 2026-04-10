---
name: send-payment
description: Send USDC or USDT to an address. Use when you or the user wants to send, transfer, pay, or move funds from an agent.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 balance *)
  - Bash(npx @agentwallex/cli@0.1.0 transfer *)
---

# Send Payment Skill

Send USDC or USDT from an agent wallet to a recipient address on a supported blockchain.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- The agent must have sufficient balance on the target chain and token.
- You need: agent ID, recipient address, amount, token, and chain.

## Supported Chains & Tokens

| Chain    | Tokens     | Address Format                   |
|----------|------------|----------------------------------|
| Base     | USDC, USDT | `0x...` (42 characters)          |
| Ethereum | USDC, USDT | `0x...` (42 characters)          |
| BSC      | USDC, USDT | `0x...` (42 characters)          |
| Polygon  | USDC, USDT | `0x...` (42 characters)          |
| Tron     | USDT       | `T...` (34 characters)           |
| Solana   | USDC, USDT | Base58 encoded (32-44 characters) |

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured.

2. **Gather payment details from the user.** You need:
   - **Agent ID** (required): Which agent is sending the payment.
   - **Recipient address** (required): The destination wallet address.
   - **Amount** (required): How much to send (must be a positive number).
   - **Token** (optional): `USDC` or `USDT`. Defaults to `USDC`.
   - **Chain** (optional): Target blockchain. Defaults to the agent's primary chain.

3. **Validate inputs.** Check all inputs against the validation rules below. Do NOT proceed if any validation fails.

4. **Check the agent's balance.** Run `npx @agentwallex/cli@0.1.0 balance <agent-id>` to confirm the available balance covers the payment amount. If insufficient, inform the user and suggest the `fund-agent` or `deposit` skill.

5. **Confirm with the user.** Before sending, display a summary: agent, recipient, amount, token, and chain. Ask the user to confirm. Do NOT send without explicit user confirmation.

6. **Send the payment.** Run `npx @agentwallex/cli@0.1.0 transfer <agent-id> --to <address> --amount <amount> --token <token> --chain <chain>`.

7. **Report the result.** Display the transaction ID, status, and tx hash (when available). If the transaction requires approval (due to a spending policy), inform the user and suggest the `approve-transaction` skill.

## Input Validation

| Field     | Rule                                                              | Example                                      |
|-----------|-------------------------------------------------------------------|----------------------------------------------|
| Agent ID  | Non-empty string                                                  | `agent-a1b2c3d4`                             |
| Address   | EVM: starts with `0x`, 42 chars. Tron: starts with `T`, 34 chars. Solana: Base58, 32-44 chars | `0x1234...abcd` |
| Amount    | Positive number, up to 2 decimal places                           | `10.50`                                      |
| Token     | One of: `USDC`, `USDT`                                           | `USDC`                                       |
| Chain     | One of: base, ethereum, bsc, polygon, tron, solana                | `base`                                       |

- **Never send to zero or null addresses** (e.g., `0x0000...0000`).
- **Verify token is supported on the chain.** Tron only supports USDT.
- **Reject negative or zero amounts.**
- **Flag unusually large amounts** and ask the user to double-check.

## CLI Command Reference

| Command                                                                                              | Description                    |
|------------------------------------------------------------------------------------------------------|--------------------------------|
| `npx @agentwallex/cli@0.1.0 transfer <agent-id> --to <addr> --amount <amt> --token <tkn>`           | Send a payment                 |
| `npx @agentwallex/cli@0.1.0 transfer <agent-id> --to <addr> --amount <amt> --token <tkn> --chain <chain>` | Send on a specific chain |
| `npx @agentwallex/cli@0.1.0 transfer <agent-id> --to <addr> --amount <amt> --json`                  | Send with JSON output          |
| `npx @agentwallex/cli@0.1.0 balance <agent-id>`                                                     | Check balance before sending   |

## Example Session

**User:** Send 25 USDC from agent-a1b2c3d4 to 0xRecipient1234567890abcdef1234567890abcdef

**Assistant:**

Let me check the agent's balance first:

```bash
npx @agentwallex/cli@0.1.0 balance agent-a1b2c3d4
```

Output:
```
  Chain   Token   Available
  base    USDC    150.00
```

The agent has 150.00 USDC available on Base, which is sufficient for a 25.00 USDC transfer.

Here is the payment summary:

- **From:** agent-a1b2c3d4
- **To:** 0xRecipient1234567890abcdef1234567890abcdef
- **Amount:** 25.00 USDC
- **Chain:** base

Shall I proceed?

**User:** Yes

**Assistant:**

```bash
npx @agentwallex/cli@0.1.0 transfer agent-a1b2c3d4 --to 0xRecipient1234567890abcdef1234567890abcdef --amount 25 --token USDC --chain base
```

Output:
```
Transfer submitted.

  Transaction ID: tx-e5f6g7h8
  Amount:         25.00 USDC
  To:             0xRecipient...abcdef
  Chain:          base
  Status:         pending
  TX Hash:        0xabc123...
```

Payment of 25.00 USDC has been submitted. Transaction ID is `tx-e5f6g7h8`. The transfer is currently pending on-chain confirmation.

## Troubleshooting

| Problem                           | Solution                                                                |
|-----------------------------------|-------------------------------------------------------------------------|
| `Insufficient balance`            | Fund the agent using the `fund-agent` or `deposit` skill.               |
| `Invalid address format`          | Check the address matches the chain's format (0x for EVM, T for Tron).  |
| `Transaction requires approval`   | A spending policy requires approval. Use the `approve-transaction` skill.|
| `Transaction failed`              | Check the error message. Common causes: insufficient gas, network congestion. |
| `Not connected`                   | Run the `setup-wallet` skill to configure your API key.                 |

## Notes

- Always check balance before sending to avoid failed transactions.
- Always confirm with the user before executing a transfer.
- Transactions may take a few minutes for on-chain confirmation depending on network congestion.
- If a spending policy is in place, transactions above the approval threshold will be held for review.
- Use `--json` flag for machine-readable output.
