import mongoose, { Schema } from 'mongoose'
import { client } from './esClient';
const mongoosastic = require('mongoosastic')
import {messageSchema} from "./message.model"

export const correspondenceSchema = new Schema({
    threadId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Correspondence',
        auto: true, 
    },
    id: {
        type: String,
        default:"3ec3358c-1478-4a0b-b874-559c5405fc01"
    },
    name:{
        type: String,
        default:"Readme.txt"
    },
    type:{
        type:String,
        default:"file"
    },
    parentId:{
        type: String,
        default:"0c5fc302-71ec-40c1-9ba1-ac4982237b24"
    },
    children:{
        type: [String],
        default:["3c56b8bf-b907-4620-8ac0-e0579b0b71b3"]
    },
    path:{
        type:String,
        default:"R7/asdsa/Readme.txt"
    },
    totalSize:{
        type:Number,
        default:252
    },
    createdDate: {
        type:Date,
        default:new Date().toISOString()
    },
    createdBy: {
        type:String,
        default:"sobecof713@lurenwu.com"
    },
    content:{
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
        },
        replyTo:{
            type:String,
            default:"none",
            ref: 'Correspondence'
        },
        ThreadStarred:{
            type: Boolean,
            default: false
        },
        ThreadDrafted:{
            type: Boolean,
            default: false
        },
        // messageId:{
        //     default: mongoose.Schema.Types.ObjectId,
        // },
        SystemContentType:{
            data:{
                VersionContentType:{
                    data:{
                        versionNumber:{
                            type:Number,
                            default:1
                        },
                        currentRenditionSize:{
                            type:Number,
                            default:0
                        },
                        currentVersionSize:{
                            type:Number,
                            default:252
                        },
                        extention:{
                            type:String,
                            default:"txt"
                        },
                    }
                },
                CommonContentType:{
                    data:{
                        id:{
                            type:String,
                            default:"3ec3358c-1478-4a0b-b874-559c5405fc01"
                        },
                        name:{
                            type:String,
                            default:"Readme"
                        },
                        type:{
                            type:String,
                            default:"version"
                        },
                        createdDate: {
                            type:Date,
                            default:new Date().toISOString()
                        },
                        createdBy: {
                            type:String,
                            default:"sobecof713@lurenwu.com"
                        },
                        modificationDate:{
                            type:Date,
                            default: new Date().toISOString()
                        },
                        modificationBy: {
                            type:String,
                            default:"sobecof713@lurenwu.com"
                        },
                        currentSize:{
                            type:Number,
                            default:504
                        },
                        icon:{
                            type:String,
                            default:"txt"
                        },
                        contentTypeName:{
                            type:String,
                            default:"mhtest"
                        }
                    }
                }
            }
        }
    },
    contentTypeId:{
        type:String,
        default:"25f0f0cf-4557-449a-bf77-021ff0171ad4"
    },
    allowedDocTypes:{
        type: Array
    },
    binaryDate: {
        type:String,
        default:"25f0f0cf-4557-449a-bf77-021ff0171ad4"
    },
    modificationDate: {
        type:Date,
        default:new Date().toISOString()
    },
    modificationBy: {
        type:String,
        default:"sobecof713@lurenwu.com"
    },
    contentTypeGroupId:{
        type:String,
        default:"34dcab22-23cf-4251-b680-eb8c8c255c0d"
    },
    favouriteusers:Array,
    isCheckedOut:{
        type:Boolean,
        default:false
    },
    checkOutBy:String,
    checkOutDate:{
        type:Date,
        default:new Date().toISOString()
    },
    ACP:{
        DACL:{
            type:Array
        },
        IACL:{

        type:Array,
        default:{
                objectID: {
                    type:String,
                    default:"sobecof713@lurenwu.com"
                },
                permissionLevelId: {
                    type:String,
                    default:"5449d5f9-e01c-44d1-a248-3505ea4b942c"
                },
                isUser: {
                    type:Boolean,
                    default:false
                },
                guid: {
                    type:String,
                    default:"111f7ab3-a570-47f7-97e1-365955be9de9"
                }
            }
        },
        SHACL: Array
    },
    isBroke:{
        type:Boolean,
        default:false
    },
    newPath: {
        type:String,
        default:"99999999-9999-9999-9999-999999999999/203fb836-d069-4111-b71c-bfead17f82df/0c5fc302-71ec-40c1-9ba1-ac4982237b24"
    },
    userInfo:{
        id:{
            type:String,
            default:"630b3f70bf4b9d8945d59abd"
        },
        email:{
            type:String,
            default:"sobecof713@lurenwu.com"
        },
        fullName: {
            type:String,
            default:"Test R7"
        },
        ImageUrl: {
            type:String,
            default:"./assets/images/user-avatar.png"
        },
        _id:mongoose.Schema.Types.ObjectId
    },
    contentTypeInfo:{
        id:{
            type:String,
            default:"25f0f0cf-4557-449a-bf77-021ff0171ad4"
        },
        title: {
            type:String,
            default:"mhtest"
        },
        groupId: {
            type:String,
            default:"34dcab22-23cf-4251-b680-eb8c8c255c0d"
        },
        key:{
            type:String,
            default:"mhtest"
        },
        _id:mongoose.Schema.Types.ObjectId
    },
    assignedProcesses: [],
    fields: []
})

correspondenceSchema.plugin(mongoosastic, {
    esClient: client
});

let Correspondence = mongoose.model('Correspondence', correspondenceSchema)

export{Correspondence}