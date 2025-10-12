import { Note } from "../models/note.model.js"
import { asyncHandler } from "./utils/asyncHandler.js"
import { ApiError } from "./utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"


export const getProjectNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const notes = await Note.find({ projectId })

  if (!notes) {
    throw new ApiError(404, "No notes found for this project")
  }

  res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"))
});

export const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { title, content } = req.body
  const userId = req.user._id

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required")
  }

  const note = await Note.create({
    projectId,
    title,
    content,
    createdBy: userId,
  })

  res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"))
})

export const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params
  const note = await Note.findById(noteId)

  if (!note) {
    throw new ApiError(404, "Note not found")
  }

  res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"));
})


export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const note = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});


export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
});
