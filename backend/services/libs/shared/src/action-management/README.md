# Action Management Module

This module manages climate action records for the UNDP National Carbon Registry system. Actions represent initiatives, policies, or programs aimed at climate mitigation, adaptation, or other climate-related objectives.

## Overview

The Action Management module provides comprehensive CRUD (Create, Read, Update, Delete) operations for managing climate actions. Each action contains detailed information about its type, objectives, implementation status, affected sectors, and associated documents.

## Database Schema

### Table: `action_entity`

The `action_entity` table stores all action records with the following fields:

| Column | Type | Description | Nullable |
|--------|------|-------------|----------|
| `id` | INTEGER (PK) | Primary Key - Auto-incrementing identifier | No |
| `refId` | VARCHAR | Unique Reference ID (auto-generated) | Yes |
| `type` | ENUM | Action type (Mitigation, Adaptation, Cross-cutting, Transparency, Other) | No |
| `title` | VARCHAR | Title of the action | No |
| `description` | TEXT | Short description of the action | No |
| `objectives` | TEXT | Action objectives | No |
| `instrumentTypes` | ENUM[] | Type(s) of instruments used (Policy, Regulatory, Economic, Other) | Yes |
| `status` | ENUM | Action status (Planned, Adopted, Implemented) | No (Default: Planned) |
| `sectorAffected` | ENUM | Primary sector affected | No |
| `startYear` | INTEGER | Year the action starts (2013-2050) | No |
| `nationalAnchors` | ENUM[] | National strategies the action is anchored in (NDC, NAP, NDP, Other) | Yes |
| `documents` | JSONB | Array of associated documents | Yes |
| `remarks` | VARCHAR | Additional remarks | Yes |
| `createdTime` | BIGINT | Timestamp when record was created | No |
| `updatedTime` | BIGINT | Timestamp when record was last updated | No |
| `createdBy` | INTEGER | User ID of creator | Yes |
| `updatedBy` | INTEGER | User ID of last updater | Yes |
| `version` | INTEGER | Record version for optimistic locking | No (Default: 1) |

### Enum Types

#### ActionType
- Mitigation
- Adaptation
- Cross-cutting
- Transparency
- Other

#### ActionStatus
- Planned
- Adopted
- Implemented

#### ActionSector
- Energy
- Transport
- Industry (IPPU)
- Agriculture
- Forestry
- Water and Sanitation
- Land Use
- Cross-cutting
- Other

#### ActionInstrument
- Policy
- Regulatory
- Economic
- Other

#### ActionNationalAnchor
- NDC (Nationally Determined Contribution)
- NAP (National Adaptation Plan)
- NDP (National Development Plan)
- Other

## Service Methods

### ActionService

#### `async createAction(createActionDto: CreateActionDto): Promise<ActionEntity>`
Creates a new action record.

**Parameters:**
- `createActionDto`: DTO containing action details

**Returns:** Created ActionEntity with generated refId

**Example:**
```typescript
const actionDto = {
  type: ActionType.Mitigation,
  title: "Solar Energy Initiative",
  description: "Promoting solar energy adoption",
  objectives: "Increase renewable energy capacity",
  sectorAffected: ActionSector.Energy,
  startYear: 2025,
  status: ActionStatus.Planned,
  instrumentTypes: [ActionInstrument.Policy],
  nationalAnchors: [ActionNationalAnchor.NDC]
};

const action = await actionService.createAction(actionDto);
```

#### `async getActionById(id: number): Promise<ActionEntity>`
Retrieves a specific action by ID.

**Parameters:**
- `id`: Action ID

**Returns:** ActionEntity or throws 404 if not found

#### `async getAllActions(query: QueryDto): Promise<DataListResponseDto>`
Retrieves paginated list of all actions.

**Parameters:**
- `query`: QueryDto with pagination (page, size)

**Returns:** DataListResponseDto with data array and total count

#### `async updateAction(id: number, updateActionDto: UpdateActionDto): Promise<ActionEntity>`
Updates an existing action.

**Parameters:**
- `id`: Action ID
- `updateActionDto`: DTO with fields to update

**Returns:** Updated ActionEntity

#### `async deleteAction(id: number): Promise<{ success: boolean }>`
Deletes an action by ID.

**Parameters:**
- `id`: Action ID

**Returns:** Success response

#### `async searchActions(searchTerm: string, query: QueryDto): Promise<DataListResponseDto>`
Searches actions by title or description.

**Parameters:**
- `searchTerm`: Search term to find in title or description
- `query`: QueryDto with pagination

**Returns:** DataListResponseDto with matching records

#### `async getActionsByType(type: ActionType, query: QueryDto): Promise<DataListResponseDto>`
Filters actions by type.

**Parameters:**
- `type`: ActionType to filter by
- `query`: QueryDto with pagination

**Returns:** DataListResponseDto with matching records

## DTOs

### CreateActionDto
Used when creating a new action. All fields except optional ones are required:

```typescript
{
  type: ActionType;                          // Required
  title: string;                             // Required
  description: string;                       // Required
  objectives: string;                        // Required
  sectorAffected: ActionSector;             // Required
  startYear: number;                         // Required
  instrumentTypes?: ActionInstrument[];      // Optional
  status?: ActionStatus;                     // Optional (default: Planned)
  nationalAnchors?: ActionNationalAnchor[]; // Optional
  documents?: any[];                         // Optional
  remarks?: string;                          // Optional
  createdBy?: number;                        // Optional
}
```

### UpdateActionDto
Used when updating an action. All fields are optional:

```typescript
{
  type?: ActionType;
  title?: string;
  description?: string;
  objectives?: string;
  sectorAffected?: ActionSector;
  startYear?: number;
  instrumentTypes?: ActionInstrument[];
  status?: ActionStatus;
  nationalAnchors?: ActionNationalAnchor[];
  documents?: any[];
  remarks?: string;
  updatedBy?: number;
}
```

## Module Integration

The ActionModule is imported in the SharedModule and provides:

**Imports:**
- TypeOrmModule (ActionEntity)
- UtilModule
- UserModule
- FileHandlerModule

**Exports:**
- ActionService

**Injection Example:**
```typescript
import { ActionService } from '@libs/shared/src/action-management/action.service';

@Injectable()
export class MyService {
  constructor(private actionService: ActionService) {}
}
```

## Features

1. **Auto-generated Reference ID**: Each action gets a unique reference ID in format: `ACTION-{timestamp}-{random}`

2. **Automatic Timestamps**: Creation and update times are automatically tracked in milliseconds

3. **Version Tracking**: Records include a version number for optimistic locking

4. **Array Enums**: Supports multiple instrument types and national anchors via PostgreSQL array types

5. **Document Attachment**: Actions can have associated documents stored as JSONB

6. **Full-text Search**: Search functionality on title and description fields

7. **Pagination Support**: All list operations support page-based pagination via QueryDto

## Error Handling

The service throws HttpExceptions with appropriate status codes:

- **404 Not Found**: When action ID doesn't exist
- **500 Internal Server Error**: For database errors and unexpected issues

All errors are logged with context information for debugging.

## Usage Example

```typescript
// Create an action
const newAction = await actionService.createAction({
  type: ActionType.Mitigation,
  title: "Wind Farm Development",
  description: "Establishing large-scale wind farms",
  objectives: "Generate 500 MW of wind power",
  sectorAffected: ActionSector.Energy,
  startYear: 2024,
  status: ActionStatus.Planned,
  instrumentTypes: [ActionInstrument.Economic, ActionInstrument.Policy],
  nationalAnchors: [ActionNationalAnchor.NDC],
  remarks: "High priority project"
});

// Update the action
const updatedAction = await actionService.updateAction(newAction.id, {
  status: ActionStatus.Adopted,
  remarks: "Project approved and initiated"
});

// Search for actions
const results = await actionService.searchActions("wind", { page: 1, size: 20 });

// Get actions by type
const mitigationActions = await actionService.getActionsByType(
  ActionType.Mitigation, 
  { page: 1, size: 50 }
);

// Delete an action
await actionService.deleteAction(newAction.id);
```

## Database Connection

The module uses TypeORM with PostgreSQL. The database is automatically configured with:

- **Synchronize**: `true` - Schema is automatically synced on application startup
- **Auto Load Entities**: `true` - Entities are automatically discovered
- **Connection Pool**: Configured in docker-compose.yml

## Related Files

- Entity: `/backend/services/libs/shared/src/entities/action.entity.ts`
- Enums: `/backend/services/libs/shared/src/enum/action.*.enum.ts`
- DTOs: `/backend/services/libs/shared/src/dto/create.action.dto.ts`, `/update.action.dto.ts`
- Module: `/backend/services/libs/shared/src/action-management/action.module.ts`
- Service: `/backend/services/libs/shared/src/action-management/action.service.ts`

## Future Enhancements

- Add API endpoints for REST operations
- Implement authorization/CASL rules
- Add validation constraints
- Support for linked programmes
- Reporting and analytics capabilities
- Document upload/download functionality
