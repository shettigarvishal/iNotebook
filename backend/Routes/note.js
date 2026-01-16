const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 4:GET all user details using GET "/api/note/getuser" login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 5:Add a new notes using POST "/api/note/addnote" login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    //If there is error returns bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savednote = await note.save();

      //const notes=await Notes.find({user:req.user.id})
      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 6:Updating notes using PUT "/api/note/update" login required
router.put("/update/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //Create a new note object
    const newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    //find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("not allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 7:Deleteing notes using DELETE "/api/note/delete" login required
router.put("/delete/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(400).send("not found");
    }

    //allow deletion only if the user owns this note

    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json("success:note has been deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
