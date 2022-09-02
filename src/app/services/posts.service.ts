import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import IPost from '../models/post.model';

@Injectable()
export class PostsService {
  private posts: IPost[] = []
  // constructor() { }
  private postsUpdated = new Subject<{ posts: IPost[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    // It is sending a copy of the array, and since it is not sending the same object it is not being updated
    // return this.posts;
    // This is being made in other to avoid unwanted manipulation of the object

    // no need to unsubscribe from the httpClient it is done by Angular
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                canEdit: post.canEdit
              }
            }),
            maxPosts: postData.maxPosts
          }
        })
      )
      .subscribe((pipedPostsData: { posts: IPost[], maxPosts: number }) => {
        this.posts = pipedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: pipedPostsData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`http://localhost:3000/api/posts/${id}`)
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData()

    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<{ message: string, post: IPost }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
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
        this.router.navigate(['/'])
      })
  }

  deletePost(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`)
  }
}
