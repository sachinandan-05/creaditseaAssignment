// Seed script to populate database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { parseExperianXML } = require('../src/utils/parser');
const Report = require('../src/models/report');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creditsea';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing reports
    await Report.deleteMany({});
    console.log('🗑️  Cleared existing reports');

    // Load sample XMLs
    const samplesDir = path.join(__dirname, '../samples');
    const files = fs.readdirSync(samplesDir).filter(f => f.endsWith('.xml'));

    for (const file of files) {
      const filePath = path.join(samplesDir, file);
      const buffer = fs.readFileSync(filePath);
      const parsed = await parseExperianXML(buffer);
      const report = new Report(parsed);
      await report.save();
      console.log(`✅ Seeded ${file} - ${parsed.basicDetails.name}`);
    }

    console.log(`\n🎉 Seeded ${files.length} reports successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
