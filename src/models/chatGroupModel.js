import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const ChatGroupSchema = new Schema({
    name            : String,
    userAmount      : {type:Number,min:3,max:100},
    messageAmount   : {type:Number,default:0},
    userID          : String,
    members         : [
        {userID:String}
    ],
    createdAt        : {type:Number,default:Date.now},
    updatedAt        : {type:Number,default:Date.now},
    deletedAt        : {type:Number,default:null},
});
ChatGroupSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    getChatGroupById(id){
        return this.findOne({_id:id}).exec();
    },
    /**
     * get chat group items by userId and limit
     * @param {string} userId current userId
     * @param {number} limit 
     */
    getChatGroups(userId,limit){
        return this.find({
            "members" : { $elemMatch : {"userID" : userId}}
        }).sort({'updatedAt':-1}).limit(limit).exec();
    },
    getAllChatGroups(userId){
        return this.find({
            "members" : { $elemMatch : {"userID" : userId}}
        }).sort({'updatedAt':-1}).exec();
    },
    getChatGroupById(id){
        return this.findById(id).exec();
    },
    /**
     * update group chat when has new message
     * @param {string} id  : if of group chat
     * @param {number} newMessageAmount 
     */
    updateWhenHasNewMessage(id,newMessageAmount){
        return this.findByIdAndUpdate(id,{
            "messageAmount" : newMessageAmount,
            "updatedAt" : Date.now()
        }).exec();
    },
    getChatGroupIdsByUser(userId){
        return this.find({
            "members" : { $elemMatch : {"userID" : userId}}
        },{"_id":1}).exec();
    },
    readMoreChatGroups(userId,skip,limit){
        return this.find({
            "members" : { $elemMatch : {"userID" : userId}}
        }).sort({'updatedAt':-1}).skip(skip).limit(limit).exec();
    },
    addUserToGroupChat(item,groupChatId,userAmount){
        return this.findOneAndUpdate({_id : groupChatId},{members : item,userAmount:userAmount}).exec();
    },
    updateMemberInGroupChat(groupChatId,members,userAmount){
        return this.findOneAndUpdate({_id : groupChatId},{members : members,userAmount:userAmount}).exec();
    }
    
}
module.exports = mongoose.model('chat-group',ChatGroupSchema);