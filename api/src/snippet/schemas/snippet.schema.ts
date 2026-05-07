import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Snippet extends Document {
  @Prop({ required: true, index: 'text' })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({
    required: true,
    enum: ['ts', 'js', 'py', 'sh', 'json', 'yml', 'md', 'sql', 'html', 'css', 'other'],
  })
  language!: string;

  @Prop({ type: [String], default: [], index: true })
  tags!: string[];

  @Prop({ default: false })
  starred!: boolean;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index({ title: 'text', content: 'text' });
SnippetSchema.index({ tags: 1 });
SnippetSchema.index({ language: 1 });
SnippetSchema.index({ createdAt: -1 });
