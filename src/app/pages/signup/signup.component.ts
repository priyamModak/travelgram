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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  uploadPercent: number = null;
  // tslint:disable-next-line:no-inferrable-types
  picture: string = 'https://learnyst.s3.amazonaws.com/assets/schools/2410/resources/images/logo_lco_i3oab.png';

  constructor(private toastr: ToastrService,
              private router: Router,
              private auth: AuthService,
              private storage: AngularFireStorage,
              private database: AngularFireDatabase) { }

  // tslint:disable-next-line:typedef
  onSubmit(f: NgForm){
    const {email, password, username, bio, name, country} = f.form.value;

    this.auth.signUp(email, password)
    .then((res) => {
      const {uid} = res.user;
      this.database.object(`/users/${uid}`).set({
        id: uid,
        // tslint:disable-next-line:object-literal-shorthand
        name: name,
        // tslint:disable-next-line:object-literal-shorthand
        email: email,
        instaUserName: username,
        // tslint:disable-next-line:object-literal-shorthand
        country: country,
        // tslint:disable-next-line:object-literal-shorthand
        bio: bio
      });
    })
    .then(() => {
      this.router.navigateByUrl('/');
      this.toastr.success('Signed up successfully');
    })
    .catch((err) => {
      console.log(err);
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
