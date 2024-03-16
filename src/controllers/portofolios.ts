import {Request, Response} from "express"
import { initAdmin } from "../db/firebase/initialize"
import { getImageList, uploadFileToFirebase } from "../db/firebase/firebase"
import { query } from "../db/postgres/postgre"
import { stringToArray } from '../utils/helper'

export const GetPortofolioList = async (req: Request , res: Response) => {
    try {
        const queryParams = req.query
        const offset = Number(queryParams?.offset) || 0;
        const limit = Number(queryParams?.limit) || 0
        const totalData = await query('SELECT COUNT(id) FROM projects')
        const [{ count }] = totalData?.rows
        const response = await query('SELECT * FROM projects OFFSET $1 LIMIT $2', [offset, limit])

        const bodyResponse = {
            Query: {
                offset,
                limit,
                Total: Number(count) || 0
            },
            Data: response || []
        }
        console.log('GetPortofolioList execute succesfully')
        res.status(200).json(bodyResponse)
    } catch (error) {
        console.log('GetPortofolioList cannot be executed', error)
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

        const existingProject: any = await query(`SELECT * FROM projects WHERE project_name = $1 limit 1`, [project_name]) 
       
        if(existingProject.rowCount > 0) {
            return  res.status(400).json({ error: 'Project already exist' });
        }

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
            console.log('StorePortofolioList execute succesfully')
            return res.status(200).json({ message: 'Data save successfully' });
        } else {
            console.log('StorePortofolioList cannot be executed while attempting save data')
            return res.status(400).json({ error: 'An error occurred while attempting to save the data' });
        }
        
    } catch (error) {
        console.log('StorePortofolioList cannot be executed', error)
        return res.status(400).json({ error: 'Internal Server Error' });
    }
}
