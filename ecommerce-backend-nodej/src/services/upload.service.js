// 1. upload from url image

const { cloudinary_js_config } = require("../configs/cloudinary.config")

const uploadImageFromUrl = async() => {
  try {
    const imagePath = 'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';
    const folderName = 'product/shopId', newFileName = 'testdemo'

    const result = await cloudinary_js_config.uploader.upload(imagePath, {
      public_id: newFileName,
      folder: folderName
    })

    console.log(result);
  } catch (error) {

  }
}
uploadImageFromUrl().catch()
