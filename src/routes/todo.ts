import { Router } from "express";

import {
  DeleteTodoById,
  GetTodoById,
  GetTodoList,
  StoreTodo,
  UpdateTodoById,
} from "../controllers/todo";

export default (router: Router) => {
  router.get("/todos/", GetTodoList);
  router.get("/todo/:id/", GetTodoById);
  router.post("/todo/", StoreTodo);
  router.put("/todo/:id/", UpdateTodoById);
  router.delete("/todo/:id", DeleteTodoById);
};
