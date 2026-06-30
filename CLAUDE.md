# CLAUDE.md

Guidance for AI agents working in this repo. For protocol/architecture overview, see [README.md](README.md).

## What this repo deploys

The current, deployed contracts are the x402 Permit2 proxies and batch-settlement:

- `contracts/x402ExactPermit2Proxy.sol` — `exact` scheme
- `contracts/x402UptoPermit2Proxy.sol` — `upto` scheme
- `contracts/x402BatchSettlement.sol` — `batch-settlement` payment channels
- `contracts/periphery/` — deposit collectors (ERC-3009 / Permit2)

## Guardrails (read before changing contracts)

- **Do not touch `contracts/legacy/`.** It holds the old `PaymentPermit` design; it is retained for reference and is not deployed. Don't wire new code to it.
- **BSC is not deployed from this repo.** BSC contracts come from [`x402-foundation/x402`](https://github.com/x402-foundation/x402/tree/main/contracts/evm) via its CREATE2 scripts; this repo only records the addresses (see README). Do not add or edit BSC deploy logic here.
- **Preserve CREATE2 determinism.** These contracts are expected at identical addresses across chains. Keep constructor args identical on every chain (e.g. the canonical Permit2 address) — any change to initCode changes the deployed address.
- **TRON USDT transfers use `sun-contract-std`'s `SafeTransferLib`**, because TRON USDT does not return a bool. Use it for token transfers rather than a raw `transfer`.
- **Transient storage required.** Contracts use `ReentrancyGuardTransient` (EIP-1153); only deploy on chains that support transient storage.

## Build & test

```bash
npm run compile        # hardhat compile (or: forge build)
npm test               # hardhat test
npm run test-foundry   # forge test -vvv
npm run coverage       # hardhat coverage
```

Forge tests live in `test/` (`*.t.sol`, plus `*.fork.t.sol` fork tests and `*.gas.t.sol`).

## Deployment

- TRON deploy scripts: `deployTron/` (run via `npm run deploy` / `deploy-nile` / `deploy-shasta`).
- Networks are configured in `hardhat.config.ts` (`tron`, `nile`, `shasta`, `bscTestnet`).
- Recorded addresses live in `deployments/` and the README address tables — update both when deploying.
