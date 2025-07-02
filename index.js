const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
    res.send('Hello Dünya')
});

app.get('/api/child', (req, res) => {
    const childData = {
        name: "Samet Sancar Kılıç",
        mamaNumber: "+905380635336",
        papaNumber: "+905380635336"
    };
    res.json(childData);

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
