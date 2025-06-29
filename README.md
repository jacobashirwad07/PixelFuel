# PixelFuel

PixelFuel is a modern platform for discovering, managing, and processing digital games and assets. It features both a user-facing frontend and an admin dashboard for content management.

## Project Structure

```
PixelFuel/
│
├── Clone.main/
│   ├── frontend/      # User-facing React app
│   └── admin/         # Admin dashboard React app
│
└── README.md
```

### `Clone.main/frontend`

- Main web application for users to browse, explore, and interact with games and services.
- Key folders:
  - `src/pages/` — Main pages (Home, Cart, Orders, etc.)
  - `src/components/` — Reusable UI components (Navbar, Footer, GameDisplay, etc.)

### `Clone.main/admin`

- Admin dashboard for managing games, orders, and content.
- Key folders:
  - `src/pages/` — Admin pages (Add, List, Orders)
  - `src/components/` — Admin UI components (Navbar, Sidebar, etc.)

## Getting Started

### Prerequisites

- Node.js and npm installed

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/PixelFuel.git
   cd PixelFuel/Clone.main/frontend
   ```

2. Install dependencies for both frontend and admin:
   ```bash
   cd frontend
   npm install
   cd ../admin
   npm install
   ```

3. Start the development servers:
   ```bash
   # In one terminal
   cd frontend
   npm start

   # In another terminal
   cd ../admin
   npm start
   ```

## Usage

- Visit the frontend at `http://localhost:3000`
- Visit the admin dashboard at `http://localhost:3001` (or the port specified)

## Contributing

Pull requests and issues are welcome!

## License

MIT License
