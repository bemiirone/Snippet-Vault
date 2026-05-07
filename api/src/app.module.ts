import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SnippetModule } from './snippet/snippet.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env['MONGO_URI'] || 'mongodb://localhost:27017/snippet-vault'),
    AuthModule,
    SnippetModule,
  ],
})
export class AppModule {}
