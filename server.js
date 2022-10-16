const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express()
const port = 3000

app.use(bodyParser.json({ extended: false }));
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", "views");

app.use('/data', express.static('data'));

app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.pug')
})

app.get('/home', (req, res) => {
  res.render('index.pug');
})

app.get('/sounds', (req, res) => {
  res.render('sounds.pug');
})

app.get('/teen', (req, res) => {
  res.render('teen.pug')
})

app.get('/monster', (req, res) => {
  res.render('monster.pug')
})

app.get('/journey', (req, res) => {
  res.render('journey.pug')
})
app.get('/journeys', (req, res) => {
  res.render('journey.pug')
})

app.get('/weapons', (req, res) => {
  res.render('weapons.pug')
})

app.get('/creatorhub', (req, res) => {
  res.render('wip.pug')
})
app.get('/creators', (req, res) => {
  res.render('wip.pug')
})

function GetNewFOTD(current, total) {
  let newFOTD = -1;
  do {
    newFOTD = Math.floor(Math.random() * total);
  } while (newFOTD == current);
  return newFOTD;
}

app.post('/admin/updatefotd', (req, res) => {
  console.log('Got body:', req.body);
  
  var authCheck = JSON.parse(fs.readFileSync('authorizationChecker.json'));
  console.log("Valid Key: ", authCheck.validAuthKey);
  console.log("Received Key: ", req.body["authKey"]);
  
  if (req.body.authKey != authCheck.validAuthKey) {
    res.sendStatus(401);
    return;
  }
  console.log("Authorized!");
  
  var creatorData = JSON.parse(fs.readFileSync('data/creatorhub/creators.json'));
  console.log("Creator Data acquired!");


  let currentFOTD = creatorData["FOTD_INDEX"];
  let totalCreators = creatorData["CREATORS"].length
  console.log("Current FOTD: ", currentFOTD);
  console.log("Total Creators: ", totalCreators);

  let newFOTD = GetNewFOTD(currentFOTD, totalCreators);
  console.log("New FOTD: ", newFOTD);

  creatorData["FOTD_INDEX"] = newFOTD;
  console.log("New FOTD set!");

  fs.writeFileSync('data/creatorhub/creators.json', JSON.stringify(creatorData));

  res.sendStatus(200);
})

app.get('/admin', (req, res) => {
  res.render("adminLogin.pug")
})

app.post('/admin/loginAttempt', (req, res) => {
  console.log('Getting Req Header');
  var authKey = req.get("API-Key");
  console.log("Sent key: " + authKey)

  var authCheck = JSON.parse(fs.readFileSync('authorizationChecker.json'));

  var possibleUsers = authCheck.Users;

  var authorized = false;
  var authIndex = -1;

  for (var user of possibleUsers) {
    authIndex++;
    if (authKey == user.APIKey) {
      authorized = true;
      break;
    }
  }

  if (!authorized) {
    res.sendStatus(401);
  }

  res.send(possibleUsers[authIndex].ReturnData);
})

app.get('/admin/loginRebound', (req, res) => {
  res.render("admin.pug")
})

app.post('/admin/dev/announcements/postnewannouncement', (req, res) => {
  console.log('Getting Req Header');
  var authKey = req.get("API-Key");
  console.log("Sent key: " + authKey)

  var authCheck = JSON.parse(fs.readFileSync('authorizationChecker.json'));

  if (authKey != authCheck["Users"][0]["APIKey"]) {
    res.sendStatus(401);
  }

  var announcements = JSON.parse(fs.readFileSync('public/announcements/announcements.json'));
  
  announcements.Announcements.unshift(req.body);

  fs.writeFileSync('public/announcements/announcements.json', JSON.stringify(announcements));

  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Video Horror Stats is online! Listening on port ${port}!`)
})
