const {uploader} = require("../config/cloudinary");
const slug = require('slugify')

const uploadImage = async (filename, uploadName, folder) => {
    let response;
    try {
        response = await uploader.upload(filename, {
            public_id: `${slug(uploadName)}-${Date.now()}`,
            resource_type: 'image',
            folder,
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }

    return response.secure_url;
};

module.exports = {
    uploadImage,
};
