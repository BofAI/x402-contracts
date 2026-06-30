# x402-contracts

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue)](https://soliditylang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Smart contracts for the **x402** payment protocol on **TRON** and **BSC**. Enables gasless, signature-based (EIP-712) payment authorizations and native token settlement.

---

## What is x402?

**[x402](https://www.x402.org/)** is an open, neutral standard for internet-native payments. It brings to life the **HTTP 402 Payment Required** status code so that servers can request payment from clients in a programmatic way—ideal for API paywalls, agent-to-agent payments, and micropayments.

- **Zero protocol fees** — only network fees
- **HTTP-native** — payment flows fit into normal HTTP requests
- **Multi-chain** — this repo provides the **TRON** and **BSC** implementation

---

## Features

- **Permit2-based settlement** — Payers sign a Permit2 signature; a facilitator settles on-chain. No bespoke approval flow.
- **Witness-bound destination** — The payment destination is signed into a Permit2 witness, so a facilitator cannot redirect funds.
- **Gasless for the payer** — The facilitator pays gas; payers can approve Permit2 via an EIP-2612 `permit` in the same transaction.
- **Multiple schemes** — `exact` (fixed amount), `upto` (facilitator settles up to a cap), and `batch-settlement` (escrow-backed payment channels).

---

## Architecture

| Component        | Role                         | File(s)                |
|----------------|------------------------------|-------------------------|
| **x402BasePermit2Proxy** | Shared Permit2 witness-transfer logic | `contracts/x402BasePermit2Proxy.sol` |
| **x402ExactPermit2Proxy** | `exact` scheme — settles the full permitted amount | `contracts/x402ExactPermit2Proxy.sol` |
| **x402UptoPermit2Proxy** | `upto` scheme — facilitator settles up to the cap | `contracts/x402UptoPermit2Proxy.sol` |
| **x402BatchSettlement** | `batch-settlement` scheme — escrow-backed payment channels | `contracts/x402BatchSettlement.sol` |
| **DepositCollector** | Pulls funds into batch-settlement escrow (ERC-3009 / Permit2 variants) | `contracts/periphery/` |

> The original `PaymentPermit` contract is retained under `contracts/legacy/` and is not part of the current deployments.

Flow (exact/upto): **Payer signs** a Permit2 permit + witness (destination, validity) → **Facilitator** calls `settle(...)` (or `settleWithPermit(...)` to bundle an EIP-2612 approval) → the proxy invokes Permit2's `permitWitnessTransferFrom` to pull tokens straight to the destination.

---

## Deployed Addresses

| Network   | Chain / Environment | PaymentPermit Address | x402ExactPermit2Proxy | x402BatchSettlement | x402UptoPermit2Proxy |
|-----------|---------------------|------------------------|------------------------|------------------------|------------------------|
| **TRON Mainnet** | Mainnet              | [`TT8rEWbCoNX7vpEUauxb7rWJsTgs8vDLAn`](https://tronscan.org/#/contract/TT8rEWbCoNX7vpEUauxb7rWJsTgs8vDLAn) | [`TSaZpDMntELqULvLpyrn61JRATfvSpgNuz`](https://tronscan.org/#/contract/TSaZpDMntELqULvLpyrn61JRATfvSpgNuz) | [`TW9yNhTySkEHYfjnGQU2u4NAsdb1tW4fbm`](https://tronscan.org/#/contract/TW9yNhTySkEHYfjnGQU2u4NAsdb1tW4fbm) | [`TK3imNBs3PL3BGKtee9nEcbnNxBtMtequq`](https://tronscan.org/#/contract/TK3imNBs3PL3BGKtee9nEcbnNxBtMtequq) |
| **TRON Nile** | Testnet              | [`TFxDcGvS7zfQrS1YzcCMp673ta2NHHzsiH`](https://nile.tronscan.org/#/contract/TFxDcGvS7zfQrS1YzcCMp673ta2NHHzsiH) | [`TFGoaq2KjizijgjtkVxT7yjffW1A5T1j6F`](https://nile.tronscan.org/#/contract/TFGoaq2KjizijgjtkVxT7yjffW1A5T1j6F) | [`TWBwWHZWwH8TzrZnbxit1J645VGYY1K2fA`](https://nile.tronscan.org/#/contract/TWBwWHZWwH8TzrZnbxit1J645VGYY1K2fA) | [`TKvcqQ7S2bYyys5ZZNpjj9xGiPhiwzHq1K`](https://nile.tronscan.org/#/contract/TKvcqQ7S2bYyys5ZZNpjj9xGiPhiwzHq1K) |
| **TRON Shasta** | Testnet              | [`TR2XninQ3jsvRRLGTifFyUHTBysffooUjt`](https://shasta.tronscan.org/#/contract/TR2XninQ3jsvRRLGTifFyUHTBysffooUjt) | — | — | — |
| **BSC Mainnet** | Mainnet              | [`0x1825bB32db3443dEc2cc7508b2D818fc13EaD878`](https://bscscan.com/address/0x1825bB32db3443dEc2cc7508b2D818fc13EaD878) | [`0x402085c248EeA27D92E8b30b2C58ed07f9E20001`](https://bscscan.com/address/0x402085c248EeA27D92E8b30b2C58ed07f9E20001) | [`0x4020074e9dF2ce1deE5A9C1b5c3f541D02a10003`](https://bscscan.com/address/0x4020074e9dF2ce1deE5A9C1b5c3f541D02a10003) | [`0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002`](https://bscscan.com/address/0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002) |
| **BSC Testnet** | Testnet              | [`0x1825bB32db3443dEc2cc7508b2D818fc13EaD878`](https://testnet.bscscan.com/address/0x1825bB32db3443dEc2cc7508b2D818fc13EaD878) | [`0x402085c248EeA27D92E8b30b2C58ed07f9E20001`](https://testnet.bscscan.com/address/0x402085c248EeA27D92E8b30b2C58ed07f9E20001) | [`0x4020074e9dF2ce1deE5A9C1b5c3f541D02a10003`](https://testnet.bscscan.com/address/0x4020074e9dF2ce1deE5A9C1b5c3f541D02a10003) | [`0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002`](https://testnet.bscscan.com/address/0x4020A4f3b7b90ccA423B9fabCc0CE57C6C240002) |

> BSC proxy/batch contracts use deterministic (CREATE2) addresses shared across EVM chains. Verified on-chain: `x402ExactPermit2Proxy`, `x402UptoPermit2Proxy`, `x402BatchSettlement`, and both deposit collectors are deployed on **both BSC Mainnet and Testnet** at identical CREATE2 addresses.

> **BSC contracts are deployed from [x402-foundation/x402](https://github.com/x402-foundation/x402/tree/main/contracts/evm)** using its CREATE2 deterministic scripts (mined vanity salts, `cbor_metadata = false`). This repository does not deploy BSC contracts — the addresses above are recorded here for reference only.

### Deposit Collectors

| Network   | Chain / Environment | ERC3009DepositCollector | Permit2DepositCollector |
|-----------|---------------------|--------------------------|--------------------------|
| **TRON Mainnet** | Mainnet          | [`TTWA7aWMdx4jfcbp8XRAS2JAd2sUhyF9qj`](https://tronscan.org/#/contract/TTWA7aWMdx4jfcbp8XRAS2JAd2sUhyF9qj) | [`TAg5qqp1K9x5KeSTWnRa8LT79B5HUjzSHY`](https://tronscan.org/#/contract/TAg5qqp1K9x5KeSTWnRa8LT79B5HUjzSHY) |
| **TRON Nile** | Testnet          | [`TJUQ3BQt4YFg8EeevjiUa5LbfSGz5BxzRW`](https://nile.tronscan.org/#/contract/TJUQ3BQt4YFg8EeevjiUa5LbfSGz5BxzRW) | [`TEp6bCqSEKAr99sCiqANC84RtRwx7xGbA4`](https://nile.tronscan.org/#/contract/TEp6bCqSEKAr99sCiqANC84RtRwx7xGbA4) |
| **BSC Mainnet** | Mainnet          | [`0x4020806089470a89826cB9fB1f4059150b550004`](https://bscscan.com/address/0x4020806089470a89826cB9fB1f4059150b550004) | [`0x4020425FAf3B746C082C2f942b4E5159887B0005`](https://bscscan.com/address/0x4020425FAf3B746C082C2f942b4E5159887B0005) |
| **BSC Testnet** | Testnet          | [`0x4020806089470a89826cB9fB1f4059150b550004`](https://testnet.bscscan.com/address/0x4020806089470a89826cB9fB1f4059150b550004) | [`0x4020425FAf3B746C082C2f942b4E5159887B0005`](https://testnet.bscscan.com/address/0x4020425FAf3B746C082C2f942b4E5159887B0005) |

---

## Project Layout

```
├── contracts/
│   ├── x402BasePermit2Proxy.sol   # Shared Permit2 witness-transfer logic
│   ├── x402ExactPermit2Proxy.sol  # exact scheme
│   ├── x402UptoPermit2Proxy.sol   # upto scheme
│   ├── x402BatchSettlement.sol    # batch-settlement payment channels
│   ├── periphery/                 # Deposit collectors (ERC-3009 / Permit2)
│   ├── interfaces/                # ISignatureTransfer, IERC3009, IDepositCollector
│   └── legacy/                    # Retained PaymentPermit (not deployed)
├── deploy/                        # Hardhat deploy scripts (EVM)
├── deployTron/                    # TRON deploy scripts
├── test/
├── hardhat.config.ts
└── foundry.toml
```

---

## Integration

1. **Approve Permit2** — The payer approves the canonical Permit2 contract for the token (once), or supplies an EIP-2612 `permit` so the facilitator can do it inline via `settleWithPermit(...)`.
2. **Sign permit + witness** — Build a Permit2 `PermitTransferFrom` with the proxy as the spender, and a witness binding the destination (`to`), validity (`validAfter`), and—for `upto`—the authorized `facilitator`. Use the target chainId. See each proxy's `WITNESS_TYPEHASH` / `WITNESS_TYPE_STRING`.
3. **Settle on-chain** — The facilitator calls `settle(...)` (or `settleWithPermit(...)`) on the relevant proxy. The proxy validates the witness and pulls tokens to the destination via Permit2.

For batch-settlement (payment channels), see `contracts/x402BatchSettlement.sol` and the collectors in `contracts/periphery/`.

---

## Security

- **Access**: Only the payer’s signature authorizes transfers; the proxies hold no admin keys and cannot move user funds.
- **Destination binding**: The destination is signed into the Permit2 witness, so a facilitator cannot redirect funds.
- **Replay**: Permit2 nonces and the witness `validAfter` window bound replay; batch-settlement channels use cumulative claim amounts and a refund nonce.

We welcome responsible disclosure. Please report issues privately before public disclosure when possible.

---

## License

[MIT](LICENSE). See [LICENSE](LICENSE) for full text.

---

## Contributing

1. Fork the repo and open a branch from `main`.
2. Follow existing style (Solidity ^0.8.20, existing patterns in the `x402*` proxy and settlement contracts).
3. Add or update tests for new behavior.
4. Open a PR with a clear description; maintainers will review.
