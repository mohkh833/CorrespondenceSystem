import Express, { Request, Response } from 'express';
import * as formRenderController from '../controllers/formRender.controller'
const router = Express.Router();

router.get('/', formRenderController.renderForm)

export default router;