var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));

db.open(function() {
    console.log("mongo db is opened!");
    db.collection('notes', function(error, notes) {
        db.notes = notes;
    });

    db.collection('sections', function(error, sections) {
        db.sections = sections;
    });

    db.collection('users', function(error, users) {
        db.users = users;
    });
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));

app.listen(3000);

/*WORKING WITH SECTIONS IN MONGO*/
app.get("/sections", function(req,res) {
    db.sections.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

/*WORKING WITH MONGO DB*/
app.get("/notes", function(req,res) {
    db.notes.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.post("/notes", function(req, res) {
    var note = req.body;
    note.order = req.query.order;
    var date = new Date();
    note.lastUpdated = date;//.toDateString();
    db.notes.insert(note);
    res.end();
});

app.post("/notes/top", function(req, res) {
    //var order = req.query.order;
    db.notes.find().sort({order: -1}).limit(1);

    res.end();
});

app.delete("/notes", function(req,res) {
    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function(err) {
        if (err) {
            console.log(err);
            res.send("Failed")
        } else {
            res.send("Success");
        }
    });
});

app.post("/sections/replace", function(req,resp) {
    //do not clear the list
    if (req.body.length == 0) {
        resp.end();
    }
    db.sections.remove({}, function(err, res) {
        if (err) console.log(err);
        db.sections.insert(req.body, function(err, res) {
            if (err) console.log("err after insert", err);
            resp.end();
        });
    });
});

app.get("/checkUser", function(req, res) {
    res.send(req.query.user.length > 2);
});

app.get("/checkAge", function(req, res) {
    var age = req.query.user.dateOfBirth;
    var parseAge = age.split(".");
    var year = parseAge[2];

    res.send(parseInt(year) < 2003);
});

app.post("/users", function(req, res) {
    db.users.insert(req.body, function(resp) {
        req.session.username = req.body.userName;
        res.end();
    });
});

/*WORKING WITH SESSION*/
//app.get("/notes", function(req,res) {
//    res.send(req.session.notes || []);
//});
//
//app.post("/notes", function(req,res) {
//    if (!req.session.notes) {
//        req.session.notes = [];
//        req.session.last_note_id = 0;
//    }
//    var note = req.body;
//    note.id = req.session.last_note_id;
//    req.session.last_note_id++;
//    req.session.notes.push(note);
//
//    res.end();
//});
//
//app.post("/notes/top", function(req,res) {
//    if (!req.session.notes) {
//        req.session.notes = [];
//        req.session.last_note_id = 0;
//    }
//    var note = req.body;
//    note.id = req.session.last_note_id;
//    req.session.last_note_id++;
//    req.session.notes.splice(0,0, note);
//
//    res.end();
//});
//
//app.delete("/notes", function(req,res) {
//    var id = req.query.id;
//    var notes = req.session.notes || [];
//    var updatedNotesList = [];
//    for (var i=0; i<notes.length; i++) {
//        if (notes[i].id != id) {
//            updatedNotesList.push(notes[i]);
//        }
//    }
//    req.session.notes = updatedNotesList;
//    res.end();
//});
//
//app.get("/notes", function(req,res) {
//    var notes = [
//        {text: "First note"},
//        {text: "Second note"},
//        {text: "Third note"}
//    ];
//    res.send(notes);
//});

/*WORKING WITH FILE*/
//app.post("/notes", function(req,res) {
//    if (!req.session.noteCount) {
//        req.session.noteCount = 0;
//    }
//
//    var note = req.body;
//
//    note.id = req.session.noteCount;
//    req.session.noteCount++;
//
//    var noteText = JSON.stringify(note) + "\n";
//    fs.appendFile("notes.json", noteText, function() {
//        res.end();
//    });
//});
//
//app.get("/notes", function(req,res) {
//    if (!req.session.noteCount) {
//        req.session.noteCount = 0;
//    }
//
//    fs.readFile("notes.json", function(err, result) {
//        if (result) {
//            result = ""+result;
//            result = result.substring(0, result.length - 1);
//            result = "[" + result + "]";
//            result = result.split("\n").join(",");
//            res.send(result);
//        } else {
//            res.end();
//        }
//    });
//});
//
//app.delete("/notes", function(req,res) {
//    var id = req.query.id;
//    var notes = req.session.notes || [];
//    var updatedNotesList = [];
//    for (var i=0; i<notes.length; i++) {
//        if (notes[i].id != id) {
//            updatedNotesList.push(notes[i]);
//        }
//    }
//    req.session.notes = updatedNotesList;
//    res.end();
//});


