const express = require('express');
const fs = require('fs'); // Dosya işlemleri için ekledik
const app = express();
const port = 3000;

// Tüm çocuk verilerini JSON dosyasından oku
function getChildrenData() {
  const data = fs.readFileSync('children.json', 'utf-8'); // Dosyayı okur
  return JSON.parse(data); // JSON'u diziye çevirir
}

// Ana sayfa
app.get('/', (req, res) => {
  res.send('Hello Dünya!');
});

// Tüm çocukları dönen endpoint
app.get('/api/children', (req, res) => {
  const children = getChildrenData(); // Dosyadan okur
  res.json(children);
});

// Belirli ID'ye göre çocuğu döner
app.get('/api/child/:id', (req, res) => {
  const childId = parseInt(req.params.id);
  const children = getChildrenData(); // Her seferinde dosyadan oku
  const child = children.find(c => c.id === childId);

  if (child) {
    res.json(child);
  } else {
    res.status(404).json({ error: "Child not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
} );