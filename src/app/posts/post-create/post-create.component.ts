import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import IPost from '../post.model';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT'
  oneWayBinging = ''
  twoWayBinding = ''
  enteredTitle = ''

  // @Output()
  postCreated = new EventEmitter<IPost>();

  constructor(public postsService: PostsService) {
    // console.log(this.oneWayBinging)
  }

  ngOnInit(): void {
  }

  onAddPost(form: NgForm, postInput?: HTMLTextAreaElement) {
    /* console.log('event binding: ', postInput.value)
    console.log('1 way binding', this.oneWayBinging)
    this.newPost = this.twoWayBinding */

    if (form.invalid) {
      return
    }

    // const post: IPost = { title: form.value.title, content: form.value.content }
    // this.postCreated.emit(post)
    this.postsService.addPosts(form.value.title, form.value.content)
    form.resetForm()
  }
}
