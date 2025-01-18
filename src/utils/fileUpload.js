const fs = require("fs");

const fileUploaderSingle = async (path, file) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    let newfileName = Date.now().toString() + file.name;
    let uploadPath = path + newfileName;
    await file.mv(uploadPath);
    return { originalFileName: file.name, newfileName };
};
const fileUploaderMultiple = async (path, file) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    let imagesArr = [];
    for (let [key, val] of Object.entries(file)) {
        if (Array.isArray(val)) {
            for (let [iterator, value] of Object.entries(val)) {
                let newfileName = Date.now().toString() + value.name;
                let uploadPath = path + newfileName;
                await value.mv(uploadPath);
                imagesArr.push({ originalFileName: value.name, newfileName });
            }
        } else {
            let newfileName = Date.now().toString() + val.name;
            let uploadPath = path + newfileName;
            await val.mv(uploadPath);
            imagesArr.push({ originalFileName: val.name, newfileName });
        }
    }
    return imagesArr;
};

module.exports = {
    fileUploaderSingle,
    fileUploaderMultiple,
};
