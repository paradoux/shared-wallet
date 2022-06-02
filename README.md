<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Shared Wallet</h3>

  <p align="center">
    Smart contract to allow multiple accounts share a wallet with determined spending allowances
    <br />
    <br />
    <a href="https://github.com/paradoux/shared-wallet/issues">Report Bug</a>
    ·
    <a href="https://github.com/paradoux/shared-wallet/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  <!-- - [Usage](#usage) -->
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

### Documentation

Smart contract to play around with. The owner can initialize the Contract, send it the desired amount of ether and add/reduce spending allowances for the addresses of his choice. Any account granted spending allowance can then use the funds of the smart contract and transfer them within the limits of their allowance.

### Built With

- [Solidity](https://docs.soliditylang.org/en/v0.8.13/)
- [OpenZeppelin Ownable](https://docs.openzeppelin.com/contracts/4.x/access-control)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Install npm

### Installation

1. Clone the repo

```sh
git clone https://github.com/paradoux/shared-wallet.git
```

2. Install the packages

```sh
npm install
```

3. Run the deploy script to deploy the contract on a test network

```sh
npx hardhat run scripts/deploy.js --network rinkeby
```

4. Use your favorite UI to interact with the contract

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/paradoux/shared-wallet/issues) for a list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Axel Martin - mtn.axel@gmail.com

[Github](https://github.com/paradoux) - [LinkedIn](https://www.linkedin.com/in/martinaxel/)
