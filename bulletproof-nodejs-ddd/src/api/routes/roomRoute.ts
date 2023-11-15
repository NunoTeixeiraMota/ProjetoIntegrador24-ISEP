import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import IRoomController from '../../controllers/IControllers/IRoomController';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/room', route);

  const ctrl = Container.get(config.controllers.room.name) as IRoomController

  route.post(
    '/createRoom',
    celebrate({
      body: Joi.object({
          id: Joi.string().required(),
          building: Joi.object({
              id: Joi.string().required(),
              localizationoncampus: Joi.string().required(),
              floors: Joi.number().required(),
              lifts: Joi.number().required(),
              maxCel: Joi.array().items(Joi.number().required()).required(),
              floorOnBuilding: Joi.object({
                  id: Joi.string().required(),
                  name: Joi.string().required(),
                  description: Joi.string().required(),
                  hall: Joi.string().required(),
                  room: Joi.number().required(),
                  floorMap: Joi.string().required(),
                  hasElevator: Joi.boolean().required(),
              }),
          }),
          floor: Joi.object({
              id: Joi.string().required(),
              name: Joi.string().required(),
              description: Joi.string().required(),
              hall: Joi.string().required(),
              room: Joi.number().required(),
              floorMap: Joi.string().required(),
              hasElevator: Joi.boolean().required(),
          }),
          name: Joi.string().required(),
          category: Joi.string().required(),
          description: Joi.string().required(),
          dimension: Joi.array().items(Joi.number().required()).required(),
      }),
  }),(req,res,next) => ctrl.createRoom(req,res,next));
};
