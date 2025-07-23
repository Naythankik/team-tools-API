const {uploader} = require("../config/cloudinary");

const uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        const result = await uploader.upload(imagePath, options);
        return result.public_id;
    } catch (error) {
        console.error(error);
    }
};

module.exports = uploadImage;
