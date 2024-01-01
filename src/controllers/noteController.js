const HTTP_STATUS = require('../constants/statusCodes')
const Note = require('../models/noteModel')
const { sendResponse } = require('../utils/sendResponse')


const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({})
        return sendResponse(res, HTTP_STATUS.OK, "Notes fetched successfully", notes);
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

// Function to get a specific note by ID
const getNoteById = async (req, res) => {
    try {
        const { id } = req.params
        const note = await Note.findById(id)
        if (!note) {
            return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Note not found");
        }
        return sendResponse(res, HTTP_STATUS.OK, "Note fetched successfully", note);
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

// Function to create a new note
const createNote = async (req, res) => {
    try {
        const { title, content } = req.body
        if (!title || !content) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Please provide all required fields");
        }
        const note = await Note.create({ title, content })
        return sendResponse(res, HTTP_STATUS.CREATED, "Note created successfully", note);
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

// Function to update an existing note
const updateNote = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content } = req.body
        const note = await Note.findById(id)
        if (!note) {
            return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Note not found");
        }
        note.title = title || note.title
        note.content = content || note.content
        await note.save()
        return sendResponse(res, HTTP_STATUS.OK, "Note updated successfully", note);
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

// Function to delete a note
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params
        const note = await Note.findById(id)
        if (!note) {
            return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Note not found");
        }
        await Note.deleteOne({ _id: id });
        return sendResponse(res, HTTP_STATUS.OK, "Note deleted successfully");
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}


// Export the controller functions
module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
};
