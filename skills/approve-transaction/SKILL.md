---
name: approve-transaction
description: Review and approve or reject pending transactions. Use when you or the user wants to approve, reject, review pending transactions, or when a transaction requires human approval.
user-invocable: true
disable-model-invocation: false
allowed-tools:
  - Bash(npx @agentwallex/cli@0.1.0 status*)
  - Bash(npx @agentwallex/cli@0.1.0 approvals *)
---

# Approve Transaction Skill

Review, approve, or reject transactions that are pending human approval due to spending policies.

## Prerequisites

- AgentWallex must be configured (run the `setup-wallet` skill first if not connected).
- A spending policy must be in place for the agent (use the `set-policy` skill to create one).
- There must be pending approval requests.

## When This Skill Is Triggered

Transactions require approval when:
- The transaction amount exceeds the agent's `approval-threshold` policy.
- A manual review policy is configured for the agent.
- The transaction is flagged by a risk rule.

## Steps

1. **Check connection status.** Run `npx @agentwallex/cli@0.1.0 status` to verify AgentWallex is configured.

2. **List pending approvals.** Run `npx @agentwallex/cli@0.1.0 approvals list --status pending` to see all transactions awaiting review.

3. **Display approval details.** For each pending item, show:
   - Approval ID
   - Agent name and ID
   - Transaction amount and token
   - Recipient address
   - Chain
   - Reason for approval (e.g., "exceeds threshold of 100.00")
   - Timestamp

4. **Ask the user for a decision.** For each pending approval, ask whether to approve or reject.

5. **Execute the decision.**
   - To approve: `npx @agentwallex/cli@0.1.0 approvals approve <approval-id>`
   - To reject: `npx @agentwallex/cli@0.1.0 approvals reject <approval-id> --note "<reason>"`

6. **Report the result.** Confirm the action was taken and show the updated status. If approved, the transaction will proceed to on-chain execution.

## Input Validation

| Field        | Rule                                   | Example                 |
|--------------|----------------------------------------|-------------------------|
| Approval ID  | Non-empty string                       | `apr-m1n2o3p4`          |
| Reject note  | Optional free-text explaining reason   | `Amount too high`       |

- Always provide a note when rejecting so there is an audit trail.
- Do not approve transactions without showing the details to the user first.

## CLI Command Reference

| Command                                                                      | Description                        |
|------------------------------------------------------------------------------|------------------------------------|
| `npx @agentwallex/cli@0.1.0 approvals list --status pending`                | List pending approvals             |
| `npx @agentwallex/cli@0.1.0 approvals list --status approved`               | List approved approvals            |
| `npx @agentwallex/cli@0.1.0 approvals list --status rejected`               | List rejected approvals            |
| `npx @agentwallex/cli@0.1.0 approvals list --agent <agent-id>`              | List approvals for a specific agent|
| `npx @agentwallex/cli@0.1.0 approvals approve <approval-id>`                | Approve a pending transaction      |
| `npx @agentwallex/cli@0.1.0 approvals reject <approval-id> --note "<note>"` | Reject with a reason               |
| `npx @agentwallex/cli@0.1.0 approvals list --json`                          | List approvals with JSON output    |

## Example Session

**User:** Are there any pending transactions to approve?

**Assistant:**

Let me check for pending approvals:

```bash
npx @agentwallex/cli@0.1.0 approvals list --status pending
```

Output:
```
Pending Approvals (2):

  ID              Agent              Amount      To                    Reason
  apr-m1n2o3p4    payment-bot        150.00 USDC 0xRecip...abcd        Exceeds threshold (100.00)
  apr-q5r6s7t8    invoice-processor  75.00 USDT  TAddress...1234       Exceeds threshold (50.00)
```

You have 2 pending approvals:

1. **apr-m1n2o3p4** — 150.00 USDC from payment-bot to 0xRecip...abcd (exceeds 100.00 threshold)
2. **apr-q5r6s7t8** — 75.00 USDT from invoice-processor to TAddress...1234 (exceeds 50.00 threshold)

Would you like to approve or reject these?

**User:** Approve the first one and reject the second — the amount seems wrong

**Assistant:**

Approving the first:

```bash
npx @agentwallex/cli@0.1.0 approvals approve apr-m1n2o3p4
```

Output:
```
Approval apr-m1n2o3p4: approved
Transaction tx-e5f6g7h8 is now processing.
```

Rejecting the second:

```bash
npx @agentwallex/cli@0.1.0 approvals reject apr-q5r6s7t8 --note "Amount seems incorrect, needs review"
```

Output:
```
Approval apr-q5r6s7t8: rejected
Note: Amount seems incorrect, needs review
```

Done. The 150.00 USDC transfer from payment-bot has been approved and is processing. The 75.00 USDT transfer from invoice-processor has been rejected.

## Troubleshooting

| Problem                      | Solution                                                               |
|------------------------------|------------------------------------------------------------------------|
| `No pending approvals`       | There are no transactions waiting for review. New ones will appear when transactions exceed policy thresholds. |
| `Approval not found`         | Verify the approval ID. It may have already been approved or rejected. |
| `Not connected`              | Run the `setup-wallet` skill to configure your API key.                |
| `Permission denied`          | Only account owners can approve transactions. Check your API key scope.|

## Notes

- Approved transactions proceed to on-chain execution immediately.
- Rejected transactions are cancelled and funds are unlocked back to the agent's available balance.
- Always provide a reason note when rejecting for audit purposes.
- Approvals are time-sensitive; pending approvals that are not acted on may expire based on account settings.
- Use `--json` flag for machine-readable output.
- Use `--agent <agent-id>` to filter approvals for a specific agent.
