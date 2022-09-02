import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import IPost from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { mimeType } from '../validators/mime-type.validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: IPost | undefined;
  isLoading = false;
  private mode = 'create';
  private postId: string | undefined;

  form: FormGroup;
  imagePreview: string | undefined;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      image: new FormControl(null, {
        validators: [
          Validators.required
        ],
        asyncValidators: [
          mimeType
        ]
      })
    })
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
              this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath }
              this.imagePreview = postData.imagePath

              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              })
            });
        } else {
          this.mode = 'create';
        }
      });
  }

  onSavePost() {
    if (this.form.invalid) {
      return
    }

    this.isLoading = true;
    if (this.mode == 'create') {
      this.postsService.addPosts(this.form.value.title, this.form.value.content, this.form.value.image)
    } else {
      this.postsService.updatePost(this.postId!, this.form.value.title, this.form.value.content, this.form.value.image)
    }

    this.form.reset()
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0)

    this.form.patchValue({
      image: file
    })

    this.form.get('image')?.updateValueAndValidity()

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }

    reader.readAsDataURL(file!)
  }
}
