import { Repo } from "../../core/infra/Repo";
import { RobotType } from "../../domain/robotType";

export default interface IRobotTypeRepo extends Repo<RobotType> {
  save(robotType: RobotType): Promise<RobotType>;
  findById(id: string): Promise<RobotType>;
  findByDesignation(des: string): Promise<RobotType>;
}