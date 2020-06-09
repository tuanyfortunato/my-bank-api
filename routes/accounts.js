const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/', (req, res) => {
  let account = req.body;

  if (JSON.stringify(account) == '{}')
    res.status(400).send({ error: 'Body not found.' });

  fs.readFile(global.pathFile, 'utf8', (err, data) => {
    let json = null;
    if (err !== null) res.status(400).send({ error: err.message });

    try {
      json = JSON.parse(data);
      account = {
        id: json.nextId,
        ...account,
      }
      json.nextId++;
      json.accounts.push(account);

      fs.writeFile(global.pathFile, JSON.stringify(json), (err) => {
        if (err) {
          console.log(err);
          res.status(400).send({ error: error.message });
        }
        else {
          res.end();
        }
      });

    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(global.pathFile, 'utf8', (err, data) => {
    if (!err) {
      let obj = JSON.parse(data);
      delete obj.nextId;
      res.send(obj);
    }
    else {
      res.status(400).send({ error: err.message });
    }
  })
});

router.get('/:id', (req, res) => {

  fs.readFile(global.pathFile, 'utf8', (err, data) => {
    if (!err) {
      let obj = JSON.parse(data);
      delete obj.nextId;
      res.send(obj);
    }
    else {
      res.status(400).send({ error: err.message });
    }
  })
});

module.exports = router;