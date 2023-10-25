import { Container, Service, Inject } from 'typedi';

import { randomBytes } from 'crypto';

import IBuildingService from './IServices/IBuildingsService';
import { BuildingsMap } from '../mappers/BuildingsMap';
import IBuildingDTO from '../dto/IBuildingDTO';

import IBuildingRepo from './IRepos/IBuildingsRepo';

import { Building } from '../domain/building';

import { Result } from '../core/logic/Result';
import config from '../../config';

@Service()
export default class buildingService implements IBuildingService {
  constructor(
    @Inject('logger') private logger,
    @Inject(config.repos.buildings.name) private buildingsRepo: IBuildingRepo,
  ) {}
  updateBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
    throw new Error('Method not implemented.');
  }
  getBuilding(buildingId: string): Promise<Result<IBuildingDTO>> {
    throw new Error('Method not implemented.');
  }

  public async createBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
    try {
      const buildingDocument = await this.buildingsRepo.findByName(buildingDTO.name);
      const found = !!buildingDocument;

      if (found) {
        return Result.fail<IBuildingDTO>('Building with the same name already exists');
      }

      const salt = randomBytes(32);
      this.logger.silly('Hashing information for the new building');
      // Hashing or any other processing for building information can be added here.

      this.logger.silly('Creating building db record');
      const buildingOrError = Building.create({
        name: buildingDTO.name,
        localizationoncampus: buildingDTO.localizationoncampus,
        floors: buildingDTO.floors,
        lifts: buildingDTO.lifts,
        // Add more properties as needed
      });

      if (buildingOrError.isFailure) {
        throw Result.fail<IBuildingDTO>(buildingOrError.errorValue());
      }

      const buildingResult = buildingOrError.getValue();

      // Additional processing or operations specific to building creation can be added here.

      await this.buildingsRepo.save(buildingResult);
      const buildingDTOResult = BuildingsMap.toDTO(buildingResult) as IBuildingDTO;
      return Result.ok<IBuildingDTO>(buildingDTOResult);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async findAll(): Promise<string[]> {
    try {
      const buildingNames = await this.buildingsRepo.findAll();
      return buildingNames;
    } catch (err) {
      throw err;
    }
  }
}
