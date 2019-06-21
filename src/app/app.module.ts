import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParticlesModule } from 'angular-particle';

import { AppComponent } from './app.component';
import { TextconverterComponent } from './textconverter/textconverter.component';

@NgModule({
  declarations: [
    AppComponent,
    TextconverterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ParticlesModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

