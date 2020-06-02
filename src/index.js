const express = require('express');
const cors = require('cors');
const fs = require('fs');

//Start api
const app = express();
const port = 3333;

//Config express
app.use(cors());
app.use(express.json());


//Liste routes
app.use(require('./routes'));

app.listen(port, () => {
    try {
        fs.readFile('acounts.json', 'utf8', (err, data) => {
            if (err) {
                const initialJson = {
                    acounts: [],
                    nextId: 1
                }

                fs.writeFile('acounts.json', JSON.stringify(initialJson), error => {
                    if (error) console.warn(error);
                });
            }
        })
    } catch (error) {
        console.warn(error);
    }
    console.log(`Rodando normalmente na porta ${port}`);
});