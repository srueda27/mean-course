import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

  @Output()
  postCreated = new EventEmitter();

  constructor() {
    console.log(this.oneWayBinging)
  }

  ngOnInit(): void {
  }

  onAddPost(postInput: HTMLTextAreaElement) {
    console.log('event binding: ', postInput.value)
    console.log('1 way binding', this.oneWayBinging)
    this.newPost = this.twoWayBinding

    const post = { title: this.enteredTitle, content: this.twoWayBinding }
    this.postCreated.emit(post)
  }
}
