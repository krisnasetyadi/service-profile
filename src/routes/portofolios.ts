import { Router } from "express";
import { GetPortofolioList } from "../controllers/portofolios";

export default (router: Router) => {
    router.get('/portofolios', GetPortofolioList)
}