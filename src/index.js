const express = require('express');
const fs = require('fs').promises;
const accountsRouter = require('../routes/accounts.js');
const app = express();
const port = 3005;

global.pathFile = './data/accounts.json';

app.use(express.json());
app.use("/account", accountsRouter);

app.listen(port, async () => {
  try {
    await fs.readFile(global.pathFile, 'utf8');
    console.log('API iniciada!');
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };

    fs.writeFile(global.pathFile, JSON.stringify(initialJson)).catch((err) => {
      console.log(err);
    });
  }
});