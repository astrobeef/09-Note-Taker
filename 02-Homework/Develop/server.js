const express = require("express");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));      //This tells express which files we will not be changing.  This allows Express to tell our HTML which files correspond with our URI.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Variables

const location_DB = "./db/db.json";

let notes = [
    {
        title: "Title",
        text: "Text",
        id: 1
    },
    {
        title: "Title",
        text: "Text",
        id: 2
    },
    {
        title: "Title",
        text: "Text",
        id: 3
    }

];

//App methods

app.get("/api/notes", function (req, res) {
    console.log("GET--------------" + req.path + "----------------GET");

    console.log("--> Front end is requesting all notes in our database...");

    res.json(notes);
    console.log(notes);

    console.log("... We have given them the array 'notes' -->");

    console.log("GET^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^GET");
})

app.post("/api/notes", function (req, res) {
    console.log("POST--------------" + req.path + "----------------POST");

    console.log("--> Front end is attempting to input a new note...")

    const newNote = JSON.stringify(req.body);

    console.log(newNote);

    notes.push(JSON.parse(newNote));

    storeToDB(notes, location_DB);

    console.log("... Back end added the new note to the notes -->");

    console.log("POST^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^POST");

    res.json(notes);
})

app.delete("/api/notes/:id", function (req, res) {
    console.log("DELETE--------------" + req.path + "----------------DELETE");

    const id = parseInt(req.params.id);
    let removedNote;

    console.log("--> Front end is attempting to delete a note with the id : " + id);

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            removedNote = notes.splice(i, 1);
            res.json(removedNote);
        }
    }

    console.log(removedNote);

    storeToDB(notes, location_DB);

    console.log("... Back end removed the note -->");

    console.log("DELETE^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^DELETE");
})

//Functions//

async function storeToDB(content, location) {
    console.log("<><><> Storing content to the location '", location, "' <><><>");

    cont_JSON = JSON.stringify(content);

    await fs.writeFile(location, cont_JSON, function (err) {
        if (err) throw (err);
    })

    await fs.readFile(location, "utf8", function (err, data) {
        console.log(data);
        return data;
    })
}


async function setNotes() {
    console.log("Setting notes");

    notes.length = 0;

    notes = await readFileAsync(location_DB, "utf8").then(function(data){
        console.log(data);
        console.log("Notes set");
        return data;
    })

    console.log("Finished");

    console.log(notes);
};

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));