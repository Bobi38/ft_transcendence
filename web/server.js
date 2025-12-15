const express = require('express');

const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  res.send('🚀 ft_transcendence web is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});