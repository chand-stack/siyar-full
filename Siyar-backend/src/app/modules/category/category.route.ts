import { Router } from "express";
import { CategoryController } from "./category.controller";

export const CategoryRoutes = Router();

CategoryRoutes.post("/", CategoryController.create);
CategoryRoutes.get("/", CategoryController.list);
CategoryRoutes.patch("/:id", CategoryController.update);
CategoryRoutes.delete("/:id", CategoryController.remove);


