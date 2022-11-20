import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {

    try{
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    }
    catch(error)
    {
      this.handleExceptions(error)
    }
   
  }

  async findAll( paginationDto:PaginationDto ) {

   const {limit = 10, offset = 0} = paginationDto

   return await this.pokemonModel.find()
     .limit ( +limit )
     .skip ( +offset )

    return "Error en el ingreso de los datos";
  }

  async findOne(term: string) {

    let pokemon : Pokemon;

    //no
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //MongoId
    if(!pokemon && isValidObjectId(term)){

      pokemon = await this.pokemonModel.findById(term)
    }

    //Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    if(!pokemon){
      throw new NotFoundException(`pokemon with ${term} not found`)
    }

    

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id)
    if(updatePokemonDto.name)
    {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    }

    try{

    await pokemon.updateOne(updatePokemonDto, {new: true}) 
    //return updated_pokemon
    return {...pokemon.toJSON(), ...updatePokemonDto};

    }
   catch(error)
    {
      this.handleExceptions(error)
    }
  }

  
  async remove(id: string) {

   
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})
    if (deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id ${id} not found`)
  
    return;
  }


  private handleExceptions(error:any){
     
    if (error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }
    throw new InternalServerErrorException("Cant create Pokemon -Check server logs")

  }


}
