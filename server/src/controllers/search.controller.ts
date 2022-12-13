import { Request, Response, NextFunction } from "express";
import { client } from "../models/esClient"
import { Correspondence } from "../models/cors.model";
import { Client } from "@elastic/elasticsearch";
var mongoose = require('mongoose');

export const searchMessage = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    let { query='', page = 1, limit = 20, title = "home" }: any = req.query
	let result
    let numOfRecords = 0
    let arrOfIds :any = []
	try {
        
        if(page <=0) page=1

        if(limit <= 0) limit=20
        
        if(query == '') return res.status(404).json({message:'Query not Sent', errorCode: "404.007"})
        
        result = await handleSearchTitle(title, page, limit, query)
    
        numOfRecords = result.aggregations.total.value
        
        arrOfIds = getArrOfThreadIds(result)

        let databaseResult = await searchInDatabase(arrOfIds, page, limit, title)

        if(databaseResult.length == 0) return res.status(200).json({
            elasticResult: result,
            result: [],
            totalPages: 0,
			numOfRecords: numOfRecords ,
			limit: limit,
            message:'No search results returned'
        })

        if(title != "draft")
            databaseResult = formatDataSent(databaseResult)
        else
            databaseResult = formatDraftMessages(databaseResult)

		res.status(200).json({
			result: databaseResult,
			totalPages: Math.ceil(numOfRecords  / limit),
			currentPage: page,
			numOfRecords: numOfRecords,
			limit: limit,
            message:'Search result returned successfully'
		})
	} catch (err) {
		console.log(err)
        next(err)
	}
}

const handleSearchTitle = async (title:string,page:any,limit:number,query:string) =>{
    let result 
    if (title == "starred") {
        result = await searchStarredMessages(page, limit, query)
    } else if (title == "draft") {
        result = await searchDraftedMessages(page, limit, query)
    } else if (title == "trash") {
        result = await searchTrashedMessages(page, limit, query)
    } else {
        result = await searchInboxMessages(page, limit, query)
    }
    return result
} 

const getArrOfThreadIds = (result:any) => {
    let arrOfIds:any = []

    result.hits.hits.map((item:any)=>{
        arrOfIds.push(mongoose.Types.ObjectId(item._source.threadId))
    })

    return arrOfIds
}

const searchStarredMessages = async (page:any, limit:any, query:String) =>{
    let result :any
    result = await client.search({
        index: 'correspondences',
        // from: ((page - 1) * limit),
        // size: (limit * 1),
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: "*" + query + "*",
                            fields: [
                                "content.correspondence_body",
                                "content.correspondence_no",
                                "content.correspondence_subject",
                                "content.correspondence_type",
                            ]
                        }
                    }
                ],

                filter: [
                    // {
                    //     term: {
                    //         "content.Starred": true,
                    //     }
                    // },
                    {
                        term: {
                            "content.isDeleted": false,
                        }
                    },
                    {
                        term:{
                            "content.ThreadStarred":true
                        }
                    }
                ],
                should: [
                    {
                        term:{
                            "content.isDrafted": true,
                        }
                    }
                ]
            }
        },
        // aggs:{
        //     cors_aggs:{
        //         // terms: {
        //         //     field:"threadId.keyword",
        //         //     size:30
        //         // }
        //         composite:{
        //             size:2,
        //             sources:[
        //                 {
        //                     "threadId":{
        //                         terms:{
        //                             field: "threadId.keyword"
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // }

        collapse:{
            field:"threadId.keyword"
        },
        // aggs:{
        //     cors_agg:{
        //         terms:{
        //             field: "threadId.keyword",
        //             size:aggSize
        //         }
        //     }
        // },
        aggs:{
            total:{
                cardinality:{
                    field: "threadId.keyword"
                }
            },
        },
        from: ((page - 1) * limit),
        size: (limit * 1),
    })
    return result
}

const searchDraftedMessages = async (page:any, limit:number, query:String) =>{
    let result:any
    result = await client.search({
        index: 'correspondences',
        // from: ((page - 1) * limit),
        // size: (limit * 1),
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: "*" + query + "*",
                            fields: [
                                "content.correspondence_body",
                                "content.correspondence_no",
                                "content.correspondence_subject",
                                "content.correspondence_type"
                            ]
                        }
                    }
                ],

                filter: [

                    {
                        term: {
                            "content.isDeleted": false,
                        }
                    },
                    // {
                    //     term: {
                    //         "content.isDrafted": true,
                    //     }
                    // },
                    {
                        term:{
                            "content.ThreadDrafted":true
                        }
                    }

                ]
            }
        },
        // aggs:{
        //     cors_aggs:{
        //         // terms: {
        //         //     field:"threadId.keyword",
        //         //     size:30
        //         // }
        //         composite:{
        //             size:20,
        //             sources:[
        //                 {
        //                     "threadId":{
        //                         terms:{
        //                             field: "threadId.keyword"
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // }
        aggs:{
            total:{
                cardinality:{
                    field: "threadId.keyword"
                }
            },
        },
        collapse:{
            field:"threadId.keyword"
        },
        // aggs:{
        //     cors_agg:{
        //         terms:{
        //             field: "threadId.keyword",
        //             size:aggSize
        //         }
        //     }
        // },
        from: ((page - 1) * limit),
        size: (limit * 1),
    })
    return result
}

const searchTrashedMessages = async(page:any ,limit:number, query:String) =>{
    let result = await client.search({
        index: 'correspondences',
        from: ((page - 1) * limit),
        size: (limit * 1),
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: "*" + query + "*",
                            fields: [
                                "content.correspondence_body",
                                "content.correspondence_no",
                                "content.correspondence_subject",
                                "content.correspondence_type",
                                // "content.replies.correspondence_body",
                                // "content.replies.correspondence_no",
                                // "content.replies.correspondence_subject"
                            ]
                        }
                    }
                ],
                
                filter: [
                    
                    {
                        term: {
                            "content.isDeleted": true,
                        }
                    },
                    {
                        term: {
                            "content.isDrafted": false,
                        }
                    },

                ]
            }
        },
        // aggs:{
        //     cors_aggs:{
        //         // terms: {
        //         //     field:"threadId.keyword",
        //         //     size:30
        //         // }
        //         composite:{
        //             size:20,
        //             sources:[
        //                 {
        //                     "threadId":{
        //                         terms:{
        //                             field: "threadId.keyword"
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // }
        aggs:{
            total:{
                cardinality:{
                    field: "threadId.keyword"
                }
            },
        },
        collapse:{
            field:"threadId.keyword"
        }
    })
    return result
}

const searchInboxMessages = async(page:any, limit:number, query:String) => {
    let result = await client.search({
        index: 'correspondences',
        // from: ((page - 1) * limit),
        // from: 20,
        // size: (limit * 1),
        query: {
            bool: {
                must: [
                    {
                        query_string: {
                            query: '*'+query+'*',
                            fields: [
                                "content.correspondence_body",
                                "content.correspondence_no",
                                "content.correspondence_subject",
                                "content.correspondence_type"
                            ]
                        }
                    }
                ],

                filter: [

                    {
                        term: {
                            "content.isDeleted": false,
                        }
                    },
                    {
                        term: {
                            "content.isDrafted": false,
                        }
                    },
                ]
            }
        },
        // aggs:{
        //     cors_aggs:{
        //         // terms: {
        //         // field:"threadId.keyword",
        //         // size:30
        //         // }
        //         composite:{
        //             // size:(count - ((page-1)*limit*2)),
        //             // size:count,
        //             sources:[
        //                 {
        //                     "threadId":{
        //                         terms:{
        //                             field: "threadId.keyword"
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // }
        aggs:{
            total:{
                cardinality:{
                    field: "threadId.keyword"
                }
            },
        },
        collapse:{
            field:"threadId.keyword"
        },
        // aggs:{
        //     total:{
        //         cardinality:{
        //             field: "threadId.keyword"
        //         }
        //     },
        // },
        from: ((page - 1) * limit),
        size: (limit * 1),
    })
    return result
}

const searchInDatabase = async (arrOfIds:any,page:any, limit:number,title:string) => {
    let data
    if(title=="starred"){
        data = await Correspondence.aggregate([
            {
                $match:{
                    threadId:{
                        $in:arrOfIds
                    },
                    // "content.isDrafted":false
                }
            },
            {
                $group :{
                    _id:"$threadId",
                    Correspondence: { $push: "$$ROOT" },
                    isStarred: { $max: "$content.Starred" },
                    isDrafted: { $max: "$content.isDrafted" },
                }
            },
            {
                $match:{
                    isStarred:true
                }
            },
            {
                $project: {
                    "threadId": 1,
                    "Correspondence.content": 1,
                    "Correspondence._id": 1,
                    "isStarred": 1,
                    "isDrafted":1
                },
            },
            {
                $sort:{
                    "Correspondence.content.sent_date":-1
                }
            }
            // {
            //     $skip:(page - 1) * limit
            // },
            // {
            //     $limit:(limit * 1)
            // }
        ])
    }
    else{
        data = await Correspondence.aggregate([
            {
                $match:{
                    threadId:{
                        $in:arrOfIds
                    },
                    // "content.isDrafted":false
                }
            },
            {
                $group :{
                    _id:"$threadId",
                    Correspondence: { $push: "$$ROOT" },
                    isStarred: { $max: "$content.Starred" },
                    isDrafted: { $max: "$content.isDrafted" },
                    
                }
            },
    
            {
                $project: {
                    "threadId": 1,
                    "Correspondence.content": 1,
                    "Correspondence._id": 1,
                    "isStarred": 1,
                    "isDrafted":1,
                },
            },
            {
                $sort:{
                    "Correspondence.content.sent_date":-1
                }
            }
            // {
            //     $skip:(page - 1) * limit
            // },
            // {
            //     $limit:(limit * 1)
            // }
        ])
    }
    return data
}

const formatDataSent = (data: any) => {
	return data.map((item: any) => {
		let isDraftedReplyExists = false
		let length = item.Correspondence.length - 1;
		if(item.isDrafted)
			isDraftedReplyExists=true
		while(length >= 0 ){
			if(item.Correspondence[length].content.isDrafted){
				length--
			}else{
				break;
			}
		}
		return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists:isDraftedReplyExists }
	})
}

const formatDraftMessages = (data : any) => {
    return data.map((item:any) =>{
        let value = false
        let length = item.Correspondence.length - 1;
        if(item.Correspondence[length].content.isDrafted && item.Correspondence[length].content.replyTo != null){
            value = true
        }
            
        return { threadId: item._id, _id: item.Correspondence[length]._id, ...item.Correspondence[length].content, ThreadStarred: item.isStarred, isDraftedReplyExists:value}
    })
}