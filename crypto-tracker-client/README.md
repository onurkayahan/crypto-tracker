# Crypto Tracker

The frontend for the Crypto Tracker application, designed to display real-time cryptocurrency prices and historical data. Built with modern tools like React, Vite, Effector, and TailwindCSS, this application ensures high performance, modularity, and ease of use.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

- `VITE_API_URL=<Your-API-url>`

### Running the Project

```bash
# Install dependencies
npm install
```

```bash
# Start the development server
npm run dev
```

```bash
# Run unit tests
npm run test
```

---

## Features

- Real-time price updates using WebSocket.
- Display of cryptocurrency historical data with efficient caching.
- Modular design using reusable UI components.
- Responsive and accessible UI built with TailwindCSS and shadcn-ui.

---

## Application Details

- **Port**: The application runs on port `5173` by default.
- **Backend URL**: Ensure the backend is running and accessible at [http://localhost:3000](http://localhost:3000).

---

## Key Files and Structure

### Styling

- **`App.css`** and **`index.css`**: Define global and component-level styles using TailwindCSS.

### State Management

- **`stores/cryptoStore.ts`**: Manages cryptocurrency data and WebSocket connections using Effector.

### Networking

- **`socketService.ts`**: Handles WebSocket communication for real-time price updates.
- **`apolloClient.ts`**: Configures GraphQL communication with the backend.

### Components

- Reusable components are located in **`src/components`** and styled using shadcn-ui and TailwindCSS.

---

## Technology Choices and Rationale

### 1. **React**

- React provides a robust and flexible framework for building dynamic user interfaces.
- Its component-based architecture ensures modularity and reusability.

### 2. **Vite**

- **Why Vite?**:
  - Lightning-fast development server and build process.
  - Native support for modern JavaScript and TypeScript features.
  - Easy integration with tools like TailwindCSS and Vitest.

### 3. **Effector**

- **Why Effector for State Management?**:
  - Effector provides a reactive approach to managing state, with fine-grained control over updates.
  - Ensures predictable state transitions and efficient updates, making it ideal for real-time applications.

### 4. **shadcn-ui**

- A collection of accessible and customizable UI components that work seamlessly with TailwindCSS.
- Provides a consistent design system while allowing flexibility for customization.

### 5. **TailwindCSS**

- **Why TailwindCSS?**:
  - Utility-first CSS framework for rapid development.
  - Ensures consistent styling across components and simplifies responsiveness.

### 6. **Vitest**

- Modern and fast testing framework with excellent integration for TypeScript and Vite.
- Ensures robust unit testing for critical features like WebSocket communication.

---

## Future Enhancements

1. **Support for More Data Providers**:

   - Add integration with additional pricing sources like Binance and Kraken for improved reliability and redundancy.

2. **Historical Data Customization**:

   - Allow users to select specific date ranges for historical data, including zoomable charts.

3. **Internationalization**:

   - Add multi-language support for a global audience.

4. **User Authentication**:

   - Implement user accounts with saved preferences, selected trading pairs, and alert settings.

5. **Mobile Optimization**:
   - Ensure the application is fully responsive for mobile and tablet devices.
