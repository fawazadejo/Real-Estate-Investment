# Tokenized Real Estate Investment Platform

A blockchain-based platform for tokenizing real estate investments using Clarity smart contracts on the Stacks blockchain.

## Overview

This project implements a complete system for tokenizing real estate properties, enabling fractional ownership, automated dividend distribution, and secondary market trading. The platform consists of four main smart contracts that work together to provide a comprehensive solution.

## Smart Contracts

### 1. Property Verification Contract (`property-verification.clar`)

This contract handles the validation of real estate properties:

- **Property Registration**: Register properties with details like address and value
- **Verifier Management**: Add and remove authorized property verifiers
- **Property Verification**: Verify properties and record inspection dates
- **Status Checking**: Query property verification status and details

### 2. Tokenization Contract (`tokenization.clar`)

This contract converts property ownership into digital tokens:

- **Property Tokenization**: Create tokens representing fractional ownership of a property
- **Token Management**: Track token supply, pricing, and property value
- **Ownership Tracking**: Record token ownership and enable transfers
- **Token Deactivation**: Ability to deactivate tokens if needed

### 3. Dividend Distribution Contract (`dividend-distribution.clar`)

This contract manages rental income payments to token holders:

- **Dividend Pool Creation**: Set up pools for collecting rental income
- **Fund Management**: Add rental income to dividend pools
- **Distribution Logic**: Distribute dividends to token holders based on ownership
- **Claiming Process**: Allow token holders to claim their dividends

### 4. Secondary Market Contract (`secondary-market.clar`)

This contract facilitates trading of property tokens:

- **Listing Creation**: Create listings to sell property tokens
- **Listing Management**: Cancel or modify existing listings
- **Purchase Processing**: Handle token purchases from listings
- **Status Tracking**: Monitor active listings and expiration

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) - For running tests

### Installation

1. Clone the repository:

