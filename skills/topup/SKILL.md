---
name: topup
description: Get deposit addresses to receive crypto on any supported chain and token. Use when you or the user wants to deposit, receive funds, get a wallet address, or top up with crypto.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.1 status*)
  - Bash(npx @agentwallex/cli@0.1.1 topup*)
  - Bash(npx @agentwallex/cli@0.1.1 account deposit*)
  - Bash(npx @agentwallex/cli@0.1.1 account balance*)
  - Bash(npx @agentwallex/cli@0.1.1 balance *)
---

# Topup Skill

Get a deposit address to receive crypto into your AgentWallex account. Select a chain and token, then send funds to the provided address.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (all params specified)
awx topup --chain base --token USDC

# Interactive mode (guided prompts)
awx topup
```

In interactive mode, you will be prompted for:
- Chain selection (base, ethereum, bsc, tron, polygon, solana)
- Token selection (USDC / USDT)

## Supported Chains & Tokens

| Chain    | Mainnet    | Testnet (Sandbox)  | Supported Tokens | Address Format                    |
|----------|------------|--------------------|------------------|-----------------------------------|
| Base     | `base`     | `base-sepolia`     | USDC, USDT       | `0x...` (42 characters)           |
| Ethereum | `ethereum` | `ethereum-sepolia` | USDC, USDT       | `0x...` (42 characters)           |
| BSC      | `bsc`      | `bsc-testnet`      | USDC, USDT       | `0x...` (42 characters)           |
| Polygon  | `polygon`  | `polygon-amoy`     | USDC, USDT       | `0x...` (42 characters)           |
| Tron     | `tron`     | `tron-nile`        | USDT             | `T...` (34 characters)            |
| Solana   | `solana`   | `solana-devnet`    | USDC, USDT       | Base58 encoded (32-44 characters) |

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status` to verify AgentWallex is configured.

2. **Determine the chain and token.** Ask the user:
   - **Chain** (required): Which blockchain to receive funds on. Default to `base` if not specified.
   - **Token** (optional): `USDC` or `USDT`. Default to `USDC`.

3. **Get the deposit address.** Run `npx @agentwallex/cli@0.1.1 topup --chain <chain> --token <token>` (or `npx @agentwallex/cli@0.1.1 account deposit --chain <chain> --token <token>`).

4. **Display the deposit address.** Show the address clearly and remind the user:
   - Only send the specified token on the specified chain.
   - Sending the wrong token or using the wrong chain may result in lost funds.
   - Deposits may take a few minutes to confirm on-chain.

5. **Optionally check balance after deposit.** The user can verify funds arrived by running `npx @agentwallex/cli@0.1.1 account balance`.

## Input Validation

| Field | Rule                                               | Example    |
|-------|-----------------------------------------------------|------------|
| Chain | One of: base, ethereum, bsc, polygon, tron, solana  | `base`     |
| Token | One of: `USDC`, `USDT`                              | `USDC`     |

- Tron only supports USDT. If the user asks for USDC on Tron, inform them it is not supported.
- Default to `base` for chain and `USDC` for token if not specified.

## CLI Command Reference

| Command                                                                     | Description                          |
|-----------------------------------------------------------------------------|--------------------------------------|
| `npx @agentwallex/cli@0.1.1 topup --chain <chain> --token <tkn>`           | Get a deposit address                |
| `npx @agentwallex/cli@0.1.1 topup --chain <chain> --json`                  | Get deposit address with JSON output |
| `npx @agentwallex/cli@0.1.1 account balance`                               | Check account balance after deposit  |

## Example Session

**User:** I want to deposit USDC into my account

**Assistant:**

Which chain would you like to deposit on? Supported chains: Base, Ethereum, BSC, Polygon, Solana. (Tron supports USDT only.)

**User:** Base

**Assistant:**

```bash
npx @agentwallex/cli@0.1.1 topup --chain base --token USDC
```

Output:
```
Deposit Address:

  Chain:    base
  Token:    USDC
  Address:  0x1234567890abcdef1234567890abcdef12345678
```

Send USDC on the **Base** network to this address:

**`0x1234567890abcdef1234567890abcdef12345678`**

Important reminders:
- Only send **USDC** on the **Base** network to this address.
- Sending a different token or using a different chain may result in lost funds.
- Deposits typically confirm within a few minutes.

## Troubleshooting

| Problem                              | Solution                                                                    |
|--------------------------------------|-----------------------------------------------------------------------------|
| Balance not showing after deposit    | On-chain confirmations may take a few minutes. Wait and check again.        |
| Sent wrong token to address          | Contact support. Funds sent as the wrong token may require manual recovery. |
| Sent on wrong chain                  | Contact support. Cross-chain recovery may not be possible.                  |
| `Not connected`                      | Run the `setup` skill to configure your API key.                            |
| `USDC not supported on Tron`         | Tron only supports USDT. Use a different chain for USDC.                    |

## Notes

- EVM chains (Ethereum, BSC, Base, Polygon) share the same deposit address.
- Tron and Solana have unique deposit addresses separate from EVM chains.
- Deposits are credited to the main account balance. Use the `fund` skill to allocate funds to specific agents.
- For sandbox/testing, use testnet faucets to get test tokens.
- Use `--json` flag for machine-readable output.
- Always double-check the chain and token before sending. Blockchain transactions are irreversible.
