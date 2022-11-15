import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {

    if (!isValidObjectId(value)){

      throw new BadRequestException(`Is not a mongoDB key valid ${value}`)
    }
    return value;
  }
}
