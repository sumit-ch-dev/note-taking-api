const express = require("express");
const router = express.Router();
const { getAllNotes, createNote, getNoteById, updateNote, deleteNote } = require("../../controllers/noteController");
const { noteValidationRules, validate, validateNoteId, noteUpdateValidationRules } = require('../../middleware/requestValidation')
const { authMiddleware } = require('../../middleware/authMiddleware')

router.get("/", authMiddleware, getAllNotes);
router.get("/:id", authMiddleware, validateNoteId(), validate, getNoteById);
router.post("/", authMiddleware, noteValidationRules(), validate, createNote);
router.get("/:id", authMiddleware, validateNoteId(), validate, noteUpdateValidationRules(), validate, updateNote);
router.delete("/:id", authMiddleware, validateNoteId(), validate, deleteNote);

module.exports = router;