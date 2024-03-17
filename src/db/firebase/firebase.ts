import firebaseAdmin from 'firebase-admin'
import { formattedDateNow } from '../../utils/helper';

export const getImageList = async (project_name?: string) => {
    const storage = firebaseAdmin.storage()
    const bucket = storage.bucket();
    const filePath = `portofolio-images/${project_name}`
    const [files] = await bucket.getFiles({
        prefix: filePath
    })
    const urls: string[] = []
    files.forEach(file => {
        if(file.metadata.contentType?.includes('image')) {
            const imageUrl = `https://firebasestorage.googleapis.com/v0${bucket.baseUrl}/${bucket.name}${file.baseUrl}/${file.id}?alt=media`
            urls.push(imageUrl)
        }
    })
    return urls
}

export const uploadFileToFirebase = async (files: Express.Multer.File[], project_name: string) => {
    const storage = firebaseAdmin.storage()
    const bucket = storage.bucket();
    
    for (const file of files) {
        const fileName = `portofolio-images/${project_name}/${file.originalname}_${formattedDateNow()}`
        const fileUpload = bucket.file(fileName)
    
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype
            }
        })
    }
   
}