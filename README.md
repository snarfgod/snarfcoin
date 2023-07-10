# Snarfcoin ERC20 Token

## Overview

This is a simple ERC20 token. It is based on the [OpenZeppelin](https://openzeppelin.com/) library.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [Hardhat](https://hardhat.org/) (v2.6 or higher)
- [Metamask](https://metamask.io/) (v10 or higher)

## Setup

1. Clone this repo
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:

```PRIVATE_KEYS=[private key of your wallet]```
```ALCHEMY_API_KEY=[Alchemy API key]```

## Deploy

1. npx hardhat run scripts/deploy.js --network goerli (If you wish to run this on a separate network, change the hardhat.config.js file with the network details, and write the name here)

## Creator

- [snarfgod](https://github.com/snarfgod)

