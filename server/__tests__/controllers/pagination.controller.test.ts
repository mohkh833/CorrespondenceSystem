import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";

const data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    sent_date: Date.now(),
    replyTo: '',
    Starred: false,
    isDeleted: false
}


describe('test Pagination Controller', () => {
    let firstId = ''
    let firstThread: any = ''
    let secondId = ''
    let secondThread: any = ''

    describe('Test Inbox Threads', () => {

        beforeAll(async () => {
            const firstCorrespondence = new Correspondence({
                "content": data
            })

            firstThread = firstCorrespondence.threadId?.toString()
            firstId = firstCorrespondence._id.toString()
            await firstCorrespondence.save()

            const secondCorrespondence = new Correspondence({
                "content": data
            })
            secondThread = secondCorrespondence.threadId?.toString()
            secondId = secondCorrespondence._id.toString()
            await secondCorrespondence.save()
        })

        test('GET /messages/next/{id}/{lastReply} Test next Pagination', async () => {
            const response = await request(app).get(`/messages/next/${firstThread}/${firstId}`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(secondThread)
        })

        test('GET /messages/prev/{id}/{lastReply} Test prev Pagination', async () => {
            const response = await request(app).get(`/messages/prev/${secondThread}/${secondId}`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(firstThread)
        })

        test('No next thread Found', async () => {
            let fakeId = 'abcdbef5bdbe4b123647bb16'
            const response = await request(app).get(`/messages/next/${firstThread}/${fakeId}`)
            .expect(404)
            expect(response.body.message).toEqual('There is no next thread found')
        })

        afterAll(async () => {
            await Correspondence.findByIdAndDelete(firstId)
            await Correspondence.findByIdAndDelete(secondId)
        })

    })

    describe('Test Starred Threads', () => {

        beforeAll(async () => {
            data.Starred = true
            const firstCorrespondence = new Correspondence({
                "content": data
            })

            firstThread = firstCorrespondence.threadId?.toString()
            firstId = firstCorrespondence._id.toString()
            await firstCorrespondence.save()

            const secondCorrespondence = new Correspondence({
                "content": data
            })
            secondThread = secondCorrespondence.threadId?.toString()
            secondId = secondCorrespondence._id.toString()
            await secondCorrespondence.save()
        })

        test('GET /messages/next/{id}/{lastReply} Test next Pagination', async () => {
            const response = await request(app).get(`/messages/next/${firstThread}/${firstId}?title=starred`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(secondThread)
        })

        test('GET /messages/prev/{id}/{lastReply} Test prev Pagination', async () => {
            const response = await request(app).get(`/messages/prev/${secondThread}/${secondId}?title=starred`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(firstThread)
        })

        afterAll(async () => {
            await Correspondence.findByIdAndDelete(firstId)
            await Correspondence.findByIdAndDelete(secondId)
        })

    })

    describe('Test Trashed Threads', () => {

        beforeAll(async () => {
            data.isDeleted = true
            const firstCorrespondence = new Correspondence({
                "content": data
            })

            firstThread = firstCorrespondence.threadId?.toString()
            firstId = firstCorrespondence._id.toString()
            await firstCorrespondence.save()

            const secondCorrespondence = new Correspondence({
                "content": data
            })
            secondThread = secondCorrespondence.threadId?.toString()
            secondId = secondCorrespondence._id.toString()
            await secondCorrespondence.save()
        })

        test('GET /messages/next/{id}/{lastReply} Test next Pagination', async () => {
            const response = await request(app).get(`/messages/next/${firstThread}/${firstId}?title=trash`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(secondThread)
        })

        test('GET /messages/prev/{id}/{lastReply} Test prev Pagination', async () => {
            const response = await request(app).get(`/messages/prev/${secondThread}/${secondId}?title=trash`)
            .expect(200)
            expect(response.body[0]._id.toString()).toEqual(firstThread)
        })

        afterAll(async () => {
            await Correspondence.findByIdAndDelete(firstId)
            await Correspondence.findByIdAndDelete(secondId)
        })

    })

    describe('Test no next Threads', () => {
        beforeAll(async () => {
            data.isDeleted = false
            data.Starred = false
            const firstCorrespondence = new Correspondence({
                "content": data
            })

            firstThread = firstCorrespondence.threadId?.toString()
            firstId = firstCorrespondence._id.toString()
            await firstCorrespondence.save()
        })

        test('GET /messages/next/{id}/{lastReply} Test no next Pagination', async () => {
            const response = await request(app).get(`/messages/next/${firstThread}/${firstId}`)
            .expect(404)
            expect(response.body.message).toEqual("There is no next thread found")
        })

        afterAll(async () => {
            await Correspondence.findByIdAndDelete(firstId)
        })
    })
})