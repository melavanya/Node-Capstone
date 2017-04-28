var express = require('express');
var app = express();
const movies = new (require('tmdbapi'))({
    apiv3: 'ccceb486c69dc202428bef9e18797cf3'
});
var bodyParser = require('body-parser');



app.get("/movieDB", (req, res) => {
  console.log(`${req.body}`);
  var data=0;
  res.send({server:data});
});


app.use(express.static('public'));

app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));
