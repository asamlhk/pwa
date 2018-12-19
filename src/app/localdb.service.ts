import { Injectable, } from '@angular/core';
import { DataEncryptionService } from './data-encryption.service';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { FirebaseStorage } from '../../node_modules/angularfire2';

@Injectable({
  providedIn: 'root'
})
export class LocaldbService {

  constructor(
    public des: DataEncryptionService,
    private afs: AngularFirestore
  ) { }
  db;
  DBNAME = 'posdb';

  encryptJSON = (o) => this.des.encryptJSON(o);
  decryptJSON = (o) => this.des.decryptJSON(o);

  public syncToFB() {

    let collection = this.afs.collection<any>('ePOS');
    this.readAll().then(
      d => {
        d.forEach(
          i => { 
              collection.ref.where("id", "==", i.id).get().then(
              fbitem => {
                if (fbitem.docs.length == 0) {
                  collection.add(i)
               }
                else {
                  collection.doc(fbitem.docs[0].id).set(i)
                }
              }
            )

          }
        )
      }
    )

    console.log(collection);
  }

  public syncFromFB() : Promise<any>  {
    return new Promise(
      resolve => {
        this.afs.collection<any>('ePOS').ref.get().then(
          items => {
            let obj = [];
            let ps = [];
            items.forEach(
              item => {
                let p = item.ref.get();
                ps.push(p);
                  p.then(d => {
                    let data = d.data();
                    obj.push(data)
                  } )
      
              }
            )
            Promise.all(
              ps
            ).then(
              () => {
                this.save2db(obj);
    
                console.log(obj)
                resolve(true)
              }
            )
             
          }
        )
      }
    )



  }

  public opendb(version?): Promise<any> {
    return new Promise(
      resolve => {
        //if (!version) version = 2;

        let request = window.indexedDB.open(this.DBNAME);

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
          resolve(null);
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

    request.onerror = function (e) {
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


  read(index): Promise<any> {
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
