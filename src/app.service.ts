import { Injectable } from '@nestjs/common';
import * as moment from "moment";

@Injectable()
export class AppService {
  getHello(): string {
    // const tmp = moment("05 26 2024");
    // const tmp2 = moment().format("DD-MM-YYYY").toString();
    // console.log(tmp);
    // console.log(tmp2);
    return 'Hello World!';
  }
}
