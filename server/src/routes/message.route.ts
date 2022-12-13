import Express from 'express';
import * as inboxControllers from "../controllers/inbox.controller"
import * as paginationController from "../controllers/pagination.controller"
import * as searchController from "../controllers/search.controller"
import * as statsController from "../controllers/statistics.controllers"
import * as replyController from "../controllers/reply.controller"
import * as starController from "../controllers/star.controller"
import * as draftController from "../controllers/draft.controller"
import * as trashController from "../controllers/trash.controller"
import * as detailsController from "../controllers/details.controller"
// import { body } from 'express-validator'
// import {cors} from "../validators/cors.validator"
const cors = require("../validators/cors.validator")
import { middleware } from '../middleware/joi.middleware';


const router = Express.Router();

// GET messages/replies/:id/draft
router.get('/replies/:replyId/draft', replyController.getDraftedReply)

// PUT messages/replies/:id/draft
router.put('/replies/:id/:replyId/undraft', replyController.undraftReply)

// PUT messages/replies/:id/draft
router.put('/replies/:id/draft', replyController.draftReply)

router.put('/replies/edit-draft/:draftedId', replyController.editDraft)

// GET messages/replies/:id/:replyId
router.get('/replies/:replyId', replyController.getReply)

// PUT messages/replies/:id
router.post('/replies/',
middleware(cors.cors)
,replyController.replyToMessage)

// GET messages/search
router.get('/search', searchController.searchMessage)

// GET messages/prev/:id/:lastReply
router.get('/prev/:id/:lastReply', paginationController.paginationPrev)

// GET messages/next/:id/:lastReply
router.get('/next/:id/:lastReply', paginationController.paginationNext)

// GET messages/count
router.get('/count', statsController.getMessageStats)

// POST messages/draft
router.post('/draft', draftController.draftMessage)

// GET messages/draft
router.get('/draft', draftController.getDraftedMessages)

// GET messages/draft/:id
router.get('/draft/:id', draftController.getDraftedMessage)

//PUT messages/draft/:id
router.put('/draft/:id', draftController.unDraftMessage)

//GET messages/delete
router.get('/delete', trashController.getDeletedMessages)

router.put('/deleteThreads', trashController.deleteThreads)

//PUT messages/delete
router.put('/delete', trashController.deleteThread)


//PUT messages/status/:id
router.put('/status/:id', inboxControllers.readMessage)

//GET messages/sent/
router.get('/sent', inboxControllers.getSentMessages);

//GET messages/starred/
router.get('/star', starController.getStarredMessages);

//PUT messages/starred/:id
router.put('/star/:id', starController.starMessage);

//GET messages/
router.get('/', inboxControllers.getInboxMessages);

//GET messages/:id
router.get('/:id', detailsController.getMessageDetails);

//POST messages/
router.post('/',
    middleware(cors.cors)
    ,inboxControllers.sendMessage
);

export default router;
