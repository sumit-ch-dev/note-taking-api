const express = require("express");
const router = express.Router();
const { getAllNotes, createNote, getNoteById, updateNote, deleteNote } = require("../../controllers/noteController");
const { noteValidationRules, validate, validateNoteId } = require('../../middleware/validation')

router.get("/", getAllNotes);
router.post("/", noteValidationRules(), validate, createNote);
router.get("/:id", validateNoteId(), validate, getNoteById);
router.put("/:id", validateNoteId(), validate, noteValidationRules(), validate, updateNote);
router.delete("/:id", validateNoteId(), validate, deleteNote);

module.exports = router;