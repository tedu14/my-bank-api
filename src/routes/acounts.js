const express = require('express');
const router = express.Router();
const fs = require('fs');

//Get all acounts
router.get('/', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {
            if (err) throw err;

            let json = JSON.parse(data);

            delete json.nextId;

            return res.status(200).send(json);
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    })
});

//Get acount by id
router.get('/acounts/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {
            if (err) throw err;

            let json = JSON.parse(data);

            const resAcount = json.acounts.find(acount => acount.id === parseInt(req.params.id, 10));

            if (resAcount) {
                return res.status(200).send(resAcount);
            } else {
                return res.status(404).send({ mss: "user not found" });
            }
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    })
});

//Delete Acount
router.delete('/acounts/remove/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {
            if (err) throw err;

            let json = JSON.parse(data);

            let acountDelete = json.acounts.find(acount => acount.id === parseInt(req.params.id, 10));

            if (acountDelete) {
                let acounts = json.acounts.filter(acount => acount !== acountDelete);

                json.acounts = acounts;

                fs.writeFile(global.fileName, JSON.stringify(json), error => {
                    if (error) throw error;

                    return res.status(200).end();
                });
            } else {
                return res.status(404).send({ error: "user not found" });
            }


        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    })
})

//Create Acounts
router.post('/acounts', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {
            if (err) throw err;

            let acount = req.body;
            let json = JSON.parse(data);

            acount = { ...acount, id: (req.body.id ? req.body.id : json.nextId++) };

            json.acounts.push(acount);

            fs.writeFile(global.fileName, JSON.stringify(json), error => {
                if (error) throw error;

                return res.status(200).send('Acount create');
            });
        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    });
});

//Edited acount methood
router.put('/acounts/edited/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {
            if (err) throw err;

            let json = JSON.parse(data);

            let oldIndex = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

            if (oldIndex > -1) {
                json.acounts[oldIndex].name = req.body.name;
                json.acounts[oldIndex].balance = req.body.balance;

                fs.writeFile(global.fileName, JSON.stringify(json), error => {
                    if (error) throw error;

                    return res.status(200).send({ message: "usuário atualizado" });
                })
            } else {
                return res.status(404).send({ error: "user not found" });
            }

        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    })
});

//Create add money in acount
router.post('/acounts/deposito/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {

            if (err) throw err;

            let json = JSON.parse(data);

            let index = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

            if (index > -1) {

                json.acounts[index].balance += req.body.value;

                fs.writeFile(global.fileName, JSON.stringify(json), e => {
                    if (e) throw e;

                    return res.status(200).send({ message: "Depósito realizado" })
                })


            } else {
                return res.status(404).send({ error: 'user not found' });
            }

        } catch (error) {
            return res.status(400).send({ error: error.message });
        }
    })
});

//Saque
router.put('/acounts/saque/:id', (req, res) => {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
        try {

            if (err) throw err;

            let json = JSON.parse(data);

            let index = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

            if (index > -1) {

                if (json.acounts[index].balance >= req.body.value) {

                    json.acounts[index].balance -= req.body.value;

                    fs.writeFile(global.fileName, JSON.stringify(json), e => {
                        if (e) throw e;

                        return res.status(200).send('Saque realizado!');
                    })

                } else {
                    return res.status(200).send(`Saldo insuficiênte, valor em conta R$ ${json.acounts[index].balance}`)
                }

            } else {
                return res.status(404).send({ error: "user not found" });
            }

        } catch (e) {
            return res.status(400).send({ error: e.message });
        }
    })
})

module.exports = router;