import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";

const data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    isDrafted:true
}

let draftId = ''

describe('draft Message POST /messages/draft', ()=>{
    test('Success Request', async ()=>{
        const response = await request(app).post('/messages/draft').send({data})
        .expect(200)
        expect(response.body.message).toEqual('Drafted Successfully')
        draftId = response.body.data._id.toString()
    })

    test('Data not sent', async ()=>{
        const response = await request(app).post('/messages/draft')
        .expect(400)
        expect(response.body.message).toEqual('Data not sent')
    })
})

describe('get Drafted Messages GET /messages/draft', ()=>{
    test('Success Request', async ()=>{
        const response = await request(app).get('/messages/draft')
        if(response.body.data.length != 0){
            expect(response.statusCode).toEqual(200)
            expect(response.body.numOfRecords).not.toEqual(null)
            expect(response.body.message).toEqual('Drafted Message returned Successfully')
        } else{
            expect(response.statusCode).toEqual(404)
            expect(response.body.message).toEqual('Drafted Message not found')
        }
    })

    test('Not found page', async ()=>{
        const response = await request(app).get('/messages/draft?page=621')
            .expect(404)
            expect(response.body.message).toEqual('Drafted Message not found')
        
    })

    test('Invalid page value & limit value', async ()=>{
        const response = await request(app).get('/messages/draft?page=-1&limit=-5')
        if(response.body.data.length != 0){
            expect(response.statusCode).toEqual(200)
            expect(response.body.numOfRecords).not.toEqual(null)
            expect(response.body.message).toEqual('Drafted Message returned Successfully')
        } else{
            expect(response.statusCode).toEqual(404)
            expect(response.body.message).toEqual('Drafted Message not found')
        }
        
    })
})

let id = ''
describe('get Drafted Messages GET /messages/draft/:id', ()=>{
    beforeAll(async() => {
        const draft = new Correspondence({
            "content": data
        })
        await draft.save()
        id = draft._id.toString()
    })
    test('Success Request', async ()=>{
        const response =await request(app).get(`/messages/draft/${id}`)
        .expect(200)
        expect(response.body.message).toEqual('Draft Message returned Successfully')
        expect(response.body.data).not.toEqual(null)
    })
    test('Not found DraftId', async ()=>{
        let fakeId = '634ebef5bdbe4b123647bb16'
        const response =await request(app).get(`/messages/draft/${fakeId}`)
        .expect(404)
        expect(response.body.message).toEqual('Draft Message is not found')
    })
    test('Invalid DraftId', async ()=>{
        let fakeId = '634ebef5bdbe4b123647bb16f'
        const response =await request(app).get(`/messages/draft/${fakeId}`)
        .expect(500)
        expect(response.body.message).toEqual('Drafted Id is invalid')
    })
})

describe('unDraft Message PUT /messages/draft/:id', ()=>{
    test('Success Request', async ()=>{
        const response = await request(app).put(`/messages/draft/${id}`).send({data})
        .expect(200)
        expect(response.body.message).toEqual('Message undrafted successfully')
        id = response.body.data._id.toString()
    })

    test('Not found Id', async ()=>{
        let fakeId = '634ebef5bdbe4b123647bb16'
        const response = await request(app).put(`/messages/draft/${fakeId}`).send({data})
        .expect(404)
        expect(response.body.message).toEqual('Draft Message is not found')
    })

    test('Invalid Id', async ()=>{
        let fakeId = '634ebef5bdbe4b123647bb16f'
        const response = await request(app).put(`/messages/draft/${fakeId}`).send({data})
        .expect(500)
        expect(response.body.message).toEqual('Invalid Draft Id')
    })
    
    afterAll(async() =>{
        await Correspondence.findByIdAndRemove(id)
        await Correspondence.findByIdAndRemove(draftId)
    })
})

