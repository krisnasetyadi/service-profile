import express, {Request, Response} from "express"
import { data } from "./constant"
import { initAdmin } from "../db/firebase/initialize"
import { getImageList, uploadFileToFirebase } from "../db/firebase/firebase"
import { query } from "../db/postgres/postgre"
import { stringToArray } from '../utils/helper'

export const GetPortofolioList = async (req: Request , res: Response) => {
    try {
        await initAdmin()
        const firebaseTest = await getImageList()
        console.log('firebaseTest', firebaseTest)
        res.status(200).json(data)
    } catch (error) {
        console.log('error_message', error)
        res.status(400).json({ message: 'An error occured' })
    }
}

export const StorePortofolioList = async(req: Request, res: Response) => {
    try {
        const {
            project_name,
            description,
            roles,
            stacks,
            other_stacks,
            links,
            is_confidential
        } = req.body
    
        const files = req.files as Express.Multer.File[]
        const images = files?.filter(f => f.fieldname === 'images')
        const videos = files?.filter(f => f.fieldname === 'videos')
        let image_urls= [] as string[];

        if(images.length > 0) {
            await initAdmin()
            await uploadFileToFirebase(files, project_name)
            image_urls = await getImageList(project_name)
        }
      
        const columns = [ 
            'project_name', 'roles', 'stacks', 
            'other_stacks','links', 'project_description', 
            'is_confidential', 'image_urls', 'video_urls'
        ]

        const queryString = `INSERT INTO projects (${columns.join(',')}) 
        VALUES ( ${columns.map((_, i) => `$${i + 1}`).join(',')} )`;

        const values = [ 
            project_name, 
            stringToArray(roles), 
            stringToArray(stacks), 
            stringToArray(other_stacks), 
            stringToArray(links), 
            description, 
            is_confidential || 'N',
            image_urls.length > 0 ? image_urls :
            null ,
            null 
        ]
        const response: any = await query(queryString, values)
        
        if(response?.rowCount > 0) {
            res.status(200).json({ message: 'Data save successfully' });
        } else {
            res.status(400).json({ error: 'An error occurred while attempting to save the data' });
        }
        
    } catch (error) {
        console.log('post_error', error)
        res.status(400).json({ error: 'Internal Server Error' });
    }
}
