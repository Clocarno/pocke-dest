import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    
    limit?:string;


   
    @IsOptional()
    
    offset?:string

}