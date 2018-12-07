import { Injectable } from '@angular/core';
import { EncryptionService } from 'angular-encryption-service';
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Injectable({
  providedIn: 'root'
})
export class DataEncryptionService {
  key2;
  ps = [];

  constructor(private encryptionService: EncryptionService) {
  }

  prepareKey() : Promise<any> {
    return new Promise(resolve => {
      this.encryptionService.generateKey('helloworld').then(
        k => {
          this.key2 = k;
          resolve(k);
        }
      );
    })

  }

  encryptJSON=(obj)=> {
    this.ps = [];
    this.scan(obj, this.encrypt.bind(this));
  }

  decryptJSON  = (obj) => {
    this.ps = [];
    this.scan(obj, this.decrypt.bind(this));
  }

  encrypt(data): Promise<any> {
    return this.encryptionService.encrypt(data, this.key2);
  }

  decrypt(data): Promise<any> {
    
    return this.encryptionService.decrypt(data, this.key2);
  }

  scan = (obj, func) => {
    Object.keys(obj).forEach(
      k => {
        let val = obj[k];

        if (typeof val == 'object') {
          this.scan(val, func);
        }
        else {
          if (k != 'id') {
            let p =
              func(val);
            this.ps.push(p);
     
            p.then(
              d => {
                let result = []; 
                obj[k] = d; 
              }
            ) 
          }
        }
      }
    )
  }
}
