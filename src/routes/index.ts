import { Router } from "express";
import portofolios from "./portofolios";
import cv from "./cv";
import todo from "./todo";
const router = Router();

export default (): Router => {
  portofolios(router);
  cv(router);
  todo(router);
  return router;
};
