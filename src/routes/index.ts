import { Router } from "express";
import portofolios from "./portofolios";
import cv from './cv'
const router = Router()

export default (): Router => {
    portofolios(router)
    cv(router)
    return router
}