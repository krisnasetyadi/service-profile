import express, {Request, Response} from "express"
import { data } from "./constant"

export const GetPortofolioList = async (req: Request , res: Response) => {
    try {
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ message: 'An error occured' })
    }
}