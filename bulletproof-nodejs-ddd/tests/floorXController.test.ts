import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import IFloorDTO from '../src/dto/IFloorDTO';
import { Result } from '../src/core/logic/Result';
import FloorController from '../src/controllers/floorController';
import IFloorService from '../src/services/IServices/IFloorService';
import { Floor } from '../src/domain/floor';
import {FloorMap} from '../src/mappers/FloorMap';

describe('FloorController (Unit Test)', function () {
  const sandbox = sinon.createSandbox();

  beforeEach(function () {
    Container.reset();
    const floorSchemaInstance = require("../src/persistence/schemas/floorSchema").default;
    Container.set("FloorSchema", floorSchemaInstance);

    const floorRepoClass = require("../src/repos/floorRepo").default;
    const floorRepoInstance = new floorRepoClass(); 
    Container.set("FloorRepo", floorRepoInstance);

    const floorServiceClass = require("../src/services/floorService").default;
    const floorServiceInstance = new floorServiceClass(); 
    Container.set("FloorService", floorServiceInstance);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('createFloor: returns JSON with floor data', async function () {
    const floorData = {
        "id": "123",
        "name": "Floor 123",
        "description": "Welcome to floor 123",
        "hall": "dadad",
        "room": 4,
        "floorMap": "dasdada",
        "hasElevator":true,
        "passages": []
    };

    const req: Partial<Request> = {};
    req.body = floorData;
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
    const next: Partial<NextFunction> = () => {};
    const floorServiceInstance = Container.get("FloorService");

    const expectedResult : IFloorDTO = {
      "id": req.body.id,
      "name": req.body.name,
      "description": req.body.description,
      "hall": req.body.hall,
      "room": req.body.room,
      "floorMap": req.body.floorMap,
      "hasElevator": req.body.hasElevator,
      "passages": req.body.passages
    }

    sinon.stub(floorServiceInstance, "createFloor").returns(Result.ok(expectedResult));
    const ctrl = new FloorController(floorServiceInstance as IFloorService);
    await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);

    // Assertions
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedResult));
  });

  it('updateFloorMap: tests the update of floor map', async function () {
    const floorData = {
      "id": "123",
      "name": "Floor 123",
      "description": "Welcome",
      "hall": "dadad",
      "room": 4,
      "floorMap": "dasdada",
      "hasElevator": true,
      "passages": []
    };
  
    const updatedFloorData = {
      "id": "123",
      "name": "Floor 123",
      "description": "Welcome to LIDL",
      "hall": "hall",
      "room": 5,
      "floorMap": "aaaaaaaaa",
      "hasElevator": false,
      "passages": []
    };
  
    const req: Partial<Request> = {};
    req.body = floorData;
  
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  
    const next: Partial<NextFunction> = () => {};
    const floorServiceInstance = Container.get("FloorService");
    sinon.stub(floorServiceInstance, "updateFloor").returns(Result.ok(updatedFloorData));
  
    const ctrl = new FloorController(floorServiceInstance as IFloorService);
    await ctrl.updateFloor(<Request>req, <Response>res, <NextFunction>next);
  
    // Assertions
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(updatedFloorData));
  });
  it('updateFloorPassages: tests the update of passages', async function () {
    const floorData = {
      "id": "123",
      "name": "Floor 123",
      "description": "Welcome",
      "hall": "dadad",
      "room": 4,
      "floorMap": "dasdada",
      "hasElevator": true,
      "passages": [1]
    };
  
    const updatedFloorData = {
      "id": "123",
      "name": "Floor 123",
      "description": "Welcome to LIDL",
      "hall": "hall",
      "room": 5,
      "floorMap": "aaaaaaaaa",
      "hasElevator": false,
      "passages": [2]
    };
  
    const req: Partial<Request> = {};
    req.body = floorData;
  
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  
    const next: Partial<NextFunction> = () => {};
    const floorServiceInstance = Container.get("FloorService");
    sinon.stub(floorServiceInstance, "updateFloor").returns(Result.ok(updatedFloorData));
  
    const ctrl = new FloorController(floorServiceInstance as IFloorService);
    await ctrl.updateFloor(<Request>req, <Response>res, <NextFunction>next);
  
    // Assertions
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(updatedFloorData));
  });
  it('addPassages: returns JSON with added passages data', async function () {
    const floorServiceInstance = Container.get("FloorService");
  
    const floorData: IFloorDTO = {
      "id": "123",
      "name": "Floor 123",
      "description": "Welcome to floor 123",
      "hall": "dadad",
      "room": 4,
      "floorMap": "dasdada",
      "hasElevator": true,
      "passages": []
    };
  
    const floorDataPassage: IFloorDTO = {
      "id": "456",
      "name": "Floor 456",
      "description": "This floor offers a beautiful view of the city skyline.",
      "hall": "Main Hall",
      "room": 8,
      "floorMap": "dasdasd",
      "hasElevator": false,
      "passages": []
    };
  
    // Assume FloorMap.toDomain converts IFloorDTO to the domain object
    const FloorPassaDomain =  FloorMap.toDomain(floorDataPassage);
  
    const req: Partial<Request> = {};
    req.body = { ...floorData, newPassage: floorDataPassage }; // Include newPassage in the request body
  
    const res: Partial<Response> = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  
    const next: Partial<NextFunction> = () => {};
  
    const expectedResult: IFloorDTO = {
      ...floorData,
      passages: [FloorPassaDomain], // Expected result with added passage
    };
  
    sinon.stub(floorServiceInstance, "addPassages").returns(Result.ok(expectedResult));
  
    const ctrl = new FloorController(floorServiceInstance as IFloorService);
    await ctrl.addPassages(req as Request, res as Response, next as NextFunction);
  
    // Assertions
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedResult));
  });
  

});