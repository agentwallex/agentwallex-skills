---
name: pay
description: Make paid API calls via x402 or MPP protocol. Use when you or the user wants to call a paid API, make an x402 request, pay for a service, or access a paid endpoint.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.1 status*)
  - Bash(npx @agentwallex/cli@0.1.1 balance *)
  - Bash(curl *)
---

# Pay Skill

Make paid API requests using the x402 or MPP (Machine Payments Protocol) protocols. When an HTTP endpoint returns a 402 Payment Required response, AgentWallex can automatically handle the payment and retry the request.

## Prerequisites

- AgentWallex must be configured (run the `setup` skill first if not connected).
- The agent must have sufficient balance to cover the payment.
- The target endpoint must support x402 or MPP protocol.

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow. For the pay skill, the CLI guides you through identifying the paid endpoint and selecting the agent to pay with.

## How x402 Works

1. You make an HTTP request to a paid endpoint.
2. The server returns `HTTP 402 Payment Required` with payment details in the response headers.
3. AgentWallex reads the payment requirements (amount, token, recipient, chain).
4. AgentWallex creates and signs a payment, attaching it to the request header.
5. The request is retried with the payment proof, and the server returns the paid content.

## Supported Payment Protocols

| Protocol | Description                                                   | Header               |
|----------|---------------------------------------------------------------|-----------------------|
| **x402** | HTTP 402-based machine-to-machine payment for API monetization | `X-PAYMENT`          |
| **MPP**  | Machine Payments Protocol for autonomous agent negotiation     | `X-MPP-PAYMENT`      |

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.1 status` to verify AgentWallex is configured.

2. **Check the agent's balance.** Run `npx @agentwallex/cli@0.1.1 balance <agent-id>` to ensure sufficient funds.

3. **Identify the paid endpoint.** The user should provide:
   - **URL** (required): The paid API endpoint.
   - **Method** (optional): HTTP method, defaults to GET.
   - **Agent ID** (required): Which agent pays for the request.
   - **Body** (optional): Request body for POST/PUT requests.

4. **Make the request with x402 support.** Use curl with the AgentWallex payment headers:

   ```bash
   curl -s -X GET "<url>" \
     -H "X-AGENTWALLEX-AGENT-ID: <agent-id>" \
     -H "X-AGENTWALLEX-API-KEY: <api-key>"
   ```

   The AgentWallex SDK handles the 402 flow automatically when integrated into applications.

5. **Show the response.** Display the paid content returned by the API.

6. **Report the cost.** Show how much was paid and the remaining balance.

## Input Validation

| Field    | Rule                                         | Example                              |
|----------|----------------------------------------------|--------------------------------------|
| URL      | Valid HTTP/HTTPS URL                          | `https://api.example.com/data`       |
| Agent ID | Non-empty string                             | `agt_a1b2c3d4`                       |
| Method   | One of: GET, POST, PUT, DELETE                | `GET`                                |

- Verify the URL is a valid HTTPS endpoint before making requests.
- Check agent balance is sufficient before initiating paid requests.

## CLI Command Reference

| Command                                                       | Description                          |
|---------------------------------------------------------------|--------------------------------------|
| `npx @agentwallex/cli@0.1.1 status`                          | Verify connection                    |
| `npx @agentwallex/cli@0.1.1 balance <agent-id>`              | Check balance before paying          |
| `curl -s -i "<url>"`                                          | Test if an endpoint returns 402      |

## Example Session

**User:** Call the paid API at https://api.example.com/premium-data using agt_a1b2c3d4

**Assistant:**

Let me check the agent's balance first:

```bash
npx @agentwallex/cli@0.1.1 balance agt_a1b2c3d4
```

Output:
```
  Chain   Available
  base    150.00
```

The agent has 150.00 USDC available. Let me test the endpoint:

```bash
curl -s -i "https://api.example.com/premium-data"
```

Output:
```
HTTP/2 402
x-payment-required: {"amount":"0.05","token":"USDC","chain":"base","recipient":"0xServiceProvider..."}

{"error": "Payment required", "amount": "0.05 USDC"}
```

This endpoint requires a payment of 0.05 USDC on Base. In a real application using the AgentWallex SDK, this payment would be handled automatically. The SDK:

1. Detects the 402 response.
2. Creates a payment of 0.05 USDC to the service provider.
3. Attaches the payment proof to the `X-PAYMENT` header.
4. Retries the request, receiving the paid content.

To integrate x402 payments in your application, use the `@agentwallex/sdk` package:

```javascript
import { AgentWallex } from '@agentwallex/sdk';

const aw = new AgentWallex({ apiKey: 'awk_...' });
const response = await aw.httpClient.get('https://api.example.com/premium-data', {
  agentId: 'agt_a1b2c3d4',
  enableX402: true,
});
```

## Troubleshooting

| Problem                           | Solution                                                                 |
|-----------------------------------|--------------------------------------------------------------------------|
| `Insufficient balance`            | Fund the agent using the `fund` or `topup` skill.                        |
| `Endpoint does not return 402`    | The endpoint may not support x402. Check with the API provider.          |
| `Payment rejected by server`      | Verify the agent has sufficient balance on the correct chain and token.  |
| `Not connected`                   | Run the `setup` skill to configure your API key.                         |
| `Unsupported payment protocol`    | AgentWallex supports x402 and MPP. Other protocols are not supported.    |

## Notes

- x402 payments are designed for machine-to-machine API monetization.
- The payment is atomic: you only pay if the server accepts and returns content.
- Payment amounts are typically small (micro-payments for API calls).
- The AgentWallex SDK (`@agentwallex/sdk`) handles the full 402 flow automatically.
- MPP (Machine Payments Protocol) works similarly but uses a different negotiation header.
- Use `--json` flag on CLI commands for machine-readable output.
