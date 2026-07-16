import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SnippetModule } from './snippet/snippet.module';

@Module({
  imports: [
    // Load environment variables FIRST
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env['MONGO_URI'] || 'mongodb://localhost:27017/snippet-vault'),
    AuthModule,
    SnippetModule,
  ],
})
export class AppModule { }