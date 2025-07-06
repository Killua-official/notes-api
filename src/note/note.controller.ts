import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content } = createNoteDto;

    if (!title || !title.trim()) {
      throw new BadRequestException('Title is required');
    }

    if (!content || !content.trim()) {
      throw new BadRequestException('Content is required');
    }

    const existing = await this.noteService.findByTitle(title);
    if (existing) {
      throw new ConflictException(`Note with title "${title}" already exists`);
    }

    return this.noteService.create(createNoteDto);
  }

  @Get()
  findAll(): Promise<Note[]> {
    return this.noteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    return this.noteService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.noteService.remove(id);
  }
}

