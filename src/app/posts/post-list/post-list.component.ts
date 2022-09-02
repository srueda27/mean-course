import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import IPost from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

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
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  private postsSub!: Subscription;

  constructor(public postsService: PostsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: IPost[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts
        this.totalPosts = postData.postCount
      })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      })
  }
}
