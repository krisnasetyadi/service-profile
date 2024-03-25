import { Router } from "express";
import { GetPortofolioById, GetPortofolioList, StorePortofolioList } from "../controllers/portofolios";

export default (router: Router) => {
    router.get('/portofolios/', GetPortofolioList)
    router.get('/portofolios/:id/', GetPortofolioById)
    router.post('/portofolios/', StorePortofolioList)
}