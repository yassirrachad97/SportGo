import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberPipe implements PipeTransform {
  transform(value: any) {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(`The value must be a valid number`);
    }
    return parsedValue;
  }
}
