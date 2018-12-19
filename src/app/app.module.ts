import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { DataformComponent } from './dataform/dataform.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CRYPT_CONFIG_PROVIDER, CryptConfigProvider, EncryptionServiceModule } from 'angular-encryption-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFirestore } from 'angularfire2/firestore'

 

const AppCryptConfigProvider: CryptConfigProvider = {
  getSalt(): Promise<string> {
    return Promise.resolve('saltsalt');
  }
};

@NgModule({
  declarations: [
    AppComponent,
    DataformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatGridListModule,
    FlexLayoutModule,
    EncryptionServiceModule.forRoot(),
    AngularFireModule.initializeApp(
       {
        apiKey: "AIzaSyBv3iWi5wB48xAuyjVATWK3fL02DyuTC4M",
        authDomain: "pwademo-f2b31.firebaseapp.com",
        databaseURL: "https://pwademo-f2b31.firebaseio.com",
        projectId: "pwademo-f2b31",
        storageBucket: "pwademo-f2b31.appspot.com",
        messagingSenderId: "729507054695"
      } 
    ),
  //  AngularFireModule.initializeApp(environment.firebase)
 
  ],
  providers: [AngularFirestore, { provide: CRYPT_CONFIG_PROVIDER, useValue: AppCryptConfigProvider, }],
  bootstrap: [AppComponent]
})
export class AppModule { }
