import request from "supertest";
import app from "../../src/index"
import {formSchema} from "../../src/models/corsForm.model"

describe('Test formRender ' , ()=>{
    test('Form Render', async ()=> {
        const response = await request(app).get('/form-render')
        .expect(200)
        expect(response.body.components).toEqual(formSchema.components)
    })
})
