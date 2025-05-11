import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cityFormat', standalone: true })
export class CityFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .split(/[- ]+/)                          // разбиваем по пробелу или дефису
      .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
