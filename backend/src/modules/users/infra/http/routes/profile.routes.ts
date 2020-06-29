import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import ProfilesController from '../controllers/ProfilesController';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const profilesController = new ProfilesController();

profileRouter.get('/', profilesController.show);

profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password')),
  },
}), profilesController.update);

export default profileRouter;
