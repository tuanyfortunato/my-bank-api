const express = require('express');
const fs = require('fs');
const accountsRouter = require('../routes/accounts.js');
const app = express();
const port = 3005;

global.pathFile = './data/accounts.json';

app.use(express.json());
app.use("/account", accountsRouter);

app.listen(port, () => {
  console.log('API iniciada!');
  try {
    fs.readFile(global.pathFile, 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };

        fs.writeFile(global.pathFile, JSON.stringify(initialJson), (err) => {
          try {
            if (err) console.log(err);
            console.log('File creating');
          } catch (error) {
            console.log('Error create file.');
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});
