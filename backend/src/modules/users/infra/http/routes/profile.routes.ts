import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import ProfilesController from '../controllers/ProfilesController';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const profilesController = new ProfilesController();

profileRouter.get('/', profilesController.show);
profileRouter.put('/', profilesController.update);

export default profileRouter;
