const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/api/attractions.json');

try {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const attractions = JSON.parse(rawData);

  console.log(`Original count: ${attractions.length}`);

  const seen = new Set();
  const uniqueAttractions = attractions.filter(attraction => {
    const coordKey = `${attraction.location.lat},${attraction.location.lng}`;
    if (seen.has(coordKey)) {
      return false;
    }
    seen.add(coordKey);
    return true;
  });

  console.log(`Unique count: ${uniqueAttractions.length}`);

  fs.writeFileSync(filePath, JSON.stringify(uniqueAttractions, null, 2));
  console.log('Successfully deduplicated attractions.');

} catch (error) {
  console.error('Error processing file:', error);
  process.exit(1);
}
