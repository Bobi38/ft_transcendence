const express = require('express');
const app = express();
const path = require("path");
const PORT = process.env.PORT || 9000;

const pool = require('./site/pool');

// autorise l'accès aux fichiers statiques au même niveau
app.use((req, res, next) => {
  console.log('Fichier demandé :', req.url);
  next();
});

app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  try {
    const [result] = await pool.execute(
      'SELECT * FROM user_co WHERE mail = ?',
      [email]
    );

    if (result.length === 0)
        return res.status(42).json({success: false, message: 'Email not find'});
    console.log("result[0] =", result[0].mail + " " + result[0].password);

    if (result[0].password != password)
        return res.status(500).json({success: false, message: 'Password not valid'});
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur MySQL' });
  }
});

app.post('/register', async (req, res) => {
  console.log("je suis la ");
  console.log(req.body);
  const { name, password, email } = req.body;
  try {
    const [find] = await pool.execute(
      'SELECT * FROM user_co WHERE mail = ?',
      [email]
    );
    if (find.length > 0) {
      return res.status(42).json({success: false, message: 'Email already used'});
    }
    const [result] = await pool.execute(
      'INSERT INTO user_co (name, password, mail, win, total_part) VALUES (?, ?, ?, ?, ?)',
      [name, password, email, 0, 0]
    );
    console.log("kkkkkkkkkkkkkkkkkkkkkkkk");
    res.status(201).json({success: true, message: 'Utilisateur ajouté', user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({success: false, message: 'Erreur MySQL' });
  }
});

// autorise l'accès aux fichiers statiques
app.use(express.static(path.join(__dirname, 'site')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site",  "index2.html"));
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:9000");
});