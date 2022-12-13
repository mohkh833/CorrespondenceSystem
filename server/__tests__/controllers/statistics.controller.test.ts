import request from "supertest";
import app from "../../src/index"
import { getCount } from "../../src/controllers/statistics.controllers";
// import db from "../config/database";
// beforeAll(async () => await db.connect());
// // afterEach(async () => await db.clear());
// afterAll(async () => await db.close()); 
const getCountFromDB = async () => {
    return await getCount()
} 
describe(' Statistics Controller GET /messages/count', () => {
    test('Success Request', async ()=>{
        const response = await request(app).get('/messages/count')
        .expect(200)
        expect(response.body.unreadCount).not.toBeNull()
        expect(response.body.starredCount).not.toBeNull()
        expect(response.body.trashedCount).not.toBeNull()
        expect(response.body.draftedCount).not.toBeNull()
        expect(response.body.sentCount).not.toBeNull()
        
    })

    test('Test Numbers ', async ()=>{
        const response = await request(app).get('/messages/count')
        .expect(200)
        let db = await getCountFromDB()
        expect(response.body.starredCount).toEqual(db.starredCount)
        expect(response.body.trashedCount).toEqual(db.trashedCount)
        expect(response.body.draftedCount).toEqual(db.draftedCount)
        expect(response.body.unreadCount).toEqual(db.unreadCount)
        expect(response.body.sentCount).toEqual(db.sentCount)
        
    })
})