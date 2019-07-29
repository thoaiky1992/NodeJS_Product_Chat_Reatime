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
    createAt        : {type:Number,default:Date.now},
    updateAt        : {type:Number,default:Date.now},
    deleteAt        : {type:Number,default:null},
});
ChatGroupSchema.statics = {
    /**
     * get chat group items by userId and limit
     * @param {string} userId current userId
     * @param {number} limit 
     */
    getChatGroups(userId,limit){
        return this.find({
            "members" : { $elemMatch : {"userID" : userId}}
        }).sort({'updateAt':-1}).limit(limit).exec();
    }
}
module.exports = mongoose.model('chat-group',ChatGroupSchema);