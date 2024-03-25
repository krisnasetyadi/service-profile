import { Router } from "express";
import { GetCV, UpdateCV, DeleteCV, DownloadCv } from "../controllers/cv";

export default (router: Router) => {
    router.get('/cv/', GetCV)
    router.put('/cv/', UpdateCV)
    router.delete('/cv/:id/', DeleteCV)
    router.get('/cv/download/', DownloadCv)
}