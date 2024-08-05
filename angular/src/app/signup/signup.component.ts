import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { usernameValidator } from '../services/auth/username-validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private fb: FormBuilder, private authService: AuthService) {

  }

  form!: FormGroup

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {

    this.form = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(15)],
        [usernameValidator(this.authService)],
      ],
      firstname: [
        '',
        [Validators.required, Validators.maxLength(15)],
      ],
      lastname: [
        '',
        [Validators.required, Validators.maxLength(15)],
      ],
      email: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(15)],
      ],
      password: [
        '',
        [Validators.required, , Validators.minLength(8), Validators.maxLength(20)],
      ],
    });


  }

  onSubmit() {
    console.log("res", this.form.value)
    this.authService.signup(this.form.value).subscribe(res => {
      console.log("res", res)
    })
  }

}