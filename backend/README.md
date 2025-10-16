# Backend - CreditSea API

## Quick Start

### Option 1: Local MongoDB

Ensure MongoDB is running locally:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or run manually
mongod --dbpath=/path/to/your/db
```

Then start the server:

```bash
npm install
npm run dev
```

### Option 2: MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Create `.env` file:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/creditsea?retryWrites=true&w=majority
PORT=5000
```

4. Start server:

```bash
npm run dev
```

## Testing

```bash
npm test
```

## API Endpoints

- `POST /api/upload` - Upload XML file
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/pan/:pan` - Get report by PAN

## Sample Usage

Upload a sample file:

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@samples/sample1.xml"
```

Get reports:

```bash
curl http://localhost:5000/api/reports
```
