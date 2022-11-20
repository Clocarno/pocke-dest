import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';





@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios

  

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

 
  async executeSeed(){
    
    await this.pokemonModel.deleteMany({});
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    const pokemonToInsert:{name:string, no:string}[] = []
    data.results.forEach(async({name, url}) =>{
      
      const splits = url.split('/')
      const no = splits[splits.length - 2]
      //const pokemon = await this.pokemonModel.create({name, no})
      pokemonToInsert.push({ name, no })
      
    });
     
    this.pokemonModel.insertMany(pokemonToInsert)
     
    return 'SEED EXECUTED'
  }
}
