import contactModel from './../models/contactModel';
import userModel from './../models/userModel';
import chatGroupModel from './../models/chatGroupModel';
import messageModel from './../models/messageModel';
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';
import _ from 'lodash';
import fsExtra from 'fs-extra';
const LIMIT_CONVERSATIONS = 1;
const LIMIT_MESSAGES = 10; 
/**
 * get all conversations 
 * @param {string} currentUserId 
 */
let letAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await contactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS);
            let userConversationstPromise = contacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    let getUserContact =  await userModel.getNormalUserDataById(contact.userID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            let groupConversations = await chatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations , (item) => {
                return -item.updatedAt;
            })
            // get message to apply in screen chat
            let allConversationWidthMessagePromise = allConversations.map( async (conversation) => {
                conversation = conversation.toObject();
                if(conversation.members){
                    let getMessage = await  messageModel.model.getMessageInGroup(conversation._id,LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessage);
                }else{
                    let getMessage = await  messageModel.model.getMessageInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessage);
                }
                return conversation;
            })
            let allConversationWithMessage = await Promise.all(allConversationWidthMessagePromise);
            // sort By updatedAt DESC
            allConversationWithMessage = _.sortBy(allConversationWithMessage,(item) => {
                return -item.updatedAt;
            })
            resolve({
                allConversationWithMessage : allConversationWithMessage
            });
        } catch (error) {
            reject(error);
        }
    })
}
/**
 * 
 * @param {object} sender  current user
 * @param {string} receiverId  id of user or group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender,receiverId,messageVal,isChatGroup) => {
    return new Promise( async (resolve,reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getChatGroupReceiver._id,
                    name : getChatGroupReceiver.name,
                    avatar : app.general_avatar_group_chat
                }
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.GROUP,
                    messageType : messageModel.messageType.TEXT,
                    sender : sender,
                    receiver : receiver,
                    text        : messageVal,
                    createdAt    : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update group chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getUserReceiver._id,
                    name : getUserReceiver.username,
                    avatar : getUserReceiver.avatar
                }
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.PERSONAL,
                    messageType : messageModel.messageType.TEXT,
                    sender : sender,
                    receiver : receiver,
                    text        : messageVal,
                    createdAt    : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update contact
                await contactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}
/**
 * 
 * @param {object} sender  current user
 * @param {string} receiverId  id of user or group
 * @param {file} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewImage = (sender,receiverId,messageVal,isChatGroup) => {
    return new Promise( async (resolve,reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getChatGroupReceiver._id,
                    name : getChatGroupReceiver.name,
                    avatar : app.general_avatar_group_chat
                }
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.GROUP,
                    messageType : messageModel.messageType.IMAGE,
                    sender : sender,
                    receiver : receiver,
                    file : {data:imageBuffer,contentType:imageContentType,fileName:imageName},
                    createdAt : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update group chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getUserReceiver._id,
                    name : getUserReceiver.username,
                    avatar : getUserReceiver.avatar
                }
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.PERSONAL,
                    messageType : messageModel.messageType.IMAGE,
                    sender : sender,
                    receiver : receiver,
                    file : {data:imageBuffer,contentType:imageContentType,fileName:imageName},
                    createdAt : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update contact
                await contactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addNewAttachment = (sender,receiverId,messageVal,isChatGroup) => {
    return new Promise( async (resolve,reject) => {
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
                if(!getChatGroupReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getChatGroupReceiver._id,
                    name : getChatGroupReceiver.name,
                    avatar : app.general_avatar_group_chat
                }
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.GROUP,
                    messageType : messageModel.messageType.FILE,
                    sender : sender,
                    receiver : receiver,
                    file : {data:attachmentBuffer,contentType:attachmentContentType,fileName:attachmentName},
                    createdAt : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update group chat
                await chatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
                if(!getUserReceiver){
                    return reject(transErrors.conversation_not_found);
                }
                let receiver = {
                    id : getUserReceiver._id,
                    name : getUserReceiver.username,
                    avatar : getUserReceiver.avatar
                }
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;
                let newMessageItem = {
                    senderId    : sender.id,
                    receiverId  : receiver.id,
                    conversationType : messageModel.conversationTypes.PERSONAL,
                    messageType : messageModel.messageType.FILE,
                    sender : sender,
                    receiver : receiver,
                    file : {data:attachmentBuffer,contentType:attachmentContentType,fileName:attachmentName},
                    createdAt : Date.now(),
                }
                // create new message
                let newMessage = await messageModel.model.createNew(newMessageItem);
                // update contact
                await contactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    })
}
let readMoreAllChat = (currentUserId,skipPersonal,SkipGroup) => {
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await contactModel.readMoreContacts(currentUserId,skipPersonal,LIMIT_CONVERSATIONS);
            let userConversationstPromise = contacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    let getUserContact =  await userModel.getNormalUserDataById(contact.userID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            let groupConversations = await chatGroupModel.readMoreChatGroups(currentUserId,SkipGroup,LIMIT_CONVERSATIONS);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations , (item) => {
                return -item.updatedAt;
            })
            // get message to apply in screen chat
            let allConversationWidthMessagePromise = allConversations.map( async (conversation) => {
                conversation = conversation.toObject();
                if(conversation.members){
                    let getMessage = await  messageModel.model.getMessageInGroup(conversation._id,LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessage);
                }else{
                    let getMessage = await  messageModel.model.getMessageInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES);
                    conversation.messages = _.reverse(getMessage);
                }
                return conversation;
            })
            let allConversationWithMessage = await Promise.all(allConversationWidthMessagePromise);
            // sort By updatedAt DESC
            allConversationWithMessage = _.sortBy(allConversationWithMessage,(item) => {
                return -item.updatedAt;
            })
            resolve(allConversationWithMessage);
        } catch (error) {
            reject(error);
        }
    })
}
let readMoreUserChat = (currentUserId,skipPersonal) => {
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await contactModel.readMoreContacts(currentUserId,skipPersonal,LIMIT_CONVERSATIONS);
            let userConversationstPromise = contacts.map( async (contact) => {
                if(contact.contactID == currentUserId){
                    let getUserContact =  await userModel.getNormalUserDataById(contact.userID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
                else{
                    let getUserContact = await userModel.getNormalUserDataById(contact.contactID);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });
            let userConversations =  await Promise.all(userConversationstPromise);
            userConversations = _.sortBy(userConversations , (item) => {
                return -item.updatedAt;
            })
            // get message to apply in screen chat
            let userConversationWidthMessagePromise = userConversations.map( async (conversation) => {
                conversation = conversation.toObject();
                let getMessage = await  messageModel.model.getMessageInPersonal(currentUserId,conversation._id,LIMIT_MESSAGES);
                conversation.messages = _.reverse(getMessage);
                return conversation;
            })
            let userConversationWithMessage = await Promise.all(userConversationWidthMessagePromise);
            // sort By updatedAt DESC
            userConversationWithMessage = _.sortBy(userConversationWithMessage,(item) => {
                return -item.updatedAt;
            })
            resolve(userConversationWithMessage);
        } catch (error) {
            reject(error);
        }
    })
}
let readMore = (currentUserId,skipMessage,targetId,chatInGroup) => {
    return new Promise(async (resolve,reject) => {
        try {
            if(chatInGroup){
                let getMessages = await  messageModel.model.readMoreMessageInGroup(targetId,skipMessage,LIMIT_MESSAGES);
                getMessages = _.reverse(getMessages);
                return resolve(getMessages)
            }
            let getMessages = await  messageModel.model.readMoreMessageInPersonal(currentUserId,targetId,skipMessage,LIMIT_MESSAGES);
            getMessages = _.reverse(getMessages);
            return resolve(getMessages);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    letAllConversationItems,
    addNewTextEmoji,
    addNewImage,
    addNewAttachment,
    readMoreAllChat,
    readMore,
    readMoreUserChat
};