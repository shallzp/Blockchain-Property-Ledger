# Blockchain Property Ledger (PropChain)

> A decentralized property registration and marketplace application built with Solidity, Truffle, Ganache, React, and MetaMask.

## Project Overview

Blockchain Property Ledger, branded as **PropChain**, is a full-stack decentralized application (DApp) for managing property records and property sales on an Ethereum-compatible blockchain.

The application separates responsibilities among three wallet-based roles:

- **Citizens/Users** can register, submit identity details for verification, add property records, browse the marketplace, list owned properties for sale, send purchase offers, and use the UI for accepted-purchase payment.
- **Regional Administrators** verify registered users and approve or reject property registrations assigned to their revenue department.
- **The Main Administrator** initializes the system, manages regional administrators and revenue-department mappings, and reviews on-chain transaction activity.

Identity and property data are stored in Solidity smart contracts rather than in a traditional backend database. Aadhaar PDF documents are uploaded to Pinata/IPFS and the returned IPFS CID is stored on-chain. The React frontend reads and writes blockchain state through Web3 and MetaMask.

## Key Features

### Wallet and Role Management

- MetaMask wallet connection and account-change handling
- Automatic contract loading from the active Ganache network
- On-chain role detection for Main Administrator, Regional Admin, and User
- Registration flow for wallets that do not yet exist in `UserRegistry`
- Pending-verification screen for unverified users
- Route protection based on wallet role and verification state

### User Registration and Profiles

- Registration form for name, date of birth, Aadhaar number, address, email, and Aadhaar PDF
- 12-digit Aadhaar input validation
- PDF-only uploads with a 10 MB maximum size
- Pinata/IPFS upload support
- IPFS CID stored as `aadharFileHash` in `UserRegistry`
- Profile viewing and profile updates for last name, address, and email

### Property Registration

- Property registration with location ID, revenue department ID, survey number, and area
- Property records owned by the submitting wallet
- Property states: Registered, Verified, On Sale, Sale Requested, Sale Approved, and Pending Transfer
- Pending-property queue for the mapped regional/revenue-department employee
- Property verification and rejection functions

### Property Marketplace

- Browse all properties or filter by verified/on-sale state
- Search and filter properties by title, location, survey number, property ID, owner, price, or area
- List a verified property for sale at an ETH-denominated price
- Cancel an active sale
- Send purchase offers to an active sale
- View sales created by an owner
- View purchase requests sent by a buyer
- Seller acceptance of a buyer offer
- Buyer payment UI and ownership-transfer contract workflow (the interface requires verification for current source compatibility)

### Administration

- Main Administrator dashboard with system counts
- Regional administrator promotion and removal
- Revenue department ID-to-employee mapping
- Regional Admin dashboard for pending KYC and property verification
- Main Administrator audit screen that reads past contract events
- Transaction search by hash, address, type, event, or contract name

## Tech Stack

| Area | Technology |
|---|---|
| Smart contracts | Solidity `^0.8.21` |
| Contract development | Truffle/Mocha, Ganache |
| Ethereum JavaScript library | Web3.js `^4.16.0` |
| Wallet | MetaMask (`window.ethereum`) |
| Frontend | React `^19.1.1`, React DOM |
| Routing | React Router DOM `^7.9.3` |
| Build tool | Vite `^7.1.7` |
| Styling | Tailwind CSS `^4.1.14` via `@tailwindcss/vite` |
| Icons | Lucide React |
| HTTP requests | Axios |
| Document storage | Pinata/IPFS |
| Contract artifacts | Truffle JSON ABI artifacts |
| Testing | Truffle test runner and JavaScript/Mocha assertions |

## Project Architecture

```text
MetaMask
   |
   | eth_requestAccounts / contract transactions
   v
React/Vite Frontend
   |
   +--> Web3Context
   |      - initializes Web3
   |      - maintains wallet/account/network state
   |      - creates contract instances
   |
   +--> Custom Hooks
   |      - useUserRegistry
   |      - usePropertyRegistry
   |      - usePropertyExchange
   |      - useTransactionAudit
   |
   v
Ethereum-compatible blockchain (Ganache locally)
   |
   +--> UserRegistry
   +--> PropertyRegistry
   |      +--> internally deployed PropertyLedger
   +--> PropertyExchange

Pinata/IPFS  <-->  Aadhaar PDF upload utility
```

The `Web3Context` loads compiled contract ABIs and network addresses. `PropertyRegistry` provides a public façade for property operations and creates an internal `PropertyLedger` instance during deployment. `PropertyExchange` holds sale state and interacts with the same `PropertyLedger` instance through `PropertyRegistry`.

This project has no REST API server or conventional SQL/MongoDB database. State changes are Ethereum transactions, and reads are contract calls or past blockchain event queries. No server-side authentication is used; authorization is derived from the connected wallet and contract roles/modifiers.

## Project Directory Structure

```text
property-ledger/
|-- README.md
|-- truffle-config.js          # Truffle networks, compiler, and artifact output
|-- contracts/                 # Solidity smart contracts
|   |-- Migrations.sol
|   |-- AuditMonitor.sol
|   |-- PropertyLedger.sol
|   |-- PropertyRegistry.sol
|   |-- PropertyExchange.sol
|   `-- UserRegistry.sol
|-- migrations/
|   |-- 1_initial_migration.js
|   `-- 2_deploy_contracts.js
|-- test/
|   `-- registry.test.js       # Property registry contract tests
|-- client/
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- eslint.config.js
|   |-- index.html
|   |-- .env                   # Local Vite/Pinata configuration (not committed)
|   |-- public/
|   |   `-- Logo.png
|   `-- src/
|       |-- main.jsx           # React entry point
|       |-- App.jsx            # Route definitions
|       |-- index.css
|       |-- assets/
|       |   `-- backdrop.jpg
|       |-- components/
|       |   |-- AuthWrapper.jsx
|       |   |-- FormInput.jsx
|       |   |-- Navbar.jsx
|       |   |-- PendingVerification.jsx
|       |   `-- PropertyCard.jsx
|       |-- context/
|       |   `-- Web3Context.jsx
|       |-- contracts/         # Generated Truffle artifacts
|       |-- hooks/
|       |   |-- useUserRegistry.js
|       |   |-- usePropertyRegistry.js
|       |   |-- usePropertyExchange.js
|       |   `-- useTransactionAudit.js
|       |-- pages/
|       |   |-- Landing.jsx
|       |   |-- Registration.jsx
|       |   |-- Profile.jsx
|       |   |-- UserDashboard.jsx
|       |   |-- Properties.jsx
|       |   |-- AddProperty.jsx
|       |   |-- Explore.jsx
|       |   |-- Requests.jsx
|       |   |-- Requested.jsx
|       |   |-- MainAdminDashboard.jsx
|       |   |-- ManageAdmin.jsx
|       |   |-- AuditMonitor.jsx
|       |   |-- AdminDashboard.jsx
|       |   |-- VerifyUsers.jsx
|       |   `-- VerifyProperty.jsx
|       `-- utils/
|           `-- ipfsUpload.js
```

## Application Workflow

### 1. Application Startup

1. `client/src/main.jsx` mounts React inside `#root`.
2. `Web3Provider` is installed above the application router.
3. The provider checks for `window.ethereum` and initializes Web3 with MetaMask.
4. It obtains the active network ID and account list.
5. It loads `UserRegistry`, `PropertyRegistry`, and `PropertyExchange` artifacts from `client/src/contracts`.
6. It obtains `PropertyLedger`'s address from `PropertyRegistry.getPropertiesContract()`.
7. It creates Web3 contract instances for all loaded contracts.

### 2. Landing and Wallet Connection

The landing page presents the PropChain information and public system statistics. A visitor connects MetaMask from the UI. The application watches account and chain changes and reloads state when the chain changes.

### 3. Registration and Verification

1. If the wallet is not registered in `UserRegistry`, the user is sent to `/register`.
2. The user enters profile details and selects a PDF Aadhaar document.
3. The frontend validates the form and uploads the PDF to Pinata/IPFS.
4. The IPFS CID is sent to `UserRegistry.registerUser` with the wallet as `msg.sender`.
5. The contract stores a normal `User` role with `verified = false`.
6. A Regional Admin views pending users and calls `verifyUser`.
7. Once verified, the user can access role-protected routes.

### 4. Property Registration

1. A verified user opens **Add Property**.
2. The frontend submits location ID, revenue department ID, survey number, and area to `PropertyRegistry.addLand`.
3. `PropertyRegistry` creates the record in the internally deployed `PropertyLedger`.
4. The property becomes state `Registered` and is assigned to the property owner.
5. The revenue-department employee mapped to that department verifies or rejects it.
6. Verification changes the property state to `Verified`.

### 5. Sale and Purchase

1. An owner lists a verified property by calling `PropertyExchange.addPropertyOnSale` and providing an ETH-denominated price.
2. The sale is stored in `PropertyExchange`, while `PropertyLedger` state changes to `On Sale`.
3. A buyer browses or searches properties and sends an offer for an active sale.
4. The offer is recorded in both the exchange and ledger request structures.
5. The owner reviews request(s) and accepts a buyer/offer pair.
6. The accepted request receives a five-minute payment deadline.
7. The buyer pays the exact accepted price; successful payment is intended to transfer the `PropertyLedger` owner and reset the sale state.

## Core Modules and Components

### `Web3Context`

The central state provider for wallet and contract integration. It maintains the connected account, wallet balance, network ID/name, contract instances, contract addresses, loading state, and connection errors.

### `AuthWrapper`

Determines access to protected routes from blockchain state. It checks registration, role, verification, and route prefix. It supports three role-specific navigation sets:

- `/user/*` for Citizens
- `/admin/*` for Regional Admins
- `/main/*` for the Main Administrator

### Registration and Identity Hooks

`useUserRegistry` wraps user registration, profile updates, verification, role checks, regional-admin management, and user statistics.

### Property Registry Hooks

`usePropertyRegistry` wraps property creation and reads, owner/department queries, verification/rejection, department mappings, counts, and property-state lists.

### Exchange Hooks

`usePropertyExchange` wraps listing, purchase requests, seller acceptance, cancellation, owner/buyer views, location sales, and ownership payment/transfer calls.

### Audit Hook

`useTransactionAudit` queries past events across `UserRegistry`, `PropertyRegistry`, and `PropertyExchange`. It combines events with block timestamps and exposes transaction hashes, block numbers, event arguments, actors, contract names, and status in the audit UI.

### UI Pages

- `Landing`: public overview and system statistics
- `Registration`: citizen registration and IPFS upload
- `UserDashboard`: citizen summary and quick actions
- `Profile`: wallet and profile details
- `Properties`: owned property management and sale controls
- `AddProperty`: property registration form
- `Explore`: marketplace search and purchase offers
- `Requests`: incoming sale requests for owners
- `Requested`: outgoing requests and payment for buyers
- `AdminDashboard`: regional-admin summary
- `VerifyUsers`: regional-user verification queue
- `VerifyProperty`: regional-property verification queue
- `MainAdminDashboard`: system-wide statistics
- `ManageAdmin`: regional-admin and revenue-department management
- `AuditMonitor`: searchable blockchain event history

## Database Design

There is no conventional database. Smart contracts provide the persistent data model:

| Contract/state | Purpose |
|---|---|
| `UserRegistry.users[address]` | User profile, role, verification status, and counters |
| `UserRegistry.registeredUsers[address]` | Whether a wallet has completed registration |
| `UserRegistry.aadharNumbers[string]` | Aadhaar-number uniqueness mapping |
| `UserRegistry.regionalAdmins[address]` | Regional administrator membership |
| `PropertyLedger.lands[propertyId]` | Property ownership, location, survey, area, value, state, and sale requests |
| `PropertyRegistry.propertiesOfOwner[address]` | Property IDs owned by a wallet |
| `PropertyRegistry.propertiesControlledByRevenueDept[id]` | Property IDs assigned to a department |
| `PropertyRegistry.revenueDeptIdToEmployee[id]` | Revenue department-to-regional-admin mapping |
| `PropertyExchange.sales[]` | Sale records and accepted-buyer/payment state |
| `PropertyExchange.requestedUsers[saleId]` | Buyers who requested a specific sale |
| `PropertyExchange.requestedSales[address]` | Sale IDs requested by a buyer |

IPFS stores Aadhaar PDF content externally. Only the Pinata-returned CID is persisted in `UserRegistry`.

### Important Solidity State Types

**Property state**

| ID | State | Meaning |
|---:|---|---|
| 0 | Registered | Submitted and awaiting verification |
| 1 | Verified | Approved by the revenue-department employee |
| 2 | On Sale | Listed by the owner |
| 3 | Sale Requested | A buyer has requested a purchase |
| 4 | Sale Approved | An owner has accepted a buyer |
| 5 | Pending Transfer | Ownership transfer is in progress |

**User role values**

| Enum ID | UI role |
|---:|---|
| 0 | Main Administrator |
| 1 | Regional Admin |
| 2 | User |

## API Documentation

This project does not expose HTTP REST endpoints. The “API” is the ABI of the deployed smart contracts, called directly from the React hooks.

### `UserRegistry`

| Method | Access | Purpose |
|---|---|---|
| `registerUser(...)` | Registered wallet | Create a normal user profile |
| `updateUserProfile(...)` | Registered wallet | Update last name, address, and email |
| `getUserDetails(address)` | Public view | Read and format a user's profile |
| `verifyUser(address)` | Verified Regional Admin | Verify a normal user |
| `rejectUser(address)` | Not present in the current `UserRegistry.sol` source | Referenced only by a frontend hook; no contract implementation is currently verified |
| `addRegionalAdmin(address)` | Main Administrator | Promote a registered user |
| `removeRegionalAdmin(address)` | Main Administrator | Revert an admin to normal user role |
| `getPendingUserVerifications()` | Public view | List unverified normal users |
| `getAllRegionalAdmins()` | Public view | List current regional admins |

### `PropertyRegistry`

| Method | Access | Purpose |
|---|---|---|
| `addLand(...)` | Public | Create a property owned by `msg.sender` |
| `getPropertyDetails(id)` | Public view | Read one property |
| `getPropertiesOfOwner(address)` | Public view | List an owner's properties |
| `getPropertiesByRevenueDeptId(id)` | Public view | List department properties |
| `verifyProperty(id)` | Mapped department employee | Change state to Verified |
| `rejectProperty(id)` | Mapped department employee | Remove/reject a pending property |
| `mapRevenueDeptIdToEmployee(id,address)` | Contract owner/Main account | Set department ownership |
| `getAllProperties()` | Public view | List every property |
| `getPendingPropertiesForVerification()` | Public view | List Registered properties |
| `getVerifiedProperties()` | Public view | List Verified properties |
| `getOnSaleProperties()` | Public view | List properties currently for sale |

### `PropertyExchange`

| Method | Access | Purpose |
|---|---|---|
| `addPropertyOnSale(id, price)` | Property owner | Create an active sale |
| `sendPurchaseRequest(saleId, price)` | Wallet | Add a purchase offer |
| `acceptBuyerRequest(saleId,buyer,price)` | Property owner | Accept an exact buyer offer |
| `transferOwnerShip(saleId)` payable | Accepted buyer | Pay accepted price and complete ownership transfer |
| `cancelSaleBySeller(saleId)` | Property owner | Cancel an active, unpaid sale |
| `getMySales(address)` | Public view | Sales created by an owner |
| `getRequestedSales(address)` | Public view | Sales requested by a buyer |
| `getSalesByLocation(locationId)` | Public view | Sales in a location |

Contract method names use Solidity ABI conventions and are called by Web3 as `.methods.methodName(...).call()` or `.send({ from, value })`.

## Installation and Setup

### Prerequisites

- **Node.js** and **npm**
- **MetaMask** browser extension
- **Ganache** GUI or CLI
- **Truffle** CLI available globally or through `npx`
- Optional: a Pinata account and credentials for Aadhaar PDF uploads

### 1. Start Ganache

Use Ganache with the following network settings:

```text
RPC Host: 127.0.0.1
RPC Port: 7545
Network ID: *
```

Keep the same account list stable for each migration because `2_deploy_contracts.js` uses Ganache accounts by index and includes fixed extra test-wallet addresses.

### 2. Install Truffle/Contract Tools

No root `package.json` is present, so install Truffle in the environment if it is not already available:

```powershell
npm install --global truffle
```

### 3. Compile and Deploy Contracts

From the repository root:

```powershell
truffle compile
truffle migrate --reset --network development
```

`truffle-config.js` uses Solidity `0.8.21`, saves contract artifacts in `client/src/contracts`, and targets Ganache at `127.0.0.1:7545`.

### 4. Install the Frontend

```powershell
cd client
npm install
```

### 5. Configure Pinata

Create `client/.env` if it does not exist. The project already ignores environment files.

```dotenv
# Preferred browser configuration supported by the upload utility:
VITE_PINATA_JWT=your_pinata_jwt

# Alternative credential pair, if JWT is not used:
# VITE_PINATA_API_KEY=your_pinata_api_key
# VITE_PINATA_SECRET_KEY=your_pinata_api_secret
```

Because Vite exposes `VITE_*` values to browser code, do not use privileged production secrets or share them publicly. A Pinata JWT/API credential is visible to anyone who can inspect the frontend bundle.

### 6. Run the Frontend

```powershell
cd client
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

### 7. Connect MetaMask

1. Add Ganache RPC network ID `5777` or `1337` as applicable.
2. Import a Ganache account through its private key.
3. Use account 0 as the Main Administrator if the contracts were just migrated.
4. The migration can create account 1 as a verified Regional Admin.
5. Connect MetaMask to the site and approve the wallet prompt.

## Environment Variables and Configuration

| Variable | Required | Purpose |
|---|---:|---|
| `VITE_PINATA_JWT` | No; one credential method is required for uploads | Pinata bearer authentication |
| `VITE_PINATA_API_KEY` | Alternative | Pinata API key |
| `VITE_PINATA_SECRET_KEY` | Alternative | Pinata API secret |

The Pinata utility accepts either the JWT or API-key/secret pair. If neither is configured, registration document upload fails before the blockchain registration transaction is submitted.

Other runtime configuration is currently fixed in source:

- Ganache host/port: `127.0.0.1:7545`
- Solidity compiler: `0.8.21`
- Contract build output: `client/src/contracts`
- Pinata file endpoint: `https://api.pinata.cloud/pinning/pinFileToIPFS`
- Maximum Aadhaar PDF size: `10 MB`
- Buyer payment deadline: `5 minutes` in `PropertyExchange`

## How to Build and Run

### Development

```powershell
cd client
npm run dev
```

### Production Build

```powershell
cd client
npm run build
npm run preview
```

The Vite build is generated in `client/dist`.

### Compile and Migrate Contracts

```powershell
truffle compile
truffle migrate --reset --network development
```

After migration, Truffle updates the ABI JSON files and network deployment metadata consumed by `Web3Context`.

## Testing

The available contract test suite is:

```text
test/registry.test.js
```

Run it against Ganache from the repository root:

```powershell
truffle test --network development
```

The test suite covers contract deployment, internal `PropertyLedger` deployment, revenue-department mappings, property creation and ownership lists, verification/rejection authorization, and state changes. It uses Ganache accounts and does not contain a frontend test runner configuration.

Frontend linting is available:

```powershell
cd client
npm run lint
```

## Troubleshooting

### MetaMask Reports `Contracts not deployed on network`

Make sure Ganache is running on port `7545`, run `truffle migrate --reset --network development`, and select the matching Ganache network in MetaMask. The frontend requires matching entries in the generated artifact `networks` data.

### `Please install MetaMask` Appears

Install or enable MetaMask in the browser and refresh the application.

### The Wallet Is Not Registered

A newly imported wallet must complete `/register`. The system treats account 0 as the Main Administrator and account 1 as the migration's initial Regional Admin.

### Pinata Upload Fails

Verify that `VITE_PINATA_JWT` or both `VITE_PINATA_API_KEY` and `VITE_PINATA_SECRET_KEY` exist in `client/.env`. Restart Vite after changing environment variables. Use a valid PDF smaller than 10 MB.

### Property or User Verification Is Unauthorized

Contract modifiers and UI role checks require the correct account:

- Only the Main Administrator can add/remove Regional Admins.
- Only the mapped employee can verify/reject department properties.
- Only verified Regional Admins can verify normal users.

### Transaction Fails with an Estimation or Revert Error

Confirm the wallet is the owner/authorized actor required by the contract, keep enough ETH for gas, and use a property/sale in the required state. Reverts may also indicate that the contract interaction or deadline rules are not satisfied.

### Ownership Transfer/Compilation Warning

The current `PropertyExchange` code calls `LandRegistryContract.transferOwnership(...)`, but the existing `PropertyRegistry` source does not show a directly matching public `transferOwnership` wrapper. Before relying on end-to-end sale completion, verify and align `PropertyRegistry`, `PropertyExchange`, and `PropertyLedger` ownership-transfer interfaces. This README identifies it as an implementation caveat rather than documenting an unverified completed behavior.

### `AuditMonitor` Is Not in the Migration

`AuditMonitor.sol` is present as a source contract, but `2_deploy_contracts.js` does not deploy it and the frontend audit hook reads past events directly from the three deployed registry/exchange contracts. It should not be expected to appear without a migration and frontend contract-artifact update.
