import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from '../angularmaterial/angularmaterial.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularmaterialModule,
    RouterModule
  ]
})
export class PostsModule { }
