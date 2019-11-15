//Imports

const express = require("express");
const fs = require("fs");
const util = require("util");

//Use of Imports

const readFileAsync = util.promisify(fs.readFile);          //Allows us to read files as promises.
const writeFileAsync = util.promisify(fs.writeFile);        //Allows us to read files as promises.

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));      //This tells express which files we will not be changing.  This allows Express to tell our HTML which files correspond with our URI.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Variables

const location_DB = "./db/db.json";

let notes = [];

//App methods

//Get the notes array as a JSON when GET for '/api/notes'
app.get("/api/notes", function (req, res) {
    console.log("GET--------------" + req.path + "----------------GET");

    console.log("--> Front end is requesting all notes in our database...");

    res.json(notes);            //Return our notes array as a JSON file.
    console.log(notes);

    console.log("... We have given them the array 'notes' -->");

    console.log("GET^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^GET");
})

//Appends the incoming Note to our array of NOTES then return our newly modified notes array, when POST for '/api/notes'
app.post("/api/notes", function (req, res) {
    console.log("POST--------------" + req.path + "----------------POST");

    console.log("--> Front end is attempting to input a new note...")

    const newNote = req.body;           //Set a new object equal to the incoming data from our front-end.
    
    newNote.id = notes.length + 1;      //Set an ID to the new object.

    console.log(newNote.id);
    console.log("^^^ new key");

    notes.push(newNote);                //Add our newly created object to our array of notes.

    storeToDB(notes, location_DB);      //Store our newly modified array to our database.

    console.log("... Back end added the new note to the notes -->");

    console.log("POST^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^POST");

    res.json(notes);                    //Return our newly modified array.
})

app.delete("/api/notes/:id", function (req, res) {
    console.log("DELETE--------------" + req.path + "----------------DELETE");

    const id = parseInt(req.params.id);         //Parse the INTEGER from the incoming value.

    console.log("--> Front end is attempting to delete a note with the id : " + id);

    //For each element within NOTES, check for a matching ID to our parameter.
    for (let i = 0; i < notes.length; i++) {
        //If the ID's are matching
        if (notes[i].id === id) {
            removedNote = notes.splice(i, 1);           //Removes the Note from our array.
            res.json(removedNote);                      //Returns the removed note.
            console.log(removedNote);
        }
    }


    storeToDB(notes, location_DB);      //Store the newly modified array to our database.

    console.log("... Back end removed the note -->");

    console.log("DELETE^^^^^^^^^^^^^^" + req.path + "^^^^^^^^^^^^^^^^DELETE");
})

//Functions//

//Stores incoming JSON files to a specified location.  Then returns the newly modified database data.
async function storeToDB(content, location) {
    console.log("<><><> Storing content to the location '", location, "' <><><>");

    cont_JSON = JSON.stringify(content);            //Stringify the JSON data.

    //Write our data to the specified location.
    await writeFileAsync(location, cont_JSON, function (err) {
        if (err) throw (err);
    });

    //Read from our database and return the newly written data.
    await readFileAsync(location, "utf8", function (err, data) {
        console.log(data);
        return data;
    });
}

//Set our notes array to our database array.
async function setNotes() {
    console.log("Setting notes");

    notes.length = 0;       //Clear out our array.

    //Read from our database and set our notes array to the database array.
    notes = await readFileAsync(location_DB, "utf8").then(function(data){
        console.log(data);
        console.log("Notes set");
        return data;        //Returns the data read from the file to be set to our "notes" array.
    });

    console.log(notes);
};

//Start our server.
app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));