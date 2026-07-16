/// <reference types="node" />
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { QuerySnippetDto } from './dto/query-snippet.dto';

@Controller('snippets')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) { }

  @Post()
  create(@Body() dto: CreateSnippetDto) {
    return this.snippetService.create(dto);
  }

  @Get()
  findAll(@Query() query: QuerySnippetDto) {
    return this.snippetService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.snippetService.getStats();
  }

  @Post('import/json')
  import(@Body() snippets: CreateSnippetDto[]) {
    return this.snippetService.importAll(snippets);
  }

  @Get('export/json')
  export(@Res() res: Response) {
    return this.snippetService.exportAll().then(snippets => {
      res.setHeader('Content-Disposition', 'attachment; filename=snippets.json');
      res.setHeader('Content-Type', 'application/json');
      res.json(snippets);
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSnippetDto) {
    return this.snippetService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snippetService.remove(id);
  }
}
