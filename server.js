const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));      //This tells express which files we have which will not be changing.

app.use(express.urlencoded({ extended : true}));
app.use(express.json());


app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/api/notes", function(req, res){
    //This will display the current note.
})


app.listen(PORT, () => console.log(`App listening on localhost:${PORT}`));