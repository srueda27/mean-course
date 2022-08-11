import { Component } from '@angular/core';
import IPost from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mean-course';
  /* storedPosts: IPost[] = []

  onPostAdded(post: IPost) {
    this.storedPosts.push(post)
  } */
}
