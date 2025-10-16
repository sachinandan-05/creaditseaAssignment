# CreditSea - MERN Credit Report Processor

A full-stack MERN application that processes Experian-style XML soft credit pull files, stores extracted data in MongoDB, and displays comprehensive credit reports via a React frontend.

## 🏗️ Architecture

- **Backend**: Node.js + Express + Multer + xml2js + Mongoose
- **Frontend**: React + Webpack + Axios
- **Database**: MongoDB
- **Testing**: Jest + Supertest

## 📂 Project Structure

```
creaditsea/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server entry point
│   │   ├── models/report.js    # Mongoose schema
│   │   ├── routes/reports.js   # API routes
│   │   └── utils/
│   │       ├── parser.js       # XML parsing logic
│   │       └── parser.test.js  # Unit tests
│   ├── samples/                # Sample XML files
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── index.jsx          # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── components/
│   │   │   ├── Upload.jsx      # File upload UI
│   │   │   └── Reports.jsx     # Report list and detail view
│   │   └── styles.css
│   ├── public/index.html
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Setup Backend

```bash
cd backend
npm install

# Create .env file (optional if using local MongoDB)
cp .env.example .env
# Edit .env if needed:
# MONGO_URI=mongodb://127.0.0.1:27017/creditsea
# PORT=5000

# Start backend server
npm run dev
```

Backend will start on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install

# Start frontend dev server
npm start
```

Frontend will open on `http://localhost:3000`

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
npm test
```

Tests cover XML parsing logic with different XML structures.

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload XML file (multipart/form-data) |
| `/api/reports` | GET | Get list of all reports |
| `/api/reports/:id` | GET | Get detailed report by ID |
| `/api/reports/pan/:pan` | GET | Get report by PAN number |

## 📊 Data Schema

### Report Model

```javascript
{
  basicDetails: {
    name: String,
    mobile: String,
    pan: String,
    creditScore: Number
  },
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    recentEnquiries: Number
  },
  creditAccounts: [{
    type: String,
    bank: String,
    accountNumber: String,
    address: String,
    amountOverdue: Number,
    currentBalance: Number
  }],
  raw: Object,
  createdAt: Date
}
```

## 🎯 Features

### Backend
- ✅ XML file upload with validation
- ✅ Robust XML parsing (handles multiple XML structures)
- ✅ MongoDB persistence with Mongoose
- ✅ RESTful API design
- ✅ Error handling and logging
- ✅ Unit tests with Jest

### Frontend
- ✅ File upload interface
- ✅ Reports list view
- ✅ Detailed report viewer
- ✅ Responsive design
- ✅ API integration with Axios

## 🧑‍💻 Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000`
3. Click "Choose File" and select one of the sample XML files from `backend/samples/`
4. Click "Upload"
5. View the parsed report in the reports list
6. Click on a report to see full details

## 📝 Sample XML Files

Two sample XML files are provided in `backend/samples/`:
- `sample1.xml` - John Doe with multiple accounts
- `sample2.xml` - Jane Smith with different XML structure

## 🔒 Security Considerations

- File type validation (only .xml accepted)
- XML parsing with safe defaults
- Temporary upload files cleaned after processing
- CORS enabled for local development

## 🚢 Deployment

### Backend
- Deploy to Render, Railway, or Heroku
- Set environment variables: `MONGO_URI`, `PORT`
- Use MongoDB Atlas for production database

### Frontend
- Deploy to Vercel, Netlify, or similar
- Update API base URL in production build
- Configure proxy/CORS appropriately

## 📦 Dependencies

### Backend
- express, cors, dotenv, morgan
- mongoose (MongoDB ODM)
- multer (file uploads)
- xml2js (XML parsing)
- jest, supertest (testing)

### Frontend
- react, react-dom, react-router-dom
- axios (HTTP client)
- webpack + babel (build tools)

## 🎨 Future Enhancements

- [ ] JWT authentication
- [ ] Compare multiple reports
- [ ] Data visualization with charts
- [ ] PDF/CSV export
- [ ] Credit score trend analysis
- [ ] Advanced search and filtering

## 📄 License

MIT

---

**CreditSea** - Built with ❤️ using the MERN stack
