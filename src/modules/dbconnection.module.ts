import { Module } from "@nestjs/common";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME') ?? 'taskmanager',
        autoLoadEntities: true,
        synchronize: true, // turn off in production
      }),
    }),
  ],
})
export class DbConnectionModule {}
