import { Router, type IRouter } from "express";
import healthRouter     from "./health.js";
import authRouter       from "./auth.routes.js";
import collectionRouter from "./collection.routes.js";
import sareeRouter      from "./saree.routes.js";
import homepageRouter   from "./homepage.routes.js";
import broadcastRouter  from "./broadcast.routes.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",        authRouter);
router.use("/collections", collectionRouter);
router.use("/sarees",      sareeRouter);
router.use("/homepage",    homepageRouter);
router.use("/broadcast",   broadcastRouter);

export default router;
