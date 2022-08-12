import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import IPost from '../post.model';

@Injectable()
export class PostsService {
  private posts: IPost[] = []
  // constructor() { }
  private postsUpdated = new Subject<IPost[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    // It is sending a copy of the array, and since it is not sending the same object it is not being updated
    // return this.posts;
    // This is being made in other to avoid unwanted manipulation of the object

    // no need to unsubscribe from the httpClient it is done by Angular
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            }
          })
        })
      )
      .subscribe((pipedPosts: IPost[]) => {
        this.posts = pipedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<any>(`http://localhost:3000/api/posts/${id}`)
  }

  addPosts(title: string, content: string) {
    const post: IPost = { id: "asd23", title, content }

    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId
        post.id = id

        this.posts.push(post);
        this.postsUpdated.next([...this.posts])

        this.router.navigate(['/'])
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: IPost = { id, title, content }

    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(updatedPost => updatedPost.id === post.id)
        updatedPosts[oldPostIndex] = post;

        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])

        this.router.navigate(['/'])
      })
  }

  deletePost(id: string) {
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id != id);

        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }
}
