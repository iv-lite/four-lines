require('dotenv').config();

const express = require('express');
const app = express();

app.enable('trust proxy');
app.use((req, res, next) => {
  if(!req.secure)
    return res.redirect('https://' + req.headers.host + req.url);

  next();
});

app.use(express.static('dist'));
app.get('*', function(req, res) {
  res.sendfile('./dist/index.html')
});

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', function() {
  console.log("Server listening on port " + PORT);
});
