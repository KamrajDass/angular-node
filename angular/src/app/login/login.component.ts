import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private authService = inject(AuthService);

  constructor() {

  }

  form!: FormGroup

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ])
      }
    );
  }

  onSubmit() {
    console.log("res", this.form.value)
    this.authService.login(this.form.value.username, this.form.value.password).subscribe(res => {
      console.log("res", res)
    })
  }
}
