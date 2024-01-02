const { mockRequest, mockResponse } = require('jest-mock-req-res');
const { getNoteById } = require('../controllers/noteController');
const { sendResponse } = require('../utils/sendResponse.js');
const Note = require('../models/noteModel');

jest.mock('../models/noteModel');
jest.mock('../utils/sendResponse');


Note.findById.mockResolvedValue(null);
Note.findById.mockResolvedValue({ _id: 'someId', title: 'Test Note', content: 'Test content' });

// Mocking the sendResponse method
sendResponse.mockImplementation((res, status, message, data) => {
    return res.status(status).json({ message, data });
});

// Test for when a note is found

describe('getNoteById', () => {
    describe('when a note is found', () => {
        test('getNoteById - Note found', async () => {
            const req = mockRequest({ params: { id: 'someId' } });
            const res = mockResponse();

            await getNoteById(req, res);

            expect(Note.findById).toHaveBeenCalledWith('someId');
            expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Note fetched successfully', { _id: 'someId', title: 'Test Note', content: 'Test content' });
        });
    })
})


test('returns a 404 status code', async () => {
    const req = mockRequest({ params: { id: 'nonExistentId' } });
    const res = mockResponse();

    await getNoteById(req, res);

    expect(Note.findById).toHaveBeenCalledWith('nonExistentId');
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Note not found');
});
// Test for when a note is not found
// test('getNoteById - Note not found', async () => {
//     const req = mockRequest({ params: { id: 'nonExistentId' } });
//     const res = mockResponse();

//     await getNoteById(req, res);

//     expect(Note.findById).toHaveBeenCalledWith('nonExistentId');
//     expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Note not found');
// });

// Test for internal server error
test('getNoteById - Internal server error', async () => {
    const req = mockRequest({ params: { id: 'someId' } });
    const res = mockResponse();

    // Simulate an error during Note.findById
    Note.findById.mockRejectedValue(new Error('Some error occurred'));

    await getNoteById(req, res);

    expect(Note.findById).toHaveBeenCalledWith('someId');
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Something went wrong');
});
