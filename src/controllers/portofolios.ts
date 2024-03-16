import express, {Request, Response} from "express"
import { data } from "./constant"
import { initAdmin } from "../db/firebase/initialize"
import { getImageList } from "../db/firebase/firebase"

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
        const {} = req.body
    } catch (error) {
        
    }
}
