import { Router } from "express";
import {
  GetPortofolioById,
  GetPortofolioList,
  StorePortofolioList,
  UpdatePortofolioById,
} from "../controllers/portofolios";

export default (router: Router) => {
  router.get("/portofolios/", GetPortofolioList);
  router.get("/portofolios/:id/", GetPortofolioById);
  router.post("/portofolios/", StorePortofolioList);
  router.put("/portofolios/:id/", UpdatePortofolioById);
};
