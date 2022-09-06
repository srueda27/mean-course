import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import IPost from '../models/post.model';
import { SocketService } from './socket.service';

const BACKEND_URL = `${environment.apiUrl}/posts`

@Injectable()
export class PostsService {
  private posts: IPost[] = []
  private postsUpdated = new Subject<{ posts: IPost[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router, private socketService: SocketService) {
    this.observePostSocket();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    // It is sending a copy of the array, and since it is not sending the same object it is not being updated
    // return this.posts;
    // This is being made in other to avoid unwanted manipulation of the object

    // no need to unsubscribe from the httpClient it is done by Angular
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
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
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`${BACKEND_URL}/${id}`)
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData()

    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<{ message: string, post: IPost }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.socketService.emitCreatePost(responseData.post)
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

    this.http.put(`${BACKEND_URL}/${id}`, postData)
      .subscribe(response => {
        this.router.navigate(['/'])
      })
  }

  deletePost(id: string) {
    return this.http.delete(`${BACKEND_URL}/${id}`)
  }

  private observePostSocket() {
    this.socketService.receiveCreatePost().subscribe((post: IPost) => {
      console.log('Create post socket received')
      this.refreshPosts(post)
    })
  }

  private refreshPosts(post: IPost) {
    if (!post.canEdit) {
      this.getPosts(10, 1)
    }
  }
}
