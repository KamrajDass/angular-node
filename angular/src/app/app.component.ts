import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-17  ';
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isTokenExpired()
    console.log("isLoggedIn", this.authService.userDetails.isLoggedIn())
    console.log("username", this.authService.userDetails.username())

  }

}
