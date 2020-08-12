import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from './../../services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  @Input() post;

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;
  upvote = 0;
  downvote = 0;

  constructor(private auth: AuthService, private database: AngularFireDatabase) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
    });
  }

  // tslint:disable-next-line:typedef
  handleUpvote() {
    this.database.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote: 1
    });
  }

  // tslint:disable-next-line:typedef
  handleDownvote() {
    this.database.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote: 1
    });
  }

  // tslint:disable-next-line:typedef
  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`;
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.post.vote){
      Object.values(this.post.vote).map((val: any) => {
        if (val.upvote){
          this.upvote += 1;
        }
        if (val.downvote){
          this.downvote += 1;
        }
      });
    }
  }
}
