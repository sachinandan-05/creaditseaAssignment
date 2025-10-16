const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Report = require('../models/report');
const { parseExperianXML } = require('../utils/parser');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!req.file.originalname.match(/\.xml$/i)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only XML files are accepted' });
    }

    const buffer = fs.readFileSync(req.file.path);
    const parsed = await parseExperianXML(buffer);

    const doc = new Report(parsed);
    await doc.save();

    // cleanup
    fs.unlinkSync(req.file.path);

    res.json({ id: doc._id, message: 'Uploaded and parsed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to parse or save the report', details: err.message });
  }
});

router.get('/reports', async (req, res) => {
  const list = await Report.find().sort({ createdAt: -1 }).limit(50).select('basicDetails reportSummary createdAt');
  res.json(list);
});

router.get('/reports/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await Report.findById(id);
  if (!doc) return res.status(404).json({ error: 'Report not found' });
  res.json(doc);
});

router.get('/reports/pan/:pan', async (req, res) => {
  const pan = req.params.pan;
  const doc = await Report.findOne({ 'basicDetails.pan': pan });
  if (!doc) return res.status(404).json({ error: 'Report not found' });
  res.json(doc);
});

module.exports = router;
