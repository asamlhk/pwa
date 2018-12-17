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
import {MatToolbarModule} from '@angular/material/toolbar';
import { CRYPT_CONFIG_PROVIDER, CryptConfigProvider, EncryptionServiceModule } from 'angular-encryption-service';
import {MatGridListModule} from '@angular/material/grid-list';
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
  ],
  providers: [{ provide: CRYPT_CONFIG_PROVIDER, useValue: AppCryptConfigProvider}],
  bootstrap: [AppComponent]
})
export class AppModule { }
