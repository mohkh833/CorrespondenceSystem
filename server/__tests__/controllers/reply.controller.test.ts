import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";
import connection from "../../database";
// import db from "../config/database";
var mongoose = require('mongoose');

const agent = request.agent(app);

// beforeAll(async () => await db.connect());
// // afterEach(async () => await db.clear());
// afterAll(async () => await db.close());




const data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    Starred:false,
    isDeleted: false
}

describe('Test Reply Controller', () => {
    let id = ''
    let replyId = ''
    let threadId = ''
    let draftId = ''
    let replyData :any
    let draftedData :any
    let lastId = ''
    let editedDraft = ''
    beforeAll(async() =>{
        const correspondence = new Correspondence({
            "content": data
        })
        await correspondence.save()
        id = correspondence._id.toString()
    })
    test('Test Reply To message POST /messages/replies',    async () => {
        const response = await request(app).post('/messages/replies').send({
            replyTo:id,
            data:data
        })
        .expect(200)
        replyId = response.body.data._id  
        replyData = response.body.data
        threadId = response.body.data.threadId.toString()
        
        expect(response.body.message).toEqual('replied successfully')
    })

    test('Test Data not sent', async ()=>{
        const response = await request(app).post('/messages/replies').send({
            replyTo:id
        })
        .expect(400)
        
        expect(response.body.message).toEqual('data is not sent')
    })

    describe('Test get message by reply Id GET /messages/replies/:replyId' , () => {
        test('Success Request', async () => {
            const response = await request(app).get(`/messages/replies/${replyId}`)
            .expect(200)
            expect(response.body.correspondence_no).toEqual(replyData.content.correspondence_no)
            expect(response.body.correspondence_body).toEqual(replyData.content.correspondence_body)
            expect(response.body.correspondence_subject).toEqual(replyData.content.correspondence_subject)
            // expect(response.body).toEqual(replyData.content)
        })

        test('not found reply Request', async () => {
            let fakeId = '634ebef5bdbe4b123647bb16'
            const response = await request(app).get(`/messages/replies/${fakeId}`)
            expect(404)
            expect(response.body.message).toEqual('Reply not found')
            // expect(response.body).toEqual(replyData.content)
        })

        test('invalid reply Request', async () => {
            let fakeId = '634ebef5bdbe4b123647bb16f'
            const response = await request(app).get(`/messages/replies/${fakeId}`)
            .expect(500)
            expect(response.body.message).toEqual('Not Object reply Id')
            // expect(response.body).toEqual(replyData.content)
        })
    })


    describe('Test Draft Replies /messages/replies/{replyId}/draft' , () => {
        test('Success Request', async () => {
            const response = await request(app).put(`/messages/replies/${replyId}/draft?isReply=false`).send({data:data, threadId: threadId})
            .expect(200)
            expect(response.body.data.content.replyTo).toEqual(replyId)
            expect(response.body.data.threadId).toEqual(threadId)
            draftId = response.body.data._id.toString()
            draftedData = response.body.data.content
        })

        test('Test Data not sent', async ()=>{
            const response = await request(app).put(`/messages/replies/${replyId}/draft?isReply=false`).send({threadId: threadId})
            .expect(400)
            
            expect(response.body.message).toEqual('data is not sent')
        })

        describe('Test Get Drafted Reply' , () => {
            
            test('Success Request', async () => {
                const response = await request(app).get(`/messages/replies/${replyId}/draft`)
                .expect(200)
                expect(response.body.correspondence_no).toEqual(draftedData.correspondence_no)
                expect(response.body.correspondence_body).toEqual(draftedData.correspondence_body)
            })
            
            test('Not found Id Request', async () => {
                let fakeId = replyId+'f'
                const response = await request(app).get(`/messages/replies/${fakeId}/draft`)
                .expect(500)
                expect(response.body.message).toEqual('Not Object Id Type')
            })

            test('Invalid Id Request', async () => {
                let fakeId = '634ebef5bdbe4b123647bb16'
                const response = await request(app).get(`/messages/replies/${fakeId}/draft`)
                .expect(404)
                expect(response.body.message).toEqual("This drafted Reply are not found")
            })

        })
    })

    
    describe('Test Edit Drafted Reply PUT /messages/replies/edit-draft/:draftedId ' , () => {
        data.correspondence_body = 'edit draft'
        data.correspondence_no = '00000'
        test('Success Request' , async () => {
            const response = await request(app).put(`/messages/replies/edit-draft/${draftId}`).send({data})
            .expect(200)
            expect(response.body.message).toEqual('draft edited')
            expect(response.body.data.correspondence_body).toEqual('edit draft')
            expect(response.body.data.correspondence_no).toEqual('00000')
            editedDraft = mongoose.Types.ObjectId(response.body.Id)
            console.log(editedDraft)
        })

        test('No data sent' , async() => {
            const response = await request(app).put(`/messages/replies/edit-draft/${draftId}`).send({})
            .expect(400)
            expect(response.body.message).toEqual('Data is not send')
        })

        test('Not found id Request' , async () => {
            let fakeId = '634ebef5bdbe4b123647bb12'
            const response = await request(app).put(`/messages/replies/edit-draft/${fakeId}`).send({data})
            .expect(404)
            expect(response.body.message).toEqual('draft Not found')
        })

        test('invalid id Request' , async () => {
            let fakeId = '634ebef5bdbe4b123647bb12f'
            const response = await request(app).put(`/messages/replies/edit-draft/${fakeId}`).send({data})
            .expect(500)
            expect(response.body.message).toEqual('Not Object reply Id')
        })
    })
    
    describe('Test unDraft Replies PUT /messages/replies/:id/:replyId', () => {
        test('Success Request', async () => {
            const response = await request(app).put(`/messages/replies/${threadId}/${draftId}/undraft`).send({data:draftedData, replyTo:replyId})
            .expect(200)
            expect(response.body.message).toEqual('UnDrafting process success')
            lastId = response.body.id
            console.log(response.body)
            // console.log(lastId)
        })

        test('Not found draft Id Request', async () => {

            let fakeId = '634ebef5bdbe4b123647bb12'
            const response = await request(app).put(`/messages/replies/${threadId}/${fakeId}/undraft`).send({data:draftedData, replyTo:replyId})
            .expect(404)
            expect(response.body.message).toEqual('Draft Not exists')
            
        })

        test('Invalid draft Id Request', async () => {

            let fakeId = '634ebef5bdbe4b123647bb12f'
            const response = await request(app).put(`/messages/replies/${threadId}/${fakeId}/undraft`).send({data:draftedData, replyTo:replyId})
            .expect(500)
            expect(response.body.message).toEqual('Not Object reply Id or Thread Type')
        })

        test('Not found thread Id Request' , async () => {
            let fakeId = '634ebef5bdbe4b123647bb12'
            const response = await request(app).put(`/messages/replies/${fakeId}/${draftId}/undraft`).send({data:draftedData, replyTo:replyId})
            .expect(404)
            expect(response.body.message).toEqual('Thread Not exists')
        })

        test('Invalid thread Id Request' , async () => {
            let fakeId = '634ebef5bdbe4b123647bb12f'
            const response = await request(app).put(`/messages/replies/${fakeId}/${draftId}/undraft`).send({data:draftedData, replyTo:replyId})
            .expect(500)
            expect(response.body.message).toEqual('Not Object reply Id or Thread Type')
        })

        test('Data not sent', async ()=>{
            const response = await request(app).put(`/messages/replies/${threadId}/${draftId}/undraft`).send({replyTo:replyId})
            .expect(400)
            
            expect(response.body.message).toEqual('data is not sent')
        })


    })

    afterAll(async() => {
        await Correspondence.findByIdAndRemove(id)
        await Correspondence.findByIdAndRemove(replyId)
        await Correspondence.findByIdAndRemove(draftId)
        await Correspondence.findByIdAndRemove(lastId)
        await Correspondence.findByIdAndRemove(editedDraft)
    })
})
