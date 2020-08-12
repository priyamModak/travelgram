import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users = [];
  posts = [];
  isLoading = false;

  constructor(private db: AngularFireDatabase, private toastr: ToastrService) {
    this.isLoading = true;

    // Get all user
    this.db.object(`/users`).valueChanges().subscribe((object) => {
      if (object){
        this.users = Object.values(object);
        this.isLoading = false;
      } else {
        this.users = [];
        this.isLoading = false;
        this.toastr.error('No user found');
      }
    });

    // Get all posts
    this.db.object(`/posts`).valueChanges().subscribe((postObject) => {
      if (postObject){
        this.posts = Object.values(postObject).sort((a, b) => b.date - a.date);
        this.isLoading = false;
      } else {
        this.toastr.error('No post found');
        this.isLoading = false;
        this.posts = [];
      }
    });
  }

  ngOnInit(): void {
  }

}
