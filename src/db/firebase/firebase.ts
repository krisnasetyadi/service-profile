import firebaseAdmin from 'firebase-admin'

export const getImageList = async () => {
    const storage = firebaseAdmin.storage()
    const bucket = storage.bucket();
    const filePath = "portofolio-images"
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