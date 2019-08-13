import chatGroupModel from '../models/chatGroupModel';
import _ from 'lodash';
let addNewGroup = (currentuserId,arrayMemberIds,groupChatName) => {
    return new Promise(async(resolve,reject) => {
        try {
            // add current Id to array members
            arrayMemberIds.unshift({userId : `${currentuserId}`});
            arrayMemberIds = _.uniqBy(arrayMemberIds,'userId');
            let newGroupItem = {
                name            : groupChatName,
                userAmount      : arrayMemberIds.length,
                messageAmount   : 0,
                userId          : `${currentuserId}`,
                members         : arrayMemberIds
            }
            let newGroup = await chatGroupModel.createNew(newGroupItem);
            resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    addNewGroup
}