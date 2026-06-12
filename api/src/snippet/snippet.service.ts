import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snippet } from './schemas/snippet.schema';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { QuerySnippetDto } from './dto/query-snippet.dto';

@Injectable()
export class SnippetService {
  constructor(
    @InjectModel(Snippet.name)
    private readonly snippetModel: Model<Snippet>,
  ) { }

  async create(dto: CreateSnippetDto): Promise<Snippet> {
    return this.snippetModel.create(dto);
  }

  async findAll(query: QuerySnippetDto): Promise<Snippet[]> {
    const filter: Record<string, unknown> = {};

    if (query.q) {
      filter['$text'] = { $search: query.q };
    }

    if (query.tags) {
      const tags = query.tags.split(',').map(t => t.trim()).filter(Boolean);
      filter['tags'] = { $in: tags };
    }

    if (query.programmingLanguage) {
      filter['programmingLanguage'] = query.programmingLanguage;
    }

    const sort: Record<string, 1 | -1> = {};
    if (query.sort === 'oldest') {
      sort['createdAt'] = 1;
    } else if (query.sort === 'alpha') {
      sort['title'] = 1;
    } else {
      sort['createdAt'] = -1;
    }

    const limit = Math.min(query.limit || 50, 500);

    return this.snippetModel.find(filter).sort(sort).limit(limit).exec();
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet with ID "${id}" not found`);
    }
    return snippet;
  }

  async update(id: string, dto: UpdateSnippetDto): Promise<Snippet> {
    const snippet = await this.snippetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet with ID "${id}" not found`);
    }
    return snippet;
  }

  async remove(id: string): Promise<void> {
    const result = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Snippet with ID "${id}" not found`);
    }
  }

  async getStats(): Promise<{
    total: number;
    topLanguages: { language: string; count: number }[];
    topTags: { tag: string; count: number }[];
  }> {
    const total = await this.snippetModel.countDocuments();

    const topLanguages = await this.snippetModel.aggregate([
      { $group: { _id: '$programmingLanguage', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { language: '$_id', count: 1, _id: 0 } },
    ]);

    const topTags = await this.snippetModel.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ]);

    return { total, topLanguages, topTags };
  }

  async exportAll(): Promise<Snippet[]> {
    return this.snippetModel.find().sort({ createdAt: -1 }).exec();
  }

  async importAll(snippets: CreateSnippetDto[]): Promise<Snippet[]> {
    const imported = await this.snippetModel.insertMany(snippets);
    return imported.map(doc => doc.toObject());
  }
}
