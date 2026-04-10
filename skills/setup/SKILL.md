---
name: setup
description: Configure API key and connect to AgentWallex. Use when you or the user wants to set up, configure, connect, or initialize AgentWallex, or when any operation fails with authentication errors.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 login*)
  - Bash(npx @agentwallex/cli@0.1.0 status*)
---

# Setup Skill

Configure your AgentWallex API key and verify the connection. This is the first step before using any other AgentWallex skill.

## Prerequisites

- Node.js 18+ installed
- An AgentWallex account at https://app.agentwallex.com (production) or https://app-sandbox.agentwallex.com (sandbox)
- An API key from the dashboard (starts with `awk_`)

## Interactive Mode

All `awx` commands support **interactive mode**. Running a command without arguments enters a step-by-step guided flow:

```bash
# Direct mode (all params specified)
awx login --api-key awk_sk_live_abc123

# Interactive mode (guided prompts)
awx login
```

## Steps

1. **Check current connection status.** Run `npx @agentwallex/cli@0.1.0 status` to see if AgentWallex is already configured. If the output shows `connected: true`, you are already set up. If not, proceed to step 2.

2. **Gather the API key from the user.** Ask the user for their AgentWallex API key. The key must start with `awk_`. Do NOT proceed if the key format is invalid.

3. **Log in with the API key.** Run `npx @agentwallex/cli@0.1.0 login --api-key <KEY>` to authenticate. The CLI will validate the key and store it locally.

4. **Verify the connection.** Run `npx @agentwallex/cli@0.1.0 status` to confirm the connection is active. The output should show `connected: true` and display the account name.

5. **Report the result.** Tell the user whether setup succeeded or failed. If it failed, suggest they check their API key or visit the dashboard to generate a new one.

## Input Validation

| Field   | Rule                                      | Example           |
|---------|-------------------------------------------|-------------------|
| API key | Must start with `awk_` and be non-empty   | `awk_sk_live_abc` |

- Reject any key that does not match the `awk_` prefix.
- Do not store or echo the full API key in conversation output. Mask all but the first 8 characters.

## CLI Command Reference

| Command                                              | Description                          |
|------------------------------------------------------|--------------------------------------|
| `npx @agentwallex/cli@0.1.0 login --api-key <KEY>`  | Authenticate with an API key         |
| `npx @agentwallex/cli@0.1.0 status`                 | Check connection status              |
| `npx @agentwallex/cli@0.1.0 status --json`          | Check status with JSON output        |

## Example Session

**User:** Set up AgentWallex with my API key awk_sk_live_abc123

**Assistant:**

I will configure AgentWallex with your API key.

```bash
npx @agentwallex/cli@0.1.0 login --api-key awk_sk_live_abc123
```

Login successful. Let me verify the connection:

```bash
npx @agentwallex/cli@0.1.0 status
```

Output:
```
Connected: true
Account: My Company
Environment: production
```

AgentWallex is configured and connected. You can now create agents, check balances, and send payments.

## Troubleshooting

| Problem                          | Solution                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| `Invalid API key format`         | Ensure the key starts with `awk_`. Generate a new key from the dashboard.|
| `Authentication failed`          | The key may be expired or revoked. Create a new key in the dashboard.    |
| `Network error`                  | Check your internet connection. The CLI connects to AgentWallex servers. |
| `npx: command not found`         | Install Node.js 18+ which includes npx.                                  |

## Notes

- Credentials are stored locally at `~/.agentwallex/config.json` with owner-only permissions (0600).
- Use `--json` flag on any command to get machine-readable JSON output.
- Sandbox keys start with `awk_sk_test_`, production keys with `awk_sk_live_`.
- If any other skill fails with an authentication error, come back to this skill to reconfigure.
