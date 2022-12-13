import request from "supertest";
import app from "../../src/index"
import { Correspondence } from "../../src/models/cors.model";
import { getInboxCount, getInboxData, formatDataSent } from "../../src/controllers/inbox.controller";

const data = {
  correspondence_no: "280", correspondence_type: "Unde ad deserunt aut", entry_no: "422", to_entity: "Vero rerum doloremqu", to_department: "Laboriosam dolorem ", classification: "Ut sed similique eaq", correspondence_subject: "Fuga Blanditiis vol", correspondence_body: "<p>fwqfafqafqwffwq</p>", priority: "Voluptatem adipisic", await_reply: true, due_date: "2022-10-19T00:00:00+02:00", cc_entity: ["Adipisci ea labore q"]
}

const getDataFromDatabase = async () => {
  let page = 1
  let limit = 20
  let value = await getInboxData(limit, page)
  return formatDataSent(value)
}

describe('Test Inbox Messages Controller', () => {

  let id = ''
  describe('POST /messages/ Test Sending Messages', () => {
    test('Send Message', async () => {
      const res = await request(app).post('/messages/').send({ data });
      expect(200)
      expect(res.body.message).toEqual("correspondence Sent")
      id = res.body.data._id
    })
  })

  describe('POST /messages/status/:id Test Reading Messages', () => {
    test('Success Request', async () => {
      const res = await request(app).put(`/messages/status/${id}`)
      expect(200)
      expect(res.body.message).toEqual('read successfully')
    })

    test('Not found Id', async () => {
      let fakeId = '634ebef5bdbe4b123647bb12'
      const res = await request(app).put(`/messages/status/${fakeId}`)
      expect(404)
      expect(res.body.message).toEqual('data is not found')
    })

    test('Invalid Id', async () => {
      let fakeId = '634ebef5bdbe4b123647bb12f'
      const res = await request(app).put(`/messages/status/${fakeId}`)
      expect(500)
      expect(res.body.message).toEqual('Invalid Id')
    })
  })

  describe("GET /messages/ Test get Inbox Threads Route", () => {

    test("Success Request", async () => {
      let count = await getInboxCount()
      const res = await request(app).get("/messages").expect(200);
      expect(res.body.message).toEqual('Inbox Message returned successfully')
      expect(res.body.data).not.toBeNull();
      let value = await getDataFromDatabase()
      expect(res.body.data[0].correspondence_body).toEqual(value[0].correspondence_body)
      expect(res.body.numOfRecords).toEqual(count);
    });
    
    test("Invalid page and limit value", async () => {
      const res = await request(app).get("/messages?page=-1 &limit=-1").expect(200);
      expect(res.body.message).toEqual('Inbox Message returned successfully')
      expect(res.body.data).not.toBeNull();
      expect(res.body.numOfRecords).not.toEqual(0);
    });

    test("Not found page", async () => {
      const res = await request(app).get("/messages?page=9").expect(404);
      expect(res.body.message).toEqual('Not Found')
      expect(res.body.data).not.toBeNull();
      expect(res.body.numOfRecords).toEqual(0);
    });
  });

  afterAll(async () => {
    await Correspondence.findByIdAndRemove(id)
  })

})



// describe('POST /messages/status/:id Test Reading Messages' , () => {
//   test('Read Message', async () => {
//     const res = await request(app).post('/messages/status/')
//     expect(200)
//     expect(res.body.message).toEqual('')
//   })
// })


// describe("Test Thread Not found", () => {
//   test("No Inbox Threads", async () => {
//     const res = await request(app).get("/messages").expect(404);
//     expect(res.body.message).toEqual('Not Found')
//     expect(res.body.numOfRecords).toEqual(0)
//   });
// })