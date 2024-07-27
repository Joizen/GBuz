import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SearchdriverPageComponent } from './page/Driver/searchdriver-page/searchdriver-page.component';
import { DriverPageComponent } from './page/Driver/driver-page/driver-page.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    AppComponent,
    SearchdriverPageComponent,
    DriverPageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    GoogleMapsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule, 
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
