const express = require('express');
const fs = require('fs'); // Dosya işlemleri için ekledik
const app = express();
const port = 3000;
app.use(express.json()); // Gelen JSON verisini otomatik olarak parse eder
const QRCode = require('qrcode'); // QR code kütüphanesini ekle

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

// Yeni çocuk ekleme endpoint'i
app.post('/api/children', (req, res) => {
  // 1. Gövdeden yeni çocuk verisini al
  const newChild = req.body;

  // 2. Mevcut çocuk listesini oku
  const children = getChildrenData();

  // 3. Yeni çocuğa eşsiz bir id ver (örneğin en büyük id + 1)
  const maxId = children.length > 0 ? Math.max(...children.map(c => c.id)) : 0;
  newChild.id = maxId + 1;

  // 4. Listeye ekle
  children.push(newChild);

  // 5. Güncellenmiş listeyi dosyaya yaz (overwrite)
  fs.writeFileSync('children.json', JSON.stringify(children, null, 2), 'utf-8');

  // 6. Cevap dön
  res.status(201).json(newChild);
});

// Belirli bir çocuğun QR kodunu üretip dönen endpoint
app.get('/api/child/:id/qrcode', async (req, res) => {
  const childId = parseInt(req.params.id);
  const children = getChildrenData();
  const child = children.find(c => c.id === childId);

  if (!child) {
    return res.status(404).json({ error: "Child not found" });
  }

  // 1. QR koda gömülecek bilgiyi belirle (ör: çocuğun URL’i veya kısa özeti)
  const qrData = `http://localhost:3000/api/child/${child.id}`;

  // 2. QR kodu PNG olarak oluştur ve gönder
  try {
    const qrImage = await QRCode.toDataURL(qrData);
    // Data URL'i doğrudan img etiketiyle kullanabilirsin!
    res.send(`<img src="${qrImage}" alt="QR code for child ${child.id}"><br><a href="/api/child/${child.id}">Bilgiyi gör</a>`);
  } catch (err) {
    res.status(500).json({ error: "QR kod üretilemedi" });
  }
});