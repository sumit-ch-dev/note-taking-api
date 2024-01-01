const supertest = require('supertest')
const app = require('../app');


describe('Notes', () => {
    describe('GET /notes', () => {
        describe("when there are no notes", () => {
            it("should return a 400", async () => {
                const noteId = 're343243435'

                await supertest(app).get(`/notes/${noteId}`).expect(400)
            })
        })
    })
})
