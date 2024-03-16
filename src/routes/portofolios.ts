import { Router } from "express";
import { GetPortofolioList, StorePortofolioList } from "../controllers/portofolios";

export default (router: Router) => {
    router.get('/portofolios', GetPortofolioList)
    router.post('/portofolios', StorePortofolioList)
}