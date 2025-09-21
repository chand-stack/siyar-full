import { Router } from "express";
import { SeriesController } from "./series.controller";

export const SeriesRoutes = Router();

SeriesRoutes.post("/", SeriesController.create);
SeriesRoutes.get("/", SeriesController.list);
SeriesRoutes.patch("/:id", SeriesController.update);
SeriesRoutes.delete("/:id", SeriesController.remove);


