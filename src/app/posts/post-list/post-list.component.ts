import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import IPost from '../post.model';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input()
  posts: IPost[] = [
    /* {title: 'First Posts', content: "This is the first post's content"},
    {title: 'Second Posts', content: "This is the second post's content"},
    {title: 'Third Posts', content: "This is the third post's content"}, */
  ]
  isLoading = false;
  private postsSub!: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.isLoading = true
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: IPost[]) => {
        this.isLoading = false;
        this.posts = posts
      })
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
  }

  onDelete(id: string) {
    this.postsService.deletePost(id)
  }
}
