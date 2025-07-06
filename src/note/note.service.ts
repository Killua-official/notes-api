import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    return this.noteRepository.save(note);
  }

  findAll(): Promise<Note[]> {
    return this.noteRepository.find();
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async findByTitle(title: string): Promise<Note | null> {
    return this.noteRepository.findOneBy({ title });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.preload({
      id,
      ...updateNoteDto,
    });

    if (!note) {
      throw new NotFoundException(`Cannot update. Note with id ${id} not found`);
    }

    return this.noteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const result = await this.noteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cannot delete. Note with id ${id} not found`);
    }
  }
}


