import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";
import {getStarredData, formatDataSent} from "../../src/controllers/star.controller"


let data = {
    correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
    replyTo: '',
    Starred:false,
    isDrafted: false,
    isDeleted: true
}




const getStarredDataBase = async () => {
    let page = 1
    let limit = 20
    let value =  await getStarredData(limit, page)
    return formatDataSent(value) 
}

describe('Test Starred Messages Controller ', () => {

    describe('GET /messages/star Test get Starred Messages', () => {
        test('Success Request', async () => {
            const res = await request(app).get('/messages/star')
            
            if(res.body.numOfRecords ==0){
                expect(404)
                expect(res.body.message).toEqual('Not Found')
            }
            else {

                expect(res.body.data).not.toBeNull()
                expect(res.body.data[0].ThreadStarred).toEqual(true)
                let dbQuery = await getStarredDataBase()
                
                expect(res.body.data[0].correspondence_no).toEqual(dbQuery[0].correspondence_no)
                expect(res.body.numOfRecords).not.toEqual(0)
                expect(res.body.message).toEqual('Starred Messages returned successfully')
            }
        })


        test('Invalid page and limit ',async () => {
            
            const res = await request(app).get("/messages/star?page=-1 &limit=-1")
            if(res.body.numOfRecords ==0){
                expect(404)
                expect(res.body.message).toEqual('Not Found')
            } else {
                expect(res.body.message).toEqual('Starred Messages returned successfully')
                expect(res.body.data).not.toBeNull();
                expect(res.body.numOfRecords).not.toEqual(0);
                let dbQuery = await getStarredDataBase()
                expect(res.body.data[0].correspondence_no).toEqual(dbQuery[0].correspondence_no)
            }
        })

        test('Not found page Id', async ()=> {
            const res = await request(app).get("/messages/star?page=9").expect(404);
            expect(res.body.message).toEqual('Not Found')
            expect(res.body.data).not.toBeNull();
            expect(res.body.numOfRecords).toEqual(0);
        })

        test('Starred Message is not deleted', async ()=>{
            const res = await request(app).get('/messages/star')
            if(res.body.numOfRecords ==0){
                expect(res.statusCode).toEqual(404)
                expect(res.body.message).toEqual('Not Found')
            } else{
                expect(res.statusCode).toEqual(200)
                expect(res.body.data).not.toBeNull()
                expect(res.body.data[0].ThreadStarred).toEqual(true)
                expect(res.body.data[0].isDeleted).toEqual(false)
                let dbQuery = await getStarredDataBase()
                
                expect(res.body.data[0].correspondence_no).toEqual(dbQuery[0].correspondence_no)
                expect(res.body.numOfRecords).not.toEqual(0)
                expect(res.body.message).toEqual('Starred Messages returned successfully')
            }
        })
    })

    describe('PUT /messages/star/:id Test star and unstar single Message', () => {
        let id = ''
        let draftedId = ''

        test('Star Message', async () => {
            const correspondence = new Correspondence({
                "content": data
            })
            await correspondence.save()
            id = correspondence._id.toString()

            const res = await request(app).put(`/messages/star/${id}`).send({ starred: true })
            .expect(200)
            expect(res.body.message).toEqual('staring process done successfully')
            expect(res.body.data.content.Starred).toEqual(true)
            
        })

        test('Star Drafted Message' , async () => {
            data.isDrafted = true
            const correspondence = new Correspondence({"content": data})
            await correspondence.save()
            draftedId = correspondence._id.toString()

            const res = await request(app).put(`/messages/star/${draftedId}`).send({ starred: true })
            expect(200)
            expect(res.body.message).toEqual('staring process done successfully')
            expect(res.body.data.content.Starred).toEqual(true)
            
        })

        test('unStar Message', async () => {
            const res = await request(app).put(`/messages/star/${id}`).send({ starred: false })
            .expect(200)
            expect(res.body.message).toEqual('unstaring process done successfully')
            expect(res.body.data.content.Starred).toEqual(false)

        })

        test('unStar Drafted Message' , async () => {

            const res = await request(app).put(`/messages/star/${draftedId}`).send({ starred: false })
            .expect(200)
            expect(res.body.message).toEqual('unstaring process done successfully')
            expect(res.body.data.content.Starred).toEqual(false)
            
        })



        afterAll(async () => {
            await Correspondence.findByIdAndRemove(id)
            await Correspondence.findByIdAndRemove(draftedId)
        })
    })

    describe('PUT /messages/star/:id Test unstar all thread', ()=>{
        let id = ''
        let threadId : any= ''
        let arrOfIds:any = []
        beforeAll(async()=>{
            data.isDrafted = false
            data.Starred = true
            const correspondence = new Correspondence({
                "content": data
            })
            await correspondence.save()
            id = correspondence._id.toString()
            arrOfIds.push(id)
            data.replyTo = id 
            threadId = correspondence.threadId
            let reply1 = new Correspondence({
                "content":data,
                "thread": correspondence.threadId
            })
            reply1.save()
            arrOfIds.push(reply1._id.toString())
        })

        test('Unstaring entire thread', async() =>{
            const res = await request(app).put(`/messages/star/${id}?location=inbox`).send({starred:false, threadId:threadId })
            .expect(200)
            let isStarred = await CheckIfThreadStarred(threadId)
            expect(res.body.message).toEqual('unstaring process done successfully')
            expect(isStarred).toEqual(false)
        })

        afterAll(async ()=>{
            arrOfIds.forEach(async(item:any) => {
                await Correspondence.findByIdAndDelete(item)
            })
        })
    })

    describe('GET /messages/star Test Deleted Not exist in starred', ()=>{
        let deletedId = ''
        beforeAll( async ()=>{
            data.isDeleted = true
            data.Starred = true
            const correspondence = new Correspondence({
                "content": data
            })
            await correspondence.save()
            deletedId = correspondence._id.toString()
        })

        test('Check if Deleted Not exists in starred', async ()=>{
            const res = await request(app).get(`/messages/${deletedId}?title=starred`)
            .expect(404)
        })

        afterAll(async () =>{
            await Correspondence.findByIdAndRemove(deletedId)
        })
    })

    describe('GET /messages/star Test Drafted exist in starred', ()=>{
        let draftedId = ''
        beforeAll( async ()=>{
            data.isDrafted = true
            data.Starred = true
            const correspondence = new Correspondence({
                "content": data
            })
            await correspondence.save()
            draftedId = correspondence._id.toString()
        })

        test('Check if Drafted exists in starred', async ()=>{
            const res = await request(app).get(`/messages/star`)
            let value = false
            res.body.data.map((item:any)=>{
                if(item.isDrafted){
                    value = true
                }
            })
            expect(value).toEqual(true)
        })
        afterAll(async () =>{
            await Correspondence.findByIdAndRemove(draftedId)
        })
    })

    describe('Test invalid body value', ()=>{
        let id =''
        test('Test Invalid body value ', async()=>{
            const correspondence = new Correspondence({
                "content": data
            })
            await correspondence.save()
            id = correspondence._id.toString()

            const res = await request(app).put(`/messages/star/${id}`).send({ starred: "string" })
            .expect(400)
            expect(res.body.message).toEqual('body Should be boolean')
        })
        afterAll(async () =>{
            await Correspondence.findByIdAndRemove(id)
        })
    })
})

const CheckIfThreadStarred = async (threadId:string) => {
    let res : any= await Correspondence.aggregate([
        {
            $match:{
                threadId:threadId
            }
        },
        {
			$group: {
				_id: "$threadId",
				Correspondence: { $push: "$$ROOT" },
				isStarred: { $max: "$content.Starred" },
			},
		},
        {
			$project: {
				"isStarred": 1,
			},
		},
    ])

    if(res[0].isStarred == true)
        return true
    
    return false
}




// unit test unstaring all messages inside thread 