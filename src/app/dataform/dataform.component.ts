import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';


import { LocaldbService } from '../localdb.service';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
 


export class user {
  company: string = '';
  firstname: string = '';
  lastname: string = '';

  city: string = '';
  state: string = '';

}

@Component({
  selector: 'app-dataform',
  templateUrl: './dataform.component.html',
  styleUrls: ['./dataform.component.css']
})
export class DataformComponent implements OnInit {

  mode;
  private countBySize = { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 };
  data: user = new user();
  results = [];
  cols = 2;
  dataCols = (cols) => cols.filter(x => x != 'name')
  displayedColumns: string[] = Object.keys(new user())
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  loadDB() {
    //let a = "X";


    this.localDB.opendb().then(
      r => {

        this.localDB.readAll().then(
          p => {
            this.results = p;
            this.bindTable(this.results);
          }
        )
      }
    )
  }
  ngOnInit() {

    this.media.asObservable()
      .subscribe((changes: MediaChange) =>
        this.cols = this.countBySize[changes.mqAlias]
      );

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
    this.loadDB();
 
  }

  bindTable(data) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public snackBar: MatSnackBar,
    public localDB: LocaldbService,
    private media: ObservableMedia,
  ) {

  }

  applyFilter(filterValue: string) {
    this
      .dataSource
      .filter = filterValue
        .trim()
        .toLowerCase();
  }
  newitem() {
    this.data = new user();
    this.mode='E';
  }
  save() {
    if (this.isNew()) {
      if (this.results) {
        this.data['id'] = this.results.map(
          x => x.id
        ).reduce(
          (num, max) => max > num ? max : num, 0
        ) + 1;
        console.log(this.data['id'])

        this.results.push(
          this.data
        )
      }

    }
    this.bindTable(this.results);
    this.mode=null;
  }
  isNew() {
    return !this.data['id']
  }
  edit(item) {

    this.data = item;
    this.mode='E'
  }
  delete(id) {
    this.results = this.results.filter(
      x => x.id != id
    )
    this.bindTable(this.results);

  }

  loadfromDB() {

  }

  savetoDB() {
    this.localDB.save2db(this.results);
  }



}
