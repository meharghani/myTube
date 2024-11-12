import {v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has been uploaded successfully
       fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved tepm file as the upload operation failed
        return null
        }
}
const updateFileOnCloudinary = async(publicId, newFilePath)=>{
    try {
        
        
        if(!newFilePath && !publicId) return null
        const result = await cloudinary.uploader.upload(newFilePath,
            {
                public_id:publicId,
                overwrite:true
            }
        )
        fs.unlinkSync(newFilePath)
        return result
    } catch (error) {
        fs.unlinkSync(newFilePath) // remove the locally saved tepm file as the upload operation failed
        return null
    }
}

const deleteVideoFromCloudinary = async(publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"},(error, result)=>{
            if(error){
                console.error("Error deleting file", error)
            }else{
                console.log("File deleted successfully",result)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
const deleteImageFromCloudinary = async(publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"image"},(error, result)=>{
            if(error){
                console.error("Error deleting file", error)
            }else{
                console.log("File deleted successfully",result)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    uploadOnCloudinary,
    updateFileOnCloudinary,
    deleteVideoFromCloudinary,
    deleteImageFromCloudinary
}