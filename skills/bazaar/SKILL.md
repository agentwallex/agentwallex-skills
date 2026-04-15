---
name: bazaar
description: Search for and call paid API services on the x402 Bazaar. Use when you or the user wants to find a paid API, discover services, search for data feeds, or make a paid API request.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.1 status*)
  - Bash(npx @agentwallex/cli@0.1.1 bazaar *)
---

# Bazaar Skill

Search for and call paid API services on the x402 Bazaar. The Bazaar is an open directory of machine-payable API endpoints that accept x402 or MPP payments.

## How Bazaar Works

The x402 Bazaar automatically indexes paid API services across the web. Services register their endpoints with pricing metadata, and the Bazaar provides semantic search to discover them. When you find a service, you can call it directly -- AgentWallex handles the payment negotiation automatically.

Key concepts:
- **Automatic indexing**: Services that implement x402 or MPP are crawled and indexed.
- **Semantic search**: Search by description, use case, or keyword -- not just exact URL matching.
- **Multi-network**: Services accept payments on different blockchain networks (Base, Ethereum, etc.).
- **Auto-payment**: When calling a service, AgentWallex detects the payment protocol and handles it.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).
- An agent with sufficient balance is required to call paid services.

## Interactive Mode

All `awx bazaar` commands support **interactive mode**. Running a command without required arguments enters a step-by-step guided flow.

- `awx bazaar search` without a query prompts for one (or press Enter to browse all).
- `awx bazaar call <url>` without `--agent` prompts for agent selection from your available agents.

## Commands

### Search the Bazaar

```bash
npx @agentwallex/cli@0.1.1 bazaar search [query] [options]
```

**Options:**
| Flag              | Description                          |
|-------------------|--------------------------------------|
| `--network <net>` | Filter by blockchain network         |
| `--max-price <n>` | Maximum USD price                    |
| `--limit <n>`     | Number of results to return          |
| `--json`          | Output as JSON                       |

**Examples:**

```bash
# Search for weather data APIs
npx @agentwallex/cli@0.1.1 bazaar search "weather data"

# Find cheap services on Base network
npx @agentwallex/cli@0.1.1 bazaar search --network base --max-price 0.10

# Browse all services as JSON
npx @agentwallex/cli@0.1.1 bazaar search --json

# Search for AI inference endpoints
npx @agentwallex/cli@0.1.1 bazaar search "AI inference" --limit 5
```

### Call a Bazaar Service

```bash
npx @agentwallex/cli@0.1.1 bazaar call <url> [options]
```

**Options:**
| Flag               | Description                                   |
|--------------------|-----------------------------------------------|
| `--agent <id>`     | Agent ID to pay with                          |
| `--method <type>`  | Payment method: `x402`, `mpp`, or `auto`      |
| `--json`           | Output as JSON                                |

**Examples:**

```bash
# Call a service with a specific agent
npx @agentwallex/cli@0.1.1 bazaar call "https://api.example.com/data" --agent agt_a1b2c3d4

# Call using x402 protocol explicitly
npx @agentwallex/cli@0.1.1 bazaar call "https://api.example.com/data" --agent agt_a1b2c3d4 --method x402

# Interactive mode -- prompts for agent selection
npx @agentwallex/cli@0.1.1 bazaar call "https://api.example.com/data"
```

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status` to verify AgentWallex is configured.

2. **Search for services.** Use `npx @agentwallex/cli@0.1.1 bazaar search` with a query describing what you need.

3. **Review results.** Look at the URL, price, network, and description columns to pick a service.

4. **Call the service.** Use `npx @agentwallex/cli@0.1.1 bazaar call <url> --agent <id>` to make the paid request.

5. **Show the response.** Display the data returned by the paid service.

6. **Report the cost.** Note the amount paid and remaining balance.

## Input Validation

| Field    | Rule                                | Example                                |
|----------|-------------------------------------|----------------------------------------|
| URL      | Valid HTTP/HTTPS URL                | `https://api.example.com/data`         |
| Agent ID | Non-empty string                    | `agt_a1b2c3d4`                         |
| Method   | One of: x402, mpp, auto            | `auto`                                 |
| Query    | Any string (semantic search)        | `"weather forecast"`                   |

- Verify the URL is a valid HTTPS endpoint before calling.
- Check agent balance is sufficient before initiating paid requests.

## Example Session

**User:** Find me a stock price API on the Bazaar and call it.

**Assistant:**

Let me search the Bazaar for stock price services:

```bash
npx @agentwallex/cli@0.1.1 bazaar search "stock price"
```

Output:
```
Found 3 service(s) (showing 3):

 URL                                         Price        Network  Description
 https://api.stocks402.com/v1/quote          0.01 USDC   base     Real-time stock quotes
 https://market-data.example.com/price       0.05 USDC   base     Historical + real-time prices
 https://finance-api.example.com/ticker      0.02 USDC   ethereum Stock ticker data
```

The cheapest option is `https://api.stocks402.com/v1/quote` at 0.01 USDC on Base. Let me check your agent's balance and call it:

```bash
npx @agentwallex/cli@0.1.1 bazaar call "https://api.stocks402.com/v1/quote" --agent agt_a1b2c3d4
```

Output:
```
 Field          Value
 status         success
 amount_paid    0.01 USDC
 network        base
 response       {"symbol":"AAPL","price":187.42,"currency":"USD","timestamp":"2025-01-15T10:30:00Z"}
```

The call succeeded. 0.01 USDC was paid on Base. Apple (AAPL) is currently trading at $187.42.

## Troubleshooting

| Problem                        | Solution                                                         |
|--------------------------------|------------------------------------------------------------------|
| `No services found`           | Try broader search terms or remove filters.                      |
| `Insufficient balance`        | Fund the agent using the `fund` or `topup` skill.                |
| `Payment rejected`            | Verify the agent has balance on the correct network.             |
| `Not connected`               | Run the `setup` skill to configure your API key.                 |
| `Service unavailable`         | The service endpoint may be down. Try again later.               |

## Notes

- The Bazaar indexes services automatically -- no manual registration is needed for service providers who implement x402.
- Prices are set by service providers and may vary.
- Use `--json` flag on CLI commands for machine-readable output.
- The `auto` payment method (default) detects whether the service uses x402 or MPP and handles it accordingly.
