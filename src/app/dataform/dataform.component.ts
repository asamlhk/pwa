import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { DataEncryptionService } from '../data-encryption.service';

export class user {
  name: string = "name";
  age: number = 10;
 
  gender: string = 'M';
 

}
 
@Component({
  selector: 'app-dataform',
  templateUrl: './dataform.component.html',
  styleUrls: ['./dataform.component.css']
})
export class DataformComponent implements OnInit {
  db;
  results: user[];
  version = 1;
 

  del(id) {
    var request = this.db.transaction(['posdb'], 'readwrite')
      .objectStore('posdb')
      .delete(id);
    this.readAll();
    request.onsuccess = function (event) {
      
    }
  }

  dataCols = (cols) => cols.filter(x => x != 'name')
 
  encryptJSON = (o) => this.des.encryptJSON(o);
  decryptJSON = (o) => this.des.decryptJSON(o);
  displayedColumns: string[] = Object.keys(new user())
  data = {
  }



  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  ngOnInit() {

    this.opendb();
    window.ononline = (e) => {
      this.snackBar.open('online', 'OK', {
        duration: 2000,
      })
      console.log(e, 'online')
    }

    window.onoffline = (e) => {
      this.snackBar.open('offline', 'OK', {
        duration: 2000,
      })
      console.log(e, 'offline')
    }


  }

  constructor(
    public snackBar: MatSnackBar,

    public des: DataEncryptionService,
  ) {


  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }
  readAll() {
    let req = this.db.transaction(['posdb'])
      .objectStore('posdb')
      .getAll();

    req.onsuccess =
      (event) => {
        this.results = (req.result)

        this.dataSource = new MatTableDataSource<any>(this.results);
        this.dataSource.paginator = this.paginator;
      }

  }

  read(index) {

    var request = this.db
      .transaction(['posdb'])
      .objectStore('posdb')
      .get(index);

    request.onsuccess =
      (event) => {
        if (request.result) {
          console.log(request.result)
        }
      }


  }

  opendb(version?) {
    let request = window.indexedDB.open('posdb', version);

    request.onsuccess = (event) => {
      this.db = request.result;
      console.log('db opened', this.db);
      this.readAll();
    }

    request.onupgradeneeded = (event) => {
      //initialize
      this.db = event.target;
      this.db = this.db.result;
      var objectStore = this.db.createObjectStore('posdb', { keyPath: 'id' });
    }
  }

  loaddb() {

  }

  save() {
    if (!this.isNew()) {

      this.updatedb(this.data);
    }
    else {
      this.add2db(this.results.length + 20, this.data);
    }

    this.readAll();
  }

  isNew() {
    return !this.data['id']
  }
  edit(item) {
    console.log(item)
    this.data = item;
  }

  updatedb(obj) {
    var request = this.db.transaction(['posdb'], 'readwrite')
      .objectStore('posdb')
      .put(obj);

    request.onsuccess = function (event) {

    }
  }

  add2db(id, obj) {
    var request = this.db.transaction(['posdb'], 'readwrite')
      .objectStore('posdb')
      .add({
        id: id,
        ...obj
      });

    request.onsuccess = function (event) {

    };
  }

}
