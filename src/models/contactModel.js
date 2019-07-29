import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const ContactSchema = new Schema({
    userID      : String,
    contactID   : String,
    status      : {type:Boolean,default:false},
    createAt    : {type:Number,default:Date.now},
    updateAt    : {type:Number,default:null},
    deleteAt    : {type:Number,default:null},
});
ContactSchema.statics = {
    createNew(item){
        return this.create(item)
    },
    // tìm tất cả bản ghi liên quan tới UserID
    findAllByUser(userId){
        return this.find({
            $or : [
                {"userID":userId},
                {"contactID":userId}
                
            ]
        }).exec();
    },
    checkExists(userId,contactId){
        return this.findOne({
            $or : [
                { $and : [
                    {"userID":userId},{"contactID":contactId}
                ]},
                {$and : [
                    {"userID":contactId},{"contactID":userId}
                ]}
            ]
        }).exec();
    },
    removeContact(userId,contactId){
        return this.deleteOne({
            $or : [
                { $and : [
                    {"userID":userId},
                    {"contactID":contactId},
                    {"status" : true}
                ]},
                {$and : [
                    {"userID":contactId},
                    {"contactID":userId},
                    {"status" : true}
                ]}
            ]
        }).exec();
    },
    removeRequestContactSent(userID,contactID){
        return this.deleteOne({
            $and : [
                {"userID":userID},
                {"contactID":contactID},
                {"status":false}
            ]
        }).exec();
    },
    getContacts(userID,limit){
        return this.find({
            $and : [
                {
                    $or : [
                        {'userID' : userID},
                        {'contactID' : userID},
                    ]
                },
                {'status' :  true}
            ]
        }).sort({'updateAt':-1}).limit(limit).exec();
    },
    getContactsSend(userID,limit){
        return this.find({
            $and : [
                {'userID' : userID},
                {'status' :  false}
            ]
        }).sort({'createAt':-1}).limit(limit).exec();
    },
    getContactsRecevied(userID,limit){
        return this.find({
            $and : [
                {'contactID' : userID},
                {'status' :  false}
            ]
        }).sort({'createAt':-1}).limit(limit).exec();
    },
    countAllContacts(userID){
        return this.countDocuments({
            $and : [
                {
                    $or : [
                        {'userID' : userID},
                        {'contactID' : userID},
                    ]
                },
                {'status' :  true}
            ]
        }).exec();
    },
    countAllContactsSend(userID){
        return this.countDocuments({
            $and : [
                {'userID' : userID},
                {'status' :  false}
            ]
        }).exec();
    },
    countAllContactsRecevied(userID){
        return this.countDocuments({
            $and : [
                {'contactID' : userID},
                {'status' :  false}
            ]
        }).exec();
    },
    readMoreContacts(userId,skip,limit){
        return this.find({
            $and : [
                {
                    $or : [
                        {'userID' : userId},
                        {'contactID' : userId},
                    ]
                },
                {'status' :  true}
            ]
        }).sort({'updateAt':-1}).skip(skip).limit(limit).exec();
    },
    readMoreContactsSent(userId,skip,limit){
        return this.find({
            $and : [
                {'userID' : userId},
                {'status' :  false}
            ]
        }).sort({'createAt':-1}).skip(skip).limit(limit).exec();
    },
    readMoreContactsRecived(userId,skip,limit){
        return this.find({
            $and : [
                {'contactID' : userId},
                {'status' :  false}
            ]
        }).sort({'createAt':-1}).skip(skip).limit(limit).exec();
    },
    removeRequestContactReceived(userID,contactID){ 
        return this.deleteOne({
            $and : [
                {"contactID":userID},
                {"userID":contactID},
                {"status":false}
            ]
        }).exec();
    },
    /**
     * 
     * @param {string :  of currentUser} userID 
     * @param {string} contactID 
     */
    approveRequestContactReceived(userID,contactID){ 
        return this.updateOne({
            $and : [
                {"contactID":userID},
                {"userID":contactID},
                {"status":false}
            ]
        },{
           "status" :  true ,
           "updateAt" :  Date.now()
        }).exec();
    }

}
module.exports = mongoose.model('contact',ContactSchema);