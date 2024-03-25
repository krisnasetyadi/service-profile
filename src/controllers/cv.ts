import { Request, Response } from "express"
import { query } from "../db/postgres/postgres"
import { QueryResultBase } from "pg"

export const UpdateCV = async(req: Request, res: Response) => {
    if(req.method === 'PUT') {
        try {
            const { is_default, id } = req.body
            const files = req.files as Express.Multer.File[]
            const cvFile = files.find(f => f.fieldname === 'file')
            const existingCV = await query('SELECT * FROM cvfiles') as QueryResultBase;
            console.log('existingCV', existingCV)
            let status: string = '';
            let newCV: any;
            if(existingCV.rowCount !== 0 && id) {
                newCV = await query(`UPDATE cvfiles 
                SET (name, type, content, is_default) 
                VALUES ($1, $2, $3, $4) WHERE id = ${id}
                RETURNING id;`, 
               [cvFile?.originalname, cvFile?.mimetype, cvFile?.buffer, is_default]);
              
               status = 'updated'
            } else {
                newCV = await query(`
                INSERT INTO cvfiles (name, type, content, is_default) 
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [cvFile?.originalname, cvFile?.mimetype, cvFile?.buffer, is_default]);
                status = 'saved'
            }
       
            console.log('UpdateCV executed successfully', newCV)
            return res.status(200).json({ Data: newCV.rows, success: true, message: `Data ${status} successfully` })
        } catch (error) {
            console.log('UpdateCV cannot be executed ', error)
            return res.status(500).json({ error: 'Internal Server Error'})
        }
    }
 
}

export const GetCV = async(req: Request, res: Response) => {
    if(req.method === 'GET') {
        try {
            const existingCV = await query(`SELECT * FROM cvfiles`);
            console.log('GetCV executed successfully')
            return res.status(200).json({ Data: existingCV.rows })
        } catch (error) {
            console.log('GetCV cannot be executed', error)
            return res.status(500).json({ error: 'Internal server error'})
        }
    }
}

export const DeleteCV = async(req: Request, res: Response) => {
    if(req.method === 'DELETE') {
        try {
            const { id } = req.params
            const queryResponse = await query(`DELETE FROM cvfiles where id = ${id}`)
            if(queryResponse.rowCount === 0) {
                console.log('DeleteCV executed successfully')
                return res.status(200).json({ message: 'Data deleted successfully' })
            } 
        } catch (error) {
            console.log('Delete CV cannot be executed', error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export const DownloadCv = async(req: Request, res: Response) => {
    if(req.method === 'GET') {
        try {
            const queryResponse = await query(`SELECT * FROM cvfiles WHERE is_default = 'Y'`)
            if(queryResponse.rowCount === 0) {
                return res.status(400).json({ error: 'Data not available' })
            } else {
                const { name, type, content } = queryResponse.rows[0]
                console.log('queryResponses', queryResponse.rows[0])
    
                const headers = {
                    'Content-type': type,
                    'Content-Disposition': `attachment; filename="${name}"`
                }
                console.log('DownloadCV executed successfully')
                return res.set(headers).status(200).send(content)
            }
        } catch (error) {
            console.log('DownloadCV cannot be executed', error)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}