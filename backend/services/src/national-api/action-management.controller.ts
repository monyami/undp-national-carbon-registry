import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { ActionService } from '@app/shared/action-management/action.service';
import { CreateActionDto } from '@app/shared/dto/create.action.dto';
import { UpdateActionDto } from '@app/shared/dto/update.action.dto';
import { QueryDto } from '@app/shared/dto/query.dto';
import { ActionType } from '@app/shared/enum/action.type.enum';

@Controller('actionManagement')
export class ActionManagementController {
  private logger = new Logger('ActionManagementController');

  constructor(private readonly actionService: ActionService) {}

  @Post('create')
  async createAction(@Body() createActionDto: CreateActionDto) {
    try {
      const action = await this.actionService.createAction(createActionDto);
      return {
        statusCode: 201,
        status: 201,
        message: 'Action created successfully',
        data: action,
      };
    } catch (error) {
      this.logger.error(`Error creating action: ${error.message}`);
      throw error;
    }
  }

  @Post('query')
  async queryActions(@Body() queryDto: QueryDto) {
    try {
      const result = await this.actionService.getAllActions(queryDto);
      return {
        statusCode: 200,
        status: 200,
        message: 'Actions retrieved successfully',
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(`Error querying actions: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async getActionById(@Param('id') id: string) {
    try {
      const action = await this.actionService.getActionById(parseInt(id));
      return {
        statusCode: 200,
        status: 200,
        message: 'Action retrieved successfully',
        data: action,
      };
    } catch (error) {
      this.logger.error(`Error fetching action: ${error.message}`);
      throw error;
    }
  }

  @Put('update/:id')
  async updateAction(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    try {
      const action = await this.actionService.updateAction(
        parseInt(id),
        updateActionDto,
      );
      return {
        statusCode: 200,
        status: 200,
        message: 'Action updated successfully',
        data: action,
      };
    } catch (error) {
      this.logger.error(`Error updating action: ${error.message}`);
      throw error;
    }
  }

  @Delete('delete/:id')
  async deleteAction(@Param('id') id: string) {
    try {
      const result = await this.actionService.deleteAction(parseInt(id));
      return {
        statusCode: 200,
        status: 200,
        message: 'Action deleted successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error deleting action: ${error.message}`);
      throw error;
    }
  }

  @Post('search')
  async searchActions(
    @Query('term') searchTerm: string,
    @Body() queryDto: QueryDto,
  ) {
    try {
      const result = await this.actionService.searchActions(
        searchTerm,
        queryDto,
      );
      return {
        statusCode: 200,
        status: 200,
        message: 'Search completed successfully',
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(`Error searching actions: ${error.message}`);
      throw error;
    }
  }

  @Get('type/:type')
  async getActionsByType(
    @Param('type') type: string,
    @Body() queryDto: QueryDto,
  ) {
    try {
      const result = await this.actionService.getActionsByType(
        type as ActionType,
        queryDto,
      );
      return {
        statusCode: 200,
        status: 200,
        message: 'Actions retrieved successfully',
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      this.logger.error(`Error fetching actions by type: ${error.message}`);
      throw error;
    }
  }
}
