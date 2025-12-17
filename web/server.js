const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  console.log('Received request for /'); // 🔹 log à chaque requête
  console.log('Someone accessed / at', new Date());
  res.send('🚀 ft_transcendence server is running');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // 🔹 log au démarrage
});

console.log("Server script executed"); // 🔹 log lorsque le script est exécuté
console.log("ft_transcendence server is starting..."); // 🔹 log au démarrage du serveur

console.log("Server is ready to handle requests"); // 🔹 log indiquant que le serveur est prêt