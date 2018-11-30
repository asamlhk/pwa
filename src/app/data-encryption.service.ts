import { Injectable } from '@angular/core';
import { EncryptionService } from 'angular-encryption-service';

@Injectable({
  providedIn: 'root'
})
export class DataEncryptionService {
  key2;

  constructor(private encryptionService: EncryptionService) {
    this.encryptionService.generateKey('helloworld').then(k => this.key2 = k);
  }

  encrypt(data) {
    return this.encryptionService.encrypt(data, this.key2);
  }

  decrypt(data) {
    return this.encryptionService.decrypt(data, this.key2);
  }

  scan = (obj, func) => {
    Object.keys(obj).forEach(
      o => {
        if (typeof obj[o] == 'object') {

          this.scan(obj[o], func);
        }
        else {
          if (o != 'id') {
            func(obj[o]).then(
              d => obj[o] = d
            )
          }
        }
      }
    )
  }
}
