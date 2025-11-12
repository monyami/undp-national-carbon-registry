import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActionEntity } from "../entities/action.entity";
import { CreateActionDto } from "../dto/create.action.dto";
import { UpdateActionDto } from "../dto/update.action.dto";
import { plainToClass } from "class-transformer";
import { QueryDto } from "../dto/query.dto";
import { DataListResponseDto } from "../dto/data.list.response";
import { ActionType } from "../enum/action.type.enum";

@Injectable()
export class ActionService {
  private logger = new Logger("ActionService");

  constructor(
    @InjectRepository(ActionEntity)
    private actionRepository: Repository<ActionEntity>
  ) {}

  async createAction(createActionDto: CreateActionDto): Promise<ActionEntity> {
    try {
      const action = plainToClass(ActionEntity, createActionDto);
      const createdAction = await this.actionRepository.save(action);
      this.logger.log(
        `Action created successfully with ID: ${createdAction.id} and RefId: ${createdAction.refId}`
      );
      return createdAction;
    } catch (error) {
      this.logger.error(`Error creating action: ${error.message}`);
      throw new HttpException(
        `Error creating action: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getActionById(id: number): Promise<ActionEntity> {
    try {
      const action = await this.actionRepository.findOne({
        where: { id },
      });

      if (!action) {
        throw new HttpException(
          `Action with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }

      return action;
    } catch (error) {
      this.logger.error(`Error fetching action: ${error.message}`);
      throw error;
    }
  }

  async getAllActions(query: QueryDto): Promise<DataListResponseDto> {
    try {
      const limit = query.size || 20;
      const offset = ((query.page || 1) - 1) * limit;

      const [data, count] = await this.actionRepository.findAndCount({
        skip: offset,
        take: limit,
        order: { createdTime: "DESC" },
      });

      return new DataListResponseDto(data, count);
    } catch (error) {
      this.logger.error(`Error fetching actions: ${error.message}`);
      throw new HttpException(
        `Error fetching actions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAction(
    id: number,
    updateActionDto: UpdateActionDto
  ): Promise<ActionEntity> {
    try {
      const action = await this.getActionById(id);

      Object.assign(action, updateActionDto);
      const updatedAction = await this.actionRepository.save(action);

      this.logger.log(`Action with ID ${id} updated successfully`);
      return updatedAction;
    } catch (error) {
      this.logger.error(`Error updating action: ${error.message}`);
      throw error;
    }
  }

  async deleteAction(id: number): Promise<{ success: boolean }> {
    try {
      const action = await this.getActionById(id);
      await this.actionRepository.remove(action);

      this.logger.log(`Action with ID ${id} deleted successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error deleting action: ${error.message}`);
      throw error;
    }
  }

  async searchActions(
    searchTerm: string,
    query: QueryDto
  ): Promise<DataListResponseDto> {
    try {
      const limit = query.size || 20;
      const offset = ((query.page || 1) - 1) * limit;

      const [data, count] = await this.actionRepository
        .createQueryBuilder("action")
        .where("action.title ILIKE :searchTerm", {
          searchTerm: `%${searchTerm}%`,
        })
        .orWhere("action.description ILIKE :searchTerm", {
          searchTerm: `%${searchTerm}%`,
        })
        .skip(offset)
        .take(limit)
        .orderBy("action.createdTime", "DESC")
        .getManyAndCount();

      return new DataListResponseDto(data, count);
    } catch (error) {
      this.logger.error(`Error searching actions: ${error.message}`);
      throw new HttpException(
        `Error searching actions: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getActionsByType(
    type: ActionType,
    query: QueryDto
  ): Promise<DataListResponseDto> {
    try {
      const limit = query.size || 20;
      const offset = ((query.page || 1) - 1) * limit;

      const [data, count] = await this.actionRepository.findAndCount({
        where: { type },
        skip: offset,
        take: limit,
        order: { createdTime: "DESC" },
      });

      return new DataListResponseDto(data, count);
    } catch (error) {
      this.logger.error(`Error fetching actions by type: ${error.message}`);
      throw new HttpException(
        `Error fetching actions by type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
