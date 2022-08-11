import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import IPost from '../post.model';

@Injectable()
export class PostsService {
  private posts: IPost[] = []
  // constructor() { }
  private postsUpdated = new Subject<IPost[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // It is sending a copy of the array, and since it is not sending the same object it is not being updated
    // return this.posts;
    // This is being made in other to avoid unwanted manipulation of the object

    // no need to unsubscribe from the httpClient it is done by Angular
    this.http.get<{ message: string, posts: IPost[] }>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: IPost = { title, content }

    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData)
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      })
  }
}
