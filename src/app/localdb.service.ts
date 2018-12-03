import { Injectable,  } from '@angular/core';
import { DataEncryptionService } from './data-encryption.service';

@Injectable({
  providedIn: 'root'
})
export class LocaldbService {

  constructor(
    public des: DataEncryptionService
  ) { }
  db;
  DBNAME = 'posdb';

  encryptJSON = (o) => this.des.encryptJSON(o);
  decryptJSON = (o) => this.des.decryptJSON(o);

  

  public opendb(version?) : Promise<any>{
    return new Promise(
      resolve => {
        if (!version) version = 2;

        let request = window.indexedDB.open(this.DBNAME, version);

        request.onblocked = (event) => {
          resolve(event)
        }

        request.onerror = (event) => {
          resolve(event)
        }
        request.onsuccess = (event) => {
          this.db = request.result;
          resolve(this.db);
        }

        request.onupgradeneeded = (event) => {
          //initialize
          this.db = event.target;
          this.db = this.db.result;
          var objectStore = this.db.createObjectStore(this.DBNAME, { keyPath: 'id' });
          resolve(this.db);
        }
      }
    )  

  }

  del(id) {
    var request = this.db.transaction([this.DBNAME], 'readwrite')
      .objectStore(this.DBNAME)
      .delete(id);
    request.onsuccess = function (event) {

    }
  }

  save2db(obj) {
    let encrypted = JSON.parse(JSON.stringify(obj));
    this.encryptJSON(encrypted);
    Promise.all(
      this.des.ps
    ).then(
      x => {
        encrypted.forEach(element => {
          this.updatedb(element);
        });

      }
    )
 
  }

 

  updatedb(obj) {
    this.encryptJSON(obj)

    var request = this.db.transaction([this.DBNAME], 'readwrite')
      .objectStore(this.DBNAME)
      .put(obj);
    
    request.onerror = function (e) 
    {
      console.log(e)
    }  

    request.onsuccess = function (event) {
      console.log(event)
    }
    
  }

  

  readAll(): Promise<any> {
    return new Promise(resolve => {
      let req = this.db.transaction([this.DBNAME])
        .objectStore(this.DBNAME)
        .getAll();

      req.onsuccess =
        (event) => {
          this.des.prepareKey().then(
            x => {
              let result = req.result;
              this.decryptJSON(result);

              resolve(result);  
            }
          )

        }
    });

  }


  read(index): Promise<any>
  {
    console.log('new promis')
    return new Promise<any>(
      resolve => {
        var request = this.db
          .transaction([this.DBNAME])
          .objectStore(this.DBNAME)
          .get(index);

        request.onsuccess =
          (event) => {
            if (request.result) {
              resolve(request.result)
            }
            resolve(null)
          }
      }
    ); 
  }
}
