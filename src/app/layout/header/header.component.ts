import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.authService.getUser().subscribe((user) => {
      this.email = user?.email;
    });
  }

  // tslint:disable-next-line:typedef
  async handleSignout(){

    try {
      await this.authService.signOut();
      this.router.navigateByUrl('/signin');
      this.toastr.info('Logged out successfully');
      this.email = null;
    } catch (error) {
      this.toastr.error('Problem in signout');
    }
  }

  ngOnInit(): void {
  }

}
