import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './services/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: async () => (await import('./auth/auth.module')).AuthModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
