import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { AdminModule } from './modules/admin.module';
import { DataSource } from 'typeorm';
import { TaskModule } from './modules/task.module';
import { DbConnectionModule } from './modules/dbconnection.module';



@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    TaskModule,
    DbConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource){
    if(dataSource.isInitialized){
      console.log("DB Connected")
    }
  }
}
