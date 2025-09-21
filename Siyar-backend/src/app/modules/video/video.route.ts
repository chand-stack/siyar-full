import { Router } from "express";
import { VideoController } from "./video.controller";

export const VideoRoutes = Router();

VideoRoutes.post("/", VideoController.create);
VideoRoutes.get("/", VideoController.list);
VideoRoutes.get("/featured", VideoController.getFeatured);
VideoRoutes.get("/:id", VideoController.getById);
VideoRoutes.patch("/:id", VideoController.update);
VideoRoutes.delete("/:id", VideoController.remove);
VideoRoutes.patch("/:id/feature", VideoController.setAsFeatured);
