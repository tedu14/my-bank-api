const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const winston = require('winston');

//Start api
const app = express();
const port = 3333;

//winston config
const { combine, timestamp, label, printf } = winston.format;
const myFormt = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

//Global vars
global.fileName = "acounts.json";
global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'my-bank-api.log' })
    ],
    format: combine(
        label({ label: 'my-bank-api.log' }),
        timestamp(),
        myFormt
    )
})

//Config express
app.use(cors());
app.use(express.json());


//Liste routes
app.use(require('./routes'));

app.listen(port, async () => {
    try {
        await fs.readFile(global.fileName, 'utf8').catch(async () => {
            const initialJson = {
                acounts: [],
                nextId: 1
            }

            await fs.writeFile('acounts.json', JSON.stringify(initialJson));

            logger.info(`Create json initial file`);
        })
    } catch (error) {
        logger.error(`Initial file error - ${error}`);
    }
    console.log(`Rodando normalmente na porta ${port}`);
});