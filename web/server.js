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

  try {
    const [result] = await pool.execute(
      'SELECT * FROM user_co WHERE email = ?'
      [email]
    );

    if (result.length === 0)
        return res.status(42).json({success: false, message: 'Email not find'});
    if (!(compare(password, result.password)))
        return res.status(42).json({success: false, message: 'Password not valid'});
    res.status(201).json({  success : true , message: 'Utilisateur connecte', user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur MySQL' });
  }
});

app.post('/register', async (req, res) => {
  const { name, password, mail, win, total_part } = req.body;

  try {
    const [result] = await pool.execute(
      'INSERT INTO user_co (name, pssword, mail, win, total_part) VALUES (?, ?, ?)',
      [name, password, mail,  win, total_part]
    );

    res.status(201).json({ message: 'Utilisateur ajouté', user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur MySQL' });
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