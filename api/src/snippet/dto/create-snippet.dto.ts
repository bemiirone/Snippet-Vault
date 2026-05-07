import { IsString, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';

const LANGUAGES = ['ts', 'js', 'py', 'sh', 'json', 'yml', 'md', 'sql', 'html', 'css', 'other'] as const;

export class CreateSnippetDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsEnum(LANGUAGES)
  language!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  starred?: boolean;
}
