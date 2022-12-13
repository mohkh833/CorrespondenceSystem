import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";

const data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    replyTo:'',
    Starred:false,
    isDeleted: false
  }

describe('Test Inbox Details Controller GET /messages/:id  get Details' , () => {
    let id = ''
    beforeAll(async() =>{
        const correspondence = new Correspondence({
            "content": data
        })
        await correspondence.save()
        id = correspondence._id.toString()
    })
    test('Success Request' , async () =>{
        const response = await request(app).get(`/messages/${id}`)
        if(response.body.data != undefined){
            expect(response.statusCode).toEqual(200)
            expect(response.body.data).not.toEqual(null)
            expect(response.body.messageCount).not.toEqual(null)
            expect(response.body.messagesCount).not.toEqual(null)
            expect(response.body.drafts).not.toEqual(null)
        }
        else {
            expect(response.statusCode).toEqual(404)
            expect(response.body.message).toEqual('Thread Not found')
        }

    })

    test('Not found Thread Id ' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16'
        const response = await request(app).get(`/messages/${fakeId}`)
            .expect(404)
            expect(response.body.message).toEqual('Thread Not found')
    })

    test('Invalid Thread Id' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16f'
        const response = await request(app).get(`/messages/${fakeId}`)
            .expect(500)
            expect(response.body.message).toEqual('Invalid thread Id')
    })

    afterAll(async()=>{
        await Correspondence.findByIdAndDelete(id)
    })
})

describe('Test Starred Details Controller GET /messages/:id  get Starred Details' , () => {
    let id = ''
    beforeAll(async() =>{
        data.Starred = true
        const correspondence = new Correspondence({
            "content": data
        })
        await correspondence.save()
        id = correspondence._id.toString()
    })

    test('Success Request' , async () =>{
        const response = await request(app).get(`/messages/${id}?title=starred`)
        if(response.body.data != undefined){
            expect(200)
            expect(response.body.data).not.toEqual(null)
            expect(response.body.messageCount).not.toEqual(null)
            expect(response.body.messagesCount).not.toEqual(null)
            expect(response.body.drafts).not.toEqual(null)
        }
        else {
            expect(404)
            expect(response.body.message).toEqual('Thread Not found')
        }
    })

    test('Not found Thread Id ' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16'
        const response = await request(app).get(`/messages/${fakeId}?title=starred`)
            expect(404)
            expect(response.body.message).toEqual('Thread Not found')
    })

    test('Invalid Thread Id' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16f'
        const response = await request(app).get(`/messages/${fakeId}?title=starred`)
            expect(500)
            expect(response.body.message).toEqual('Invalid thread Id')
    })

    afterAll(async()=>{
        await Correspondence.findByIdAndDelete(id)
    })
})

describe('Test trashed Details Controller GET /messages/:id  get Trashed Details' , () => {
    let id = ''
    beforeAll(async() =>{
        data.isDeleted = true
        const correspondence = new Correspondence({
            "content": data
        })
        await correspondence.save()
        id = correspondence._id.toString()
    })

    test('Success Request' , async () =>{
        const response = await request(app).get(`/messages/${id}?title=trash`)
        if(response.body.data != undefined){
            expect(200)
            expect(response.body.data).not.toEqual(null)
            expect(response.body.messageCount).not.toEqual(null)
            expect(response.body.messagesCount).not.toEqual(null)
            expect(response.body.drafts).not.toEqual(null)
        }
        else {
            expect(404)
            expect(response.body.message).toEqual('Thread Not found')
        }
    })

    test('Not found Thread Id ' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16'
        const response = await request(app).get(`/messages/${fakeId}?title=trash`)
            expect(404)
            expect(response.body.message).toEqual('Thread Not found')
    })

    test('Invalid Thread Id' , async () =>{
        let fakeId = '634ebef5bdbe4b123647bb16f'
        const response = await request(app).get(`/messages/${fakeId}?title=trash`)
            expect(500)
            expect(response.body.message).toEqual('Invalid thread Id')
    })



    afterAll(async()=>{
        await Correspondence.findByIdAndDelete(id)
    })
})

