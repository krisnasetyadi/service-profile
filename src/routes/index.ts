import { Router } from "express";
import portofolios from "./portofolios";
const router = Router()

export default (): Router => {
    portofolios(router)
    return router
}