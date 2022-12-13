// import request from "supertest";
// import app from "../../src/index"
// import { Correspondence } from "../../src/models/cors.model";
// let query = "mad"
// let data = {
//     correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: '<p>mad</p>', priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"],
//     replyTo:'',
//     sent_date: new Date().toISOString(),
//     Starred:false,
//     isDrafted:false,
//     isDeleted :false
// }

// let ids:any= []
// let inboxId = ''
// let draftId = ''
// let trashId = ''
// let starId = ''

// describe('Test Search Controller' , () => {

//     beforeAll(async()=>{
//         const correspondence = new Correspondence({
//             "content": data
//         })
//         await correspondence.save()
//         // ids.push(correspondence._id.toString())
//         inboxId = correspondence._id.toString()
//         //////////

//         data.Starred = true
//         const starcorrespondence = new Correspondence({
//             "content": data
//         })
//         await starcorrespondence.save()
//         // ids.push(correspondence._id.toString())
//         starId = starcorrespondence._id.toString()

//         /////////
        
//         data.isDeleted = true
//         const deletecorrespondence = new Correspondence({
//             "content": data
//         })
//         await deletecorrespondence.save()
//         // ids.push(correspondence._id.toString())
//         trashId = deletecorrespondence._id.toString()

//         ////////

//         data.isDeleted = false
//         data.isDrafted =true
//         const draftcorrespondence = new Correspondence({
//             "content": data
//         })
//         await draftcorrespondence.save()
//         // ids.push(correspondence._id.toString())
//         draftId = draftcorrespondence._id.toString()

//     })

// describe('Search Inbox Correspondences GET /messages/search ', ()=>{


//     test('Success Request', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&inbox=home`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Invalid page and limit value', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=-1&limit=-20&inbox=home`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Query Not found', async ()=>{
//         let fakeQuery = 'gokogqkokq'
//         const response = await request(app).get(`/messages/search?query=${fakeQuery}&page=-1&limit=-20&inbox=home`)
//         .expect(200)
//         expect(response.body.message).toEqual('No search results returned')
//         expect(response.body.numOfRecords).toEqual(0)
//     })

//     test('No query sent', async () => {
//         const response = await request(app).get(`/messages/search?page=1&limit=20&inbox=home`)
//         .expect(404)
//         expect(response.body.message).toEqual('Query not Sent')
//     })
    
// })

// describe('Search Starred Correspondences GET /messages/search ', ()=>{
//     // beforeAll(async()=>{
//     //     data.Starred = true
//     //     const correspondence = new Correspondence({
//     //         "content": data
//     //     })
//     //     await correspondence.save()
//     //     // ids.push(correspondence._id.toString())
//     //     starId = correspondence._id.toString()
//     // })

//     test('Success Request', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&inbox=starred`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Invalid page and limit value', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=-1&limit=-20&inbox=starred`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Query Not found', async ()=>{
//         let fakeQuery = 'gokogqkokq'
//         const response = await request(app).get(`/messages/search?query=${fakeQuery}&page=-1&limit=-20&inbox=starred`)
//         .expect(200)
//         expect(response.body.message).toEqual('No search results returned')
//         expect(response.body.numOfRecords).toEqual(0)
//     })

//     test('No query sent', async () => {
//         const response = await request(app).get(`/messages/search?page=1&limit=20&inbox=starred`)
//         .expect(404)
//         expect(response.body.message).toEqual('Query not Sent')
//     })
// })

// describe('Search Trashed Correspondences GET /messages/search ', ()=>{
//     // beforeAll(async()=>{
//     //     data.isDeleted = true
//     //     const correspondence = new Correspondence({
//     //         "content": data
//     //     })
//     //     await correspondence.save()
//     //     // ids.push(correspondence._id.toString())
//     //     trashId = correspondence._id.toString()
//     // })

//     test('Success Request', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=1&limit=20&inbox=trash`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Invalid page and limit value', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=-1&limit=-20&inbox=trash`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Query Not found', async ()=>{
//         let fakeQuery = 'gokogqkokq'
//         const response = await request(app).get(`/messages/search?query=${fakeQuery}&page=-1&limit=-20&inbox=trash`)
//         .expect(200)
//         expect(response.body.message).toEqual('No search results returned')
//         expect(response.body.numOfRecords).toEqual(0)
//     })

//     test('No query sent', async () => {
//         const response = await request(app).get(`/messages/search?page=1&limit=20&inbox=trash`)
//         .expect(404)
//         expect(response.body.message).toEqual('Query not Sent')
//     })
// })

// describe('Search Draft Correspondences GET /messages/search ', ()=>{
//     // beforeAll(async()=>{
//     //     data.isDeleted = false
//     //     data.isDrafted =true
//     //     const correspondence = new Correspondence({
//     //         "content": data
//     //     })
//     //     await correspondence.save()
//     //     // ids.push(correspondence._id.toString())
//     //     draftId = correspondence._id.toString()
//     // })

//     test('Success Request', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=1&limit=20&inbox=draft`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Invalid page and limit value', async ()=>{
//         const response = await request(app).get(`/messages/search?query=${query}&page=-1&limit=-20&inbox=draft`)
//         .expect(200)
//         // expect(response.body.message).toEqual('Search result returned successfully')
//         // expect(response.body.result[0].correspondence_body).toEqual('<p>'+query+'</p>')
//     })

//     test('Query Not found', async ()=>{
//         let fakeQuery = 'gokogqkokq'
//         const response = await request(app).get(`/messages/search?query=${fakeQuery}&page=-1&limit=-20&inbox=draft`)
//         .expect(200)
//         expect(response.body.message).toEqual('No search results returned')
//         expect(response.body.numOfRecords).toEqual(0)
//     })

//     test('No query sent', async () => {
//         const response = await request(app).get(`/messages/search?page=1&limit=20&inbox=draft`)
//         .expect(404)
//         expect(response.body.message).toEqual('Query not Sent')
//     })

// })


// // afterAll(async()=>{
// //     // ids.forEach(async (item:string)=>{
// //     //     await Correspondence.findByIdAndDelete(item)
// //     // })
// //     await Correspondence.findByIdAndRemove(trashId)
// //     await Correspondence.findByIdAndDelete(inboxId)
// //     await Correspondence.findByIdAndDelete(starId)
// //     await Correspondence.findByIdAndDelete(draftId)
// // })


// })