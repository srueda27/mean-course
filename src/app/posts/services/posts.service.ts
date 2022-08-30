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
          return postData.posts.map((post: IPost) => {
            return {
              title: post.title,
              content: post.content,
              id: post.id,
              imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`)
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData()

    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<{ message: string, post: IPost }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: IPost = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath
        }

        this.posts.push(post);
        this.postsUpdated.next([...this.posts])

        this.router.navigate(['/'])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | IPost

    if (typeof (image) == 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title)
    } else {
      postData = { id, title, content, imagePath: image }
    }

    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(updatedPost => updatedPost.id === id)

        const post: IPost = { id, title, content }
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
