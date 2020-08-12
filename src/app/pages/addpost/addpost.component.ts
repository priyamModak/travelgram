import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/utils/imageConfig';
import { v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  locationName: string;
  description: string;
  picture = null;
  user = null;
  uploadPercent = null;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private toastr: ToastrService, private storage: AngularFireStorage, private database: AngularFireDatabase, private auth: AuthService) {
    this.auth.getUser().subscribe((user) => {
      this.database.object(`/users/${user.uid}`).valueChanges().subscribe((userData) => {
        this.user = userData;
      });
    });
  }

  // tslint:disable-next-line:typedef
  onSubmit(){
    const uid = uuidv4();

    this.database.object(`/posts/${uid}`).set({
      id: uid,
      locationName: this.locationName,
      description: this.description,
      picture: this.picture,
      by: this.user.name,
      instaId: this.user.instaUserName,
      date: Date.now()
    }).then(() => {
      this.toastr.success('Post added successfully');
      this.router.navigateByUrl('');
    })
    .catch((err) => {
      this.toastr.error(err.message);
    });
  }

  // tslint:disable-next-line:typedef
  async uploadFile(event){

    const file = event.target.files[0];

    const resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });
    task.snapshotChanges()
    .pipe(finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success('Image uploaded successfully');
        });
      })
    )
    .subscribe();
  }

  ngOnInit(): void {
  }

}
