import { Logger, Module } from "@nestjs/common";
import { ActionService } from "./action.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActionEntity } from "../entities/action.entity";
import { UtilModule } from "../util/util.module";
import { UserModule } from "../user/user.module";
import { FileHandlerModule } from "../file-handler/filehandler.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ActionEntity]),
    UtilModule,
    UserModule,
    FileHandlerModule,
  ],
  providers: [ActionService, Logger],
  exports: [ActionService],
})
export class ActionModule {}
