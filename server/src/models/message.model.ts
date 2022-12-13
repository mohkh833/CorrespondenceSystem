import mongoose, { Schema, Document } from 'mongoose'
import { client } from './esClient';
const mongoosastic = require('mongoosastic')

export const messageSchema = new Schema({
    correspondence_no : String,
    correspondence_type: String,
    entry_no: String,
    from_entity:String,
    from_department:String,
    from_user:String,
    from_email:String,
    entity_address:String,
    cc_entity: [String],
    to_entity: String,
    to_department:String,
    received_date:Date,
    received_user:String,
    sent_date:Date,
    priority: String,
    classification:String,
    correspondence_subject:String,
    correspondence_body:String,
    await_reply: Boolean,
    message_status:{
        type: String,
        default: "sent",
        enum:["sent", "seen", "received" , "rejected"]
    },
    attached_docs_ids:[String],
    due_date: Date,
    Starred:{
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    trashDate:{
        type: Date
    },
    draftedDate:{
        type:Date
    },
    isDrafted:{
        type: Boolean,
        default: false
    }
})

messageSchema.plugin(mongoosastic, {
    esClient: client
});


let Message: any = mongoose.model('Message', messageSchema)

export{Message}

