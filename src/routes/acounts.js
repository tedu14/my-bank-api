const express = require('express');
const router = express.Router();
const fs = require('fs');

//Get all acounts
router.get('/', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        if (!err) {
            let json = JSON.parse(data);

            delete json.nextId;

            return res.status(200).send(json);
        } else {
            return res.status(400).send({ error: err.message });
        }
    })
});

//Get acount by id
router.get('./acounts/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        if (!err) {
            try {
                let json = JSON.parse(data);

                const resAcount = json.acounts.find(acount => acount.id === parseInt(req.params.id, 10));

                if (resAcount) {
                    return res.status(200).send(resAcount);
                } else {
                    return res.status(404).send({ error: "user not found" });
                }

            } catch (error) {
                return res.status(400).send({ error: err.message });
            }
        } else {
            return res.status(400).send({ error: err.message });
        }
    })
})

//Create Acounts
router.post('/acounts', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        if (!err) {
            try {
                let acount = req.body;
                let json = JSON.parse(data);

                acount = { ...acount, id: json.nextId++ };

                json.acounts.push(acount);

                fs.writeFile(global.fileName, JSON.stringify(json), error => {
                    if (error) {
                        console.warn(error);
                        return res.status(400).send({ error: error.message })
                    } else {
                        return res.status(200).send('Acount create');
                    }
                });

            } catch (error) {
                console.warn(error);
                return res.status(400).send({ error: error.message });
            }
        } else {
            console.log(err);
            return res.status(400).send({ error: err.message });
        }
    });
})

module.exports = router;