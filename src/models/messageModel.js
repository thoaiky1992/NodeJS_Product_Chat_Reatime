import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const MessageSchema = new Schema({
    senderId    : String,
    receiverId  : String,
    conversationType : String,
    messageType : String,
    sender : {
        id          : String,
        name        : String,
        avatar      : String
    },
    receiver : {
        id          : String,
        name        : String,
        avatar      : String
    },
    text        : String,
    file        : {data:Buffer,contentType:String,fileName:String},
    createdAt    : {type:Number,default:Date.now},
    updatedAt    : {type:Number,default:null},
    deletedAt    : {type:Number,default:null},
});

MessageSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    /**
     * get messages in personal
     * @param {string} senderId    : current User Id
     * @param {string} receivedId  : id of contact
     * @param {string} limit 
     */
    getMessageInPersonal(senderId , receiverId , limit){
        return this.find({
            $or : [
                {
                    $and : [
                        { "senderId" :  senderId},
                        { "receiverId" : receiverId}

                    ]
                },
                {
                    $and : [
                        { "receiverId" :  senderId},
                        { "senderId" : receiverId}

                    ]
                }
            ]
        }).sort({"createdAt" : -1}).limit(limit).exec();
    },
    /**
     * get messages in group
     * @param {string} receiverId  id of group chat
     * @param {number} limit 
     */
    getMessageInGroup(receiverId , limit){
        return this.find({ "receiverId" : receiverId}).sort({"createdAt" : -1}).limit(limit).exec();
    },
    getAllMessageInGroup(receiverId){
        return this.find({ "receiverId" : receiverId}).sort({"createdAt" : -1}).skip(0).limit(1).exec();
    },
    getAllMessageGroup(receiverId){
        return this.find({ "receiverId" : receiverId}).sort({"createdAt" : -1}).exec();
    },
    readMoreMessageInPersonal(senderId , receiverId , skip , limit){
        return this.find({
            $or : [
                {
                    $and : [
                        { "senderId" :  senderId},
                        { "receiverId" : receiverId}

                    ]
                },
                {
                    $and : [
                        { "receiverId" :  senderId},
                        { "senderId" : receiverId}

                    ]
                }
            ]
        }).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
    },
    readMoreMessageInGroup(receiverId , skip ,  limit){
        return this.find({ "receiverId" : receiverId}).sort({"createdAt" : -1}).skip(skip).limit(limit).exec();
    },
}
const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL : "personal",
    GROUP : "group"
}
const MESSAGE_TYPES = {
    TEXT : "text",
    IMAGE : "image",
    FILE : "file",
}
module.exports = {
    model : mongoose.model('message',MessageSchema),
    conversationTypes : MESSAGE_CONVERSATION_TYPES,
    messageType : MESSAGE_TYPES
};