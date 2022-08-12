import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import IPost from '../post.model';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = ''
  enteredContent = ''
  post: IPost | undefined;
  isLoading = false;
  private mode = 'create';
  private postId: string | undefined;

  // @Output()
  postCreated = new EventEmitter<IPost>();

  constructor(public postsService: PostsService, public route: ActivatedRoute) {
    // console.log(this.oneWayBinging)
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit'
          this.postId = paramMap.get('postId')!;
          this.isLoading = true

          this.postsService.getPost(this.postId)
            .subscribe(postData => {
              this.isLoading = false
              this.post = { id: postData._id, title: postData.title, content: postData.content }
            });
        } else {
          this.mode = 'create';
        }
      });
  }

  onSavePost(form: NgForm, postInput?: HTMLTextAreaElement) {
    if (form.invalid) {
      return
    }

    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPosts(form.value.title, form.value.content)
    } else {
      this.postsService.updatePost(this.postId!, form.value.title, form.value.content)
    }

    form.resetForm()
  }
}
