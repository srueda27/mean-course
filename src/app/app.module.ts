import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PostsService } from './services/posts.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/interceptors/auth-interceptor';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './services/interceptors/error-interceptor';
import { AngularmaterialModule } from './angularmaterial/angularmaterial.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularmaterialModule,
    PostsModule
  ],
  providers: [
    PostsService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
