const { mockRequest, mockResponse } = require('jest-mock-req-res');
const { getAllNotes } = require('../controllers/noteController'); // Import your file containing the getAllNotes function
const Note = require('../models/noteModel'); // Import the Note model
const { sendResponse } = require('../utils/sendResponse'); // Import the sendResponse utility

// Mocking the Note model and sendResponse function
jest.mock('../models/noteModel');
jest.mock('../utils/sendResponse');


// Mocking the Note model methods
Note.find.mockResolvedValue([{ _id: '1', title: 'Note 1', content: 'Content 1' }, { _id: '2', title: 'Note 2', content: 'Content 2' }]);

// Mocking the sendResponse method
sendResponse.mockImplementation((res, status, message, data) => {
    return res.status(status).json({ message, data });
});

// Test for successful retrieval of notes
test('getAllNotes - Notes fetched successfully', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await getAllNotes(req, res);

    expect(Note.find).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Notes fetched successfully', expect.arrayContaining([
        expect.objectContaining({ _id: '1', title: 'Note 1', content: 'Content 1' }),
        expect.objectContaining({ _id: '2', title: 'Note 2', content: 'Content 2' }),
    ]));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: 'Notes fetched successfully', data: expect.arrayContaining([
            expect.objectContaining({ _id: '1', title: 'Note 1', content: 'Content 1' }),
            expect.objectContaining({ _id: '2', title: 'Note 2', content: 'Content 2' }),
        ])
    });
});

// Test for internal server error
test('getAllNotes - Internal server error', async () => {
    const req = mockRequest();
    const res = mockResponse();

    // Simulate an error during Note.find
    Note.find.mockRejectedValue(new Error('Some error occurred'));

    await getAllNotes(req, res);

    expect(Note.find).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Something went wrong');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong' });
});
