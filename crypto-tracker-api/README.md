# Crypto Tracker API

## Description

A backend service providing cryptocurrency price data for TON/USDT and BTC/USDT trading pairs. Built with NestJS, this API supports real-time updates, caching, and database persistence.

## Features

- Fetches cryptocurrency prices using external APIs (e.g., CoinGecko, CoinMarketCap).
- Supports caching via Redis to reduce API call frequency.
- Real-time updates using WebSocket.
- Scalable structure for adding new trading pairs.
- PostgreSQL with TimescaleDB for efficient time-series data storage.

## Requirements

- Node.js
- Docker (for dependencies like PostgreSQL and Redis)
- Environment variables configured in a `.env` file.

## Setup and Run Instructions

1. Clone the repository: `git clone <repo-url>`
2. Navigate to the backend directory: `cd crypto-tracker-api`
3. Install dependencies: `npm install`
4. Set up `.env` file (use `.env.example` as reference). Just copy paste all
5. Start Docker services: `docker-compose up -d`
6. Run tests: `npm test`

### Application Details

- **Port**: The application runs on port `3000`.
- **GraphQL URL**: Access the GraphQL API at [http://localhost:3000/graphql](http://localhost:3000/graphql).

### Database and Migrations

- **Initial Migration**: It will run itself automatically; no need to manually execute `docker-compose exec app npm run migration:run`.
- **Reverting Migrations**: Use `docker-compose exec app npm run migration:revert` to revert migrations.

### PgAdmin Instructions

- Visit [http://localhost:15432/](http://localhost:15432/) after running `docker-compose up -d`.
- Log in with:
  - Email: `admin@postgres.com`
  - Password: `password`
- Register the server:
  1. Go to `Servers -> Register -> Server`.
  2. Name: `<anything>`
  3. Connection:
     - Hostname: `postgres`
     - Port: `5432`
     - Maintenance Database: `cryptodb`
     - Username: `postgres`
     - Password: `password`

## Deployment Notes

- Kubernetes (k8s) configuration and secrets are ready; `.env` is used for local development only.
- Tokens in the `.env` file are test tokens for project review. These are free tokens from CoinGecko and CoinMarketCap and tokens have enough credit for test.

## GraphQL Requests Overview

Here are examples of GraphQL requests supported by the API:

## GraphQL Requests Overview

### **Queries**

1. **Get Current Price**
   Fetches the current price for a given cryptocurrency trading pair.

   ```graphql
   query {
     getCurrentPrice(pair: "TON/USDT") {
       pair
       price
       timestamp
       source
     }
   }
   ```

1. **Get Historical Prices**
   Retrieves historical price data for a given cryptocurrency trading pair.

   ```graphql
   query {
     getHistoricalPrices(pair: "TON/USDT") {
       id
       pair
       price
       timestamp
       source
     }
   }
   ```

### Caching Details

- **Current Price**:

  - Each successful cron job execution extends the cache expiration time to **30 minutes** with new current price value, ensuring availability even if a subsequent cron job fails.
  - If a connection to the price provider is lost and the cron job cannot update the cache, the system will not serve outdated prices to ensure data accuracy.

- **Historical Prices**:
  - Historical price queries are cached for **1 minute** to optimize database performance while keeping data relatively fresh.

## Architectural Decisions

### Why Persistent Volume Claim?

Persistent volume claims (PVCs) ensure data consistency and durability for the database and Redis when deployed in Kubernetes. This prevents data loss during container restarts and ensures persistent storage for time-series data and cache.

### Why Hypertables and TimescaleDB?

Hypertables in TimescaleDB are optimized for time-series data, providing:

- Efficient storage and retrieval of large datasets.
- Advanced querying capabilities for time-series analytics.
- Scalability to handle growing volumes of cryptocurrency price history data.

### Why NestJS with Fastify?

- **NestJS**: Provides a modular and scalable architecture with built-in support for GraphQL, making it ideal for rapidly growing applications.
- **Fastify**: Offers superior performance with lower resource consumption compared to Express, making it suitable for high-performance APIs.

## Future Enhancements

- Refactor the backend into a microservice architecture with an authentication layer.
- Move Redis into a shared/common service to streamline caching across multiple services.
- Extend support for more trading pairs and integrate additional data providers.
- Leverage TimescaleDB views to aggregate cryptocurrency price history into hourly, daily, and weekly summaries. Return data based on requested time ranges for efficient and detailed analytics.
- Implement advanced data analytics and historical trend visualization features.
- Securing the app with replacing WebSocketGateway in crypto.gateway.ts and update 0.0.0.0 in main.ts
- Loading history from external API according to user's request
