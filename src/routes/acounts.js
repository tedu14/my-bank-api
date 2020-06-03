const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

//Get all acounts
router.get('/', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let json = JSON.parse(data);

        delete json.nextId;

        return res.status(200).send(json);

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

//Get acount by id
router.get('/acounts/:id', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

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
});

//Delete Acount
router.delete('/acounts/remove/:id', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let json = JSON.parse(data);

        let acountDelete = json.acounts.find(acount => acount.id === parseInt(req.params.id, 10));

        if (acountDelete) {
            let acounts = json.acounts.filter(acount => acount !== acountDelete);

            json.acounts = acounts;

            await fs.writeFile(global.fileName, JSON.stringify(json));

            logger.info(`Delete /acounts - ${JSON.stringify(acountDelete)}`);

            return res.status(200).end();
        } else {
            return res.status(404).send({ error: "user not found" });
        }

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
})

//Create Acounts
router.post('/acounts', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let acount = req.body;
        let json = JSON.parse(data);

        acount = {
            ...acount, id: (req.body.id ?
                (req.body.id === json.nextId) ?
                    json.nextId++ : req.body.id :
                json.nextId++)
        };

        json.acounts.push(acount);

        await fs.writeFile(global.fileName, JSON.stringify(json));

        logger.info(`Post create /acount - ${JSON.stringify(acount)}`);

        return res.status(200).send('Acount create');

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

//Edited acount methood
router.put('/acounts/edited/:id', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let json = JSON.parse(data);

        let oldIndex = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

        if (oldIndex > -1) {
            const { name, balance } = req.body;

            let oldAcount = json.acounts[oldIndex];

            json.acounts[oldIndex].name = name;
            json.acounts[oldIndex].balance = balance;

            await fs.writeFile(global.fileName, JSON.stringify(json));

            logger.info(`Put editing /acounts: old acount - ${JSON.stringify(oldAcount)}, new acount - ${JSON.stringify(json.acounts[oldIndex])}`);


            return res.status(200).send({ message: "usuário atualizado" });
        } else {
            return res.status(404).send({ error: "user not found" });
        }

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

//Deposint in acount
router.post('/acounts/deposito/:id', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let json = JSON.parse(data);

        let index = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

        if (index > -1) {

            json.acounts[index].balance += req.body.value;

            await fs.writeFile(global.fileName, JSON.stringify(json));

            logger.info(`Post deposit /acounts - value: ${req.body.value} - acount: ${JSON.stringify(json.acounts[index])}`);

            return res.status(200).send({ message: "Depósito realizado" })


        } else {
            return res.status(404).send({ error: 'user not found' });
        }

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

//Saque
router.put('/acounts/saque/:id', async (req, res) => {

    try {
        let data = await fs.readFile(global.fileName, 'utf8');

        let json = JSON.parse(data);

        let index = json.acounts.findIndex(acount => acount.id === parseInt(req.params.id, 10));

        if (index > -1) {

            if (json.acounts[index].balance >= req.body.value) {

                json.acounts[index].balance -= req.body.value;

                await fs.writeFile(global.fileName, JSON.stringify(json));

                logger.info(`Put saque /acounts - value: ${req.body.value} - acount: ${JSON.stringify(json.acounts[index])}`);

                return res.status(200).send('Saque realizado!');

            } else {
                return res.status(406).send(`Saldo insuficiênte, valor em conta R$ ${json.acounts[index].balance}`)
            }

        } else {
            return res.status(404).send({ error: "user not found" });
        }
    } catch (error) {
        return res.status(400).send({ error: e.message });
    }
})

module.exports = router;