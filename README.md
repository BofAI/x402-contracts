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

- **EIP-712 typed permits** — Users sign payment details off-chain; a relayer or backend calls `permitTransferFrom` with the signature.
- **Gasless for the signer** — The submitter pays gas; the signer only needs a one-time `approve` of the PaymentPermit contract.
- **Optional fee** — Permit can include `feeTo` and `feeAmount` for protocol or facilitator fees.
- **Replay protection** — Nonce bitmap per owner; time window via `validAfter` / `validBefore`.

---

## Architecture

| Component        | Role                         | File(s)                |
|----------------|------------------------------|-------------------------|
| **PaymentPermit** | Entry point for permits and transfers | `contracts/PaymentPermit.sol` |
| **PermitHash** | EIP-712 struct hashes        | `contracts/libraries/PermitHash.sol` |
| **EIP712**     | Domain separator and typed data hashing | `contracts/EIP712.sol` |
| **IPaymentPermit** | Structs and interface for permits | `contracts/interface/IPaymentPermit.sol` |

Flow: **User signs** `PaymentPermitDetails` (payment, fee, validity, nonce) → **Relayer/backend** calls `permitTransferFrom(permit, transferDetails, owner, signature)` → Contract pulls tokens from `owner` to `payTo` (and optional `feeTo`) in one shot.

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
│   ├── PaymentPermit.sol      # Main permit & transfer logic
│   ├── EIP712.sol             # EIP-712 domain and hashing
│   ├── interface/
│   │   ├── IPaymentPermit.sol # Permit structs and interface
│   │   └── IEIP712.sol
│   └── libraries/
│       └── PermitHash.sol     # TypeHashes and struct hashes
├── deploy/                    # Hardhat deploy scripts
├── test/
│   ├── PaymentPermit.t.sol    # Forge/Hardhat tests
│   └── MockERC20.sol
├── hardhat.config.ts
├── foundry.toml
└── AGENTS.md                  # Guidelines for AI/agent use of this repo
```

---

## Integration

1. **Domain & types** — Use the same EIP-712 domain name `"PaymentPermit"` and the struct definitions from `IPaymentPermit.sol` and `PermitHash.sol` so that hashes match the contract. Domain separator uses `block.chainid` and contract address (see `EIP712.sol`).
2. **ChainId for signing** — When building EIP-712 typed data, use the chainId of the target network so the signature matches the contract. Wallet/TronLink must use the same chainId.
3. **Sign off-chain** — Build `PaymentPermitDetails` (meta, buyer, caller, payment, fee, delivery), hash with `PermitHash` and domain separator, then sign (e.g. 65-byte `r || s || v`).
4. **Submit on-chain** — Call `permitTransferFrom(permit, transferDetails, owner, signature)`. The `owner` must have approved the PaymentPermit contract for the `payToken` (and have sufficient balance for `amount` plus optional `feeAmount`).

For full struct and field definitions, see `contracts/interface/IPaymentPermit.sol`.

---

## Security

- **Access**: Only the signer’s signature authorizes transfers; no single admin can move user funds.
- **Replay**: Nonces and `validAfter`/`validBefore` limit replay across chains and time.

We welcome responsible disclosure. Please report issues privately before public disclosure when possible.

---

## License

[MIT](LICENSE). See [LICENSE](LICENSE) for full text.

---

## Contributing

1. Fork the repo and open a branch from `main`.
2. Follow existing style (Solidity ^0.8.20, existing patterns in `PaymentPermit.sol` and `PermitHash.sol`).
3. Add or update tests for new behavior.
4. Open a PR with a clear description; maintainers will review.

For agent/AI usage of this codebase, see [AGENTS.md](AGENTS.md).
