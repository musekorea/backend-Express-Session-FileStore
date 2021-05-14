const { static } = require('express');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const user = require('./db.js');
const app = express();
const router = express.Router();
const dbId = user.user.id;
const dbPw = user.user.password;

app.use(static('public'));
app.use(
  session({
    secret: 'moyamoya',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

router.get('/login', (req, res) => {
  if (req.session.isLogined) {
    console.log(req.session);
    res.send('로그인중입니다');
  } else {
    res.send('로그인이 필요합니다');
  }
});

router.post('/login', (req, res) => {
  if (req.body.id == dbId && req.body.pw == dbPw) {
    console.log(`오케이`);
    req.session.isLogined = true;
    req.session.nickname = dbId;
    res.sendFile(__dirname + '/public/welcome.html');
  } else {
    console.log('낫오케이');
    req.session.isLogined = false;
  }
});

router.get('/logout', (req, res) => {
  console.log('logout');
  req.session.destroy(function (err) {
    console.log(err);
  });
  res.send('logout 됬습니다');
});

app.listen(8080, () => {
  console.log(`Server is listening on PORT 8080`);
});
