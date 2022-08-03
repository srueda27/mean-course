import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: { title: string, content: string }[] = [
    /* {title: 'First Posts', content: "This is the first post's content"},
    {title: 'Second Posts', content: "This is the second post's content"},
    {title: 'Third Posts', content: "This is the third post's content"}, */
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
