const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

router.post('/', async (req, res) => {
  let account = req.body;

  try {
    if (JSON.stringify(account) == '{}')
      throw new Error('Body not found');

    let json = await fs.readFile(global.pathFile, 'utf8');

    json = JSON.parse(json);
    account = {
      id: json.nextId,
      ...account,
    };
    json.nextId++;
    json.accounts.push(account);

    await fs.writeFile(global.pathFile, JSON.stringify(json));
    res.end();
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.get('/', async (_, res) => {
  try {
    let obj = await fs.readFile(global.pathFile, 'utf8');
    obj = JSON.parse(obj);
    delete obj.nextId;
    res.send(obj);
  } catch (error) {
    res.status(400).send({
      error: err.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let obj = await fs.readFile(global.pathFile, 'utf8')
    obj = JSON.parse(obj);
    let objFind = obj.accounts.find((item) => {
      return item.id == id;
    });

    if (objFind)
      res.send(objFind);
    else
      res.end();
  } catch (error) {
    res.status(400).send({
      error: err.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let obj = await fs.readFile(global.pathFile, 'utf8');

    obj = JSON.parse(obj);
    let accounts = obj.accounts.filter((item) => item.id !== parseInt(req.params.id, 10));
    obj.accounts = accounts;

    if (accounts.length > 0) {
      await fs.writeFile(global.pathFile, JSON.stringify(obj));
      res.send(obj);
    } else {
      res.end();
    }
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.put('/', async (req, res) => {
  try {
    let newAccount = req.body;

    if (JSON.stringify(newAccount) == '{}') throw new Error('Body not found');
    if (newAccount.id == undefined) throw new Error('Id not found');

    let json = await fs.readFile(global.pathFile, 'utf8');
    json = JSON.parse(json);
    let oldIndex = json.accounts.findIndex(item => item.id === parseInt(newAccount.id));

    if (oldIndex > 0 && json.accounts[oldIndex] !== undefined) {
      json.accounts[oldIndex].Name = newAccount.Name;
      json.accounts[oldIndex].Balance = newAccount.Balance;

      await fs.writeFile(global.pathFile, JSON.stringify(json));

      res.send(json.accounts[oldIndex]);

    } else {
      throw new Error('Index not found')
    }
  } catch (error) {
    res.status(400).send({
      error: error.message
    })
  }
});

router.post('/deposit', async (req, res) => {
  try {
    let account = req.body;
    let json = await fs.readFile(global.pathFile, 'utf8');
    json = JSON.parse(json);
    let index = json.accounts.findIndex(item => item.id === parseInt(account.id));
    if (index === undefined) throw new Error('Index not found');

    json.accounts[index].Balance += account.value;
    await fs.writeFile(global.pathFile, JSON.stringify(json));

    res.send(json.accounts[index]);

  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    let account = req.body;
    if (account.value === undefined || account.value <= 0) throw new Error('Value invalid');

    let json = await fs.readFile(global.pathFile, 'utf8');
    json = JSON.parse(json);
    let index = json.accounts.findIndex(item => item.id === parseInt(account.id));
    if (index === undefined) throw new Error('Index not found');

    if (json.accounts[index].Balance < account.value) throw new Error('Saldo insuficiente');

    json.accounts[index].Balance -= account.value;
    await fs.writeFile(global.pathFile, JSON.stringify(json));
    res.send(json.accounts[index]);

  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});


module.exports = router;