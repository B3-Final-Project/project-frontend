# Dating App Frontend

## Technologies Used

- **Next.js**: React framework for server-rendered and statically generated web applications.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for safer, scalable code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **React Query**: Data-fetching and state management for React.
- **Docker Compose**: For local development and service orchestration.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd projet-b3-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 2.1. Environment Variables

You can set up environment variables in one of two ways:

- **Option 1: Decrypt with SOPS (recommended for full setup)**
  - Use the same instructions as the backend to decrypt environment files:
    1. Ensure you have access to the encrypted `.env` files and [SOPS](https://github.com/mozilla/sops) installed.
    2. Run:
      ```bash
      npm run sops:decrypt
      ```
    3. This will decrypt the environment files needed for local development.

- **Option 2: Manual Setup (minimal, for frontend-backend connection)**
  - Create a `.env` file in the project root and add the backend URL:
    ```env
    NEXT_PUBLIC_BASE_URL=<your-backend-url>
    ```

### 3. Run the Development Server

```bash
npm run dev
```

The app should now be running locally. By default, it will connect to the backend and other services as configured in your environment files.

---

## Additional Notes

- For Docker-based development, use the provided `docker-compose.yml`.
- Ensure your environment variables are set up as required (see `.env.example` if available).
- For more details on project structure or configuration, refer to the documentation or comments in the codebase.

---

## License

MIT
