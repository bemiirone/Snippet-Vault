import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Snippet, SnippetSchema } from './schemas/snippet.schema';
import { SnippetController } from './snippet.controller';
import { SnippetService } from './snippet.service';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyMiddleware } from '../auth/api-key.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Snippet.name, schema: SnippetSchema }]),
    AuthModule,
  ],
  controllers: [SnippetController],
  providers: [SnippetService],
  exports: [SnippetService],
})
export class SnippetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(SnippetController);
  }
}
