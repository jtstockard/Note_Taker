const fs = require("fs");
const path = require("path");

const notesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../db/db.json"), (err, data) => {
    if (err) throw err;
  })
);

function writeNotesData(notesData) {
  fs.writeFileSync(path.join(__dirname, "../db/db.json"), JSON.stringify(notesData), (err) => {
    if (err) throw err;
  });
}

function getId(notesData) {
  if (notesData.length === 0) {
    return 0;
  }

  notesData.sort((a, b) => a.id - b.id);

  const nextIndexAfterLast = notesData.length;
  for (let i = 0; i < nextIndexAfterLast; i++) {
    if (notesData[i].id !== i) {
      return i;
    }
  }

  return nextIndexAfterLast;
}

module.exports = (app) => {
  app.get("/api/notes", (req, res) => res.json(notesData));

  app.post("/api/notes", (req, res) => {
    let data = req.body;
    data.id = getId(notesData);
    notesData.push(data);
    writeNotesData(notesData);
    return res.json(notesData);
  });

  app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    for (let i = 0; i < notesData.length; ++i) {
      if (id === notesData[i].id) {
        notesData.splice(i, 1);
        return;
      }
    }
    writeNotesData(notesData);
    res.send(notesData);
  });
};
