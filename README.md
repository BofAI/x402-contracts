# x402-contracts

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Smart contracts for the **x402** payment protocol on **TRON** and **BSC**. Enables gasless, [Permit2](https://github.com/Uniswap/permit2)-based payment settlement with cryptographic destination binding via the EIP-712 witness pattern.

---

## What is x402?

**[x402](https://www.x402.org/)** is an open, neutral standard for internet-native payments. It brings to life the **HTTP 402 Payment Required** status code so that servers can request payment from clients in a programmatic way—ideal for API paywalls, agent-to-agent payments, and micropayments.

- **Zero protocol fees** — only network fees
- **HTTP-native** — payment flows fit into normal HTTP requests
- **Multi-chain** — this repo provides the **TRON** and **BSC** implementation

---

## Features

- **Permit2-powered transfers** — Leverages Sunswap's Permit2 contract as the transfer authority. Signers only need a one-time `approve` to Permit2.
- **Witness-bound destination** — The payment destination (`to`), authorized `facilitator`, and `validAfter` are cryptographically committed in the Permit2 witness, preventing any party from redirecting funds.
- **Gasless for the signer** — The facilitator submits the transaction and pays gas; the payer only signs off-chain.
- **Two settlement modes** — `x402ExactPermit2Proxy` always transfers the exact signed amount; `x402UptoPermit2Proxy` allows the facilitator to settle any amount up to the permitted maximum.
- **Optional EIP-2612 one-shot flow** — `settleWithPermit()` bundles an EIP-2612 `permit()` call with settlement, enabling a fully gasless single-transaction flow for supported tokens.
- **Replay protection** — Permit2's unordered nonce bitmap combined with a `deadline` and `validAfter` window prevents replay across chains and time.
- **Reentrancy safe** — All entry points inherit OpenZeppelin's `ReentrancyGuard`.

---

## Architecture

| Component | Role | File(s) |
|---|---|---|
| **x402BasePermit2Proxy** | Abstract base: shared settlement logic, witness validation, EIP-2612 permit handling | `contracts/x402BasePermit2Proxy.sol` |
| **x402ExactPermit2Proxy** | Concrete proxy: always transfers the **exact** permitted amount | `contracts/x402ExactPermit2Proxy.sol` |
| **x402UptoPermit2Proxy** | Concrete proxy: facilitator chooses amount **up to** the permitted maximum | `contracts/x402UptoPermit2Proxy.sol` |
| **ISignatureTransfer** | Permit2 interface (witness variant) | `contracts/interfaces/ISignatureTransfer.sol` |

**Settlement flow:**

```
Payer signs Permit2 message
  └─ permitted: { token, amount }
  └─ witness:   { to, facilitator, validAfter }
  └─ deadline (upper time bound, enforced by Permit2)

Facilitator calls settle() / settleWithPermit()
  └─ Proxy validates: facilitator == msg.sender, block.timestamp >= validAfter
  └─ Permit2.permitWitnessTransferFrom() pulls tokens from payer → to
```

> The **witness** pattern cryptographically binds the destination (`to`) and the authorized caller (`facilitator`) inside the payer's signature, so neither Permit2 nor the proxy can redirect funds.

---

## Deployed Addresses

| Network   | Chain / Environment | x402ExactPermit2Proxy Address |
|-----------|---------------------|------------------------|
| **TRON Mainnet** | Mainnet              | [`TSm6MSWHHBeABh22uqX7SU7QUweav4Cyy6`](https://tronscan.org/#/contract/TSm6MSWHHBeABh22uqX7SU7QUweav4Cyy6) |
| **TRON Nile** | Testnet              | [`TCd2ZSwbJBAdgFfP5d3gkhKcGs47WNZLLi`](https://nile.tronscan.org/#/contract/TCd2ZSwbJBAdgFfP5d3gkhKcGs47WNZLLi) |

| Network   | Chain / Environment | x402UptoPermit2Proxy Address |
|-----------|---------------------|------------------------|
| **TRON Mainnet** | Mainnet              | [`TGHEYAovw8fZz1bgnVgRtgrdGLbagFZYq5`](https://tronscan.org/#/contract/TGHEYAovw8fZz1bgnVgRtgrdGLbagFZYq5) |
| **TRON Nile** | Testnet              | [`TSForFRqxmZdJ6Yfx2rNaFykhuQLc9cTMR`](https://nile.tronscan.org/#/contract/TSForFRqxmZdJ6Yfx2rNaFykhuQLc9cTMR) |


| Network   | Chain / Environment | x402ExactPermit2Proxy Address |
|-----------|---------------------|------------------------|
| **BSC Mainnet** | Mainnet              | [`0xEe38Ec718255fe78e9D16aCC0e1183C731679b23`](https://bscscan.com/address/0xEe38Ec718255fe78e9D16aCC0e1183C731679b23) |
| **BSC Testnet** | Testnet              | [`0xEe38Ec718255fe78e9D16aCC0e1183C731679b23`](https://testnet.bscscan.com/address/0xEe38Ec718255fe78e9D16aCC0e1183C731679b23) |

| Network   | Chain / Environment | x402UptoPermit2Proxy Address |
|-----------|---------------------|------------------------|
| **BSC Mainnet** | Mainnet              | [`0x2b30Ed9F37c7C21ae8779c5753B1cCf264DfD63C`](https://bscscan.com/address/0x2b30Ed9F37c7C21ae8779c5753B1cCf264DfD63C) |
| **BSC Testnet** | Testnet              | [`0x2b30Ed9F37c7C21ae8779c5753B1cCf264DfD63C`](https://testnet.bscscan.com/address/0x2b30Ed9F37c7C21ae8779c5753B1cCf264DfD63C) |

---

## Project Layout

```
├── contracts/
│   ├── x402BasePermit2Proxy.sol    # Base contract: core permit & transfer logic
│   ├── x402ExactPermit2Proxy.sol   # Exact-amount payment proxy
│   ├── x402UptoPermit2Proxy.sol    # Up-to-amount payment proxy
│   └── interfaces/
│       └── ISignatureTransfer.sol  # Permit2 signature transfer interface
├── deploy/                         # Hardhat deploy scripts (BSC / EVM chains)
│   ├── deploy_x402ExactPermit2Proxy.ts
│   └── deploy_x402UptoPermit2Proxy.ts
├── deployTron/                     # Hardhat deploy scripts (TRON)
│   ├── deploy_x402ExactPermit2Proxy.ts
│   └── deploy_x402UptoPermit2Proxy.ts
├── test/
│   ├── PaymentPermit.t.sol         # Forge tests
│   └── MockERC20.sol               # Mock token for testing
├── scripts/
│   └── postinstall.sh              # Post-install setup script
├── hardhat.config.ts
├── foundry.toml
├── package.json
├── tsconfig.json
└── AGENTS.md                       # Guidelines for AI/agent use of this repo
```

---

## Integration

1. **Approve Permit2 once** — The payer calls `token.approve(PERMIT2_ADDRESS, type(uint256).max)` once. The canonical Permit2 address is `0x000000000022D473030F116dDEE9F6B43aC78BA3` on all EVM chains.

2. **Choose a proxy** — Pick the proxy that fits your use case:
   - `x402ExactPermit2Proxy` — amount is fixed at signing time (similar to EIP-3009).
   - `x402UptoPermit2Proxy` — facilitator can settle any amount ≤ signed maximum (useful for dynamic pricing).

3. **Build and sign the Permit2 message off-chain** — Construct an EIP-712 typed-data object with:
   - `PermitTransferFrom`: `{ permitted: { token, amount }, nonce, deadline }`
   - `Witness`: `{ to, facilitator, validAfter }` (the `WITNESS_TYPE_STRING` is defined in `x402BasePermit2Proxy.sol`)
   - Domain: Permit2's own domain (not the proxy's), using the target chain's `chainId`.

4. **Settle on-chain** — The facilitator calls:
   ```solidity
   // Standard path (Permit2 approval already exists)
   proxy.settle(permit, [amount,] owner, witness, signature);

   // EIP-2612 one-shot path (bundles token permit + settlement)
   proxy.settleWithPermit(permit2612, permit, [amount,] owner, witness, signature);
   ```
   `msg.sender` must equal `witness.facilitator`, and `block.timestamp` must be ≥ `witness.validAfter`.

For struct definitions, see `contracts/x402BasePermit2Proxy.sol` and `contracts/interfaces/ISignatureTransfer.sol`.

---

## Security

- **No admin keys** — There are no owner or upgrade functions. Only a valid payer signature can authorize a transfer.
- **Facilitator binding** — The `facilitator` address is embedded in the EIP-712 witness; only that exact address can call `settle()`, preventing frontrunning or griefing by third parties.
- **Replay protection** — Permit2's unordered nonce bitmap ensures each signature is spent exactly once; `deadline` and `validAfter` enforce the valid time window.
- **Reentrancy guard** — All external functions are protected by OpenZeppelin's `ReentrancyGuard`.
- **Destination immutability** — The `to` address is part of the witness; it cannot be changed after signing.

We welcome responsible disclosure. Please report issues privately before public disclosure when possible.

---

## License

[MIT](LICENSE). See [LICENSE](LICENSE) for full text.

---

## Contributing

1. Fork the repo and open a branch from `main`.
2. Follow existing style (Solidity `^0.8.20`, patterns in `x402BasePermit2Proxy.sol`).
3. Add or update tests under `test/` for any new behavior.
4. Run `forge test` and `npx hardhat test` before submitting.
5. Open a PR with a clear description; maintainers will review.

For agent/AI usage of this codebase, see [AGENTS.md](AGENTS.md).
