import { Controller, Get, Query, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { STATUS_CODES } from 'http';
import { ParseMongoIdPipePipe } from 'src/common/pipes/parse-mongo-id-pipe/parse-mongo-id-pipe.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@Controller('v2/pokemon')
@UsePipes(ValidationPipe)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  //@HttpCode(HttpStatus.OK)
  create(@Body() createPokemonDto: CreatePokemonDto) {

    return this.pokemonService.create(createPokemonDto);
   
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto) {

    console.log({paginationDto})
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipePipe ) id: string) {
    return this.pokemonService.remove(id);
  }
}
