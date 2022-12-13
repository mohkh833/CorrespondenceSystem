import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";
import { getDeletedData, formatDeletedDataSent } from "../../src/controllers/trash.controller";

const data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    replyTo:'',
}
describe('Trash Controller', ()=>{
    let id = ''
    let threadId :any= ''
    let arrOfIds :any = []
    let threadIds :any = []
    let replyIds :any = []
    beforeAll(async() =>{
        const correspondence = new Correspondence({
            "content": data
        })
        await correspondence.save()
        id = correspondence._id.toString()
        threadId = correspondence.threadId?.toString()
        arrOfIds.push(id)
        threadIds.push(correspondence.threadId?.toString())
    })

    describe('Get Trashed Messages  GET /messages/delete', () => {
        test('Success Request' , async()=>{
            const res = await request(app).get('/messages/delete')
            console.log(res.body)
            if(res.body.numOfRecords == 0){
                expect(res.statusCode).toEqual(404)
                expect(res.body.message).toEqual('Not found')
            } else {
                expect(res.statusCode).toEqual(200)
                expect(res.body.data).not.toEqual(null)
                expect(res.body.data[0].isDeleted).toEqual(true)
                let queryData = await getDeletedDataFromDatabase()
                expect(res.body.data[0].correspondence_body).toEqual(queryData[0].correspondence_body)
            }
        })

        test('Invalid page or limit ',async () => {
            const res = await request(app).get('/messages/delete?page=-1&limit=-1')
            if(res.body.numOfRecords == 0){
                expect(res.statusCode).toEqual(404)
                expect(res.body.message).toEqual('Not found')
            } else {
                expect(res.statusCode).toEqual(200)
                expect(res.body.data).not.toEqual(null)
                expect(res.body.data[0].isDeleted).toEqual(true)
                let queryData = await getDeletedDataFromDatabase()
                expect(res.body.data[0].correspondence_body).toEqual(queryData[0].correspondence_body)
            }
        })

        test('Not found deleted Messages', async ()=>{
            const res = await request(app).get('/messages/delete')
            if(res.body.records == 0){
                expect(res.statusCode).toEqual(404)
                expect(res.body.message).toEqual('Not found')
            } 
        })

        
    })


    test('PUT /messages/delete', async() => {
        const res = await request(app).put('/messages/delete').send({arrOfIds:arrOfIds})
        .expect(200)
        expect(res.body.message).toEqual('message deleted successfully')
        let isDeleted = await checkIfDeleted(arrOfIds[0])
        expect(isDeleted).toEqual(true)
    })

    describe('Deleted Threads PUT /messages/deleteThreads',  () => {

        test('Success Request' , async() =>{
            data.replyTo = id
            const reply = new Correspondence({
                "content": data,
                "thread": threadId
            })
            await reply.save()
            replyIds.push(reply._id)
            const res = await request(app).put('/messages/deleteThreads').send({threadIds:threadIds})
            .expect(200)
            expect(res.body.message).toEqual('deleted Successfully')
        })

        test('No threadId Sent' , async() =>{
            data.replyTo = id
            const reply = new Correspondence({
                "content": data,
                // "thread": threadId
            })
            await reply.save()
            replyIds.push(reply._id)
            const res = await request(app).put('/messages/deleteThreads').send({})
            .expect(400)
            expect(res.body.message).toEqual('Thread Ids are not sent')
        })

        test('No threadId Found' , async() =>{
            data.replyTo = id
            let fakeThreadId = '634ebef5bdbe4b123647bb16'
            let fakeThreadIds = []
            fakeThreadIds.push(fakeThreadId)
            const reply = new Correspondence({
                "content": data,
                "thread": fakeThreadId
            })
            await reply.save()
            replyIds.push(reply._id)
            const res = await request(app).put('/messages/deleteThreads').send({threadIds:fakeThreadIds})
            .expect(404)
            expect(res.body.message).toEqual('Thread Ids are not found')
        })

        test('Invalid threadId' , async() =>{
            data.replyTo = id
            let fakeThreadId = '634ebef5bdbe4b123647bb16f'
            let fakeThreadIds = []
            fakeThreadIds.push(fakeThreadId)
            const reply = new Correspondence({
                "content": data,
                "thread": fakeThreadId
            })
            await reply.save()
            replyIds.push(reply._id)
            const res = await request(app).put('/messages/deleteThreads').send({threadIds:fakeThreadIds})
            .expect(500)
            expect(res.body.message).toEqual('Invalid thread Id')
        })


    })



    afterAll(async() => {

        await Correspondence.findByIdAndDelete(id)
        threadIds.forEach(async(item:any) => {
            await Correspondence.findByIdAndDelete(item)
        })

        replyIds.forEach(async(item:any) => {
            await Correspondence.findByIdAndDelete(item)
        })
    })
})

const getDeletedDataFromDatabase = async() => {
    let page =1
    let limit = 20
    let value = await getDeletedData(limit, page)
    return formatDeletedDataSent(value)
}

const checkIfDeleted = async(id:string) => {
    let value = await Correspondence.findById(id)
    if(value?.content?.isDeleted)
        return true;
    return false
}