const utils = require('./utilities')
const APPURL = require("../config/index").APPURL;

const userDetails = (datas) => {
    if(Array.isArray(datas)){
        let users = [];
        for(const data of datas){
            data._id = data._id.toString();
            data.role = data?.roleId?.name;
            data.name = data.firstName+" "+data.lastName;
            data.roleId = datas.roleId;
            data.profileImage = data.profileImage? APPURL + "/uploads/userImages/" + data.profileImage : APPURL + "uploads/userImages/" + 'demo_image.jpg';

            users.push(data);
        }
        return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }else{
        const data = JSON.parse(JSON.stringify(datas));
        data['_id'] = datas._id.toString();
        data['role'] = datas.roleId.name;
        data['name'] = datas.firstName+" "+datas.lastName;
        data['roleId'] = datas.roleId._id.toString();
        data.profileImage = data.profileImage? APPURL + "/uploads/userImages/" + data.profileImage : APPURL + "uploads/userImages/" + 'demo_image.jpg';

        return data;
    }
};

module.exports = {
    userDetails,
}