import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MongoAdapterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformResponse(data)));
  }

  private transformResponse(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformMongoFields(item));
    }
    if (typeof data === 'object' && data !== null) {
      return this.transformMongoFields(data);
    }
    return data;
  }

  private transformMongoFields(obj: any): any {
    if (obj && !!obj._id) {
      obj.id = obj._id;
      delete obj._id;
    }
    if (obj && !!obj.__v) {
      delete obj.__v;
    }
    return obj;
  }
}
