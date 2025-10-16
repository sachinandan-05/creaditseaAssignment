# Frontend - CreditSea UI

React-based frontend for uploading XML files and viewing credit reports.

## Development

```bash
npm install
npm start
```

Opens on `http://localhost:3000`

The dev server proxies API requests to `http://localhost:5000` (backend must be running).

## Build for Production

```bash
npm run build
```

Output: `dist/` folder

## Features

- XML file upload interface
- Reports list with timestamps
- Detailed report viewer with:
  - Basic details (name, PAN, score)
  - Report summary
  - Credit accounts information

## Tech Stack

- React 18
- Webpack 5 + Babel
- Axios for HTTP
- CSS for styling
