import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { IUser } from 'src/app/entities/user';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  frmSignIn: FormGroup;
  frmSignUp: FormGroup;
  constructor(private router: Router) {
    
    this.frmSignIn = new FormGroup({ 
      username: new FormControl('', [Validators.required, Validators.minLength(6)] ),
      password: new FormControl('',  Validators.required)
    });
    this.frmSignIn.get('username')?.valueChanges.subscribe(() => {
      const usernameControl = this.frmSignIn.get('username');
      if (usernameControl?.errors && (usernameControl?.touched || usernameControl?.dirty)) {
        if (usernameControl.errors['required']) {
          this.signInAlert = 'Username is required';
        } else if (usernameControl.errors['minlength']) {
          this.signInAlert = 'Username should be at least ' + usernameControl.errors['minlength'].requiredLength + ' characters';
        }
      } else {
        this.signInAlert = '';
      }
    });
    this.frmSignIn.get('password')?.valueChanges.subscribe(() => {
      const passwordControl = this.frmSignIn.get('password');
      if (passwordControl?.errors && (passwordControl?.touched || passwordControl?.dirty)) {
        if (passwordControl.errors['required']) {
          this.signInAlert = 'Password is required';
        }
      } else {
        this.signInAlert = '';
      }
    });

    this.frmSignUp = new FormGroup({ 
      fullname: new FormControl('', Validators.required),
      username: new FormControl('', [Validators.required, Validators.minLength(6)] ),
      password: new FormControl('',  Validators.required)
    });
    this.frmSignUp.get('fullname')?.valueChanges.subscribe(() => {
      const fullnameControl = this.frmSignUp.get('fullname');
      if (fullnameControl?.errors && (fullnameControl?.touched || fullnameControl?.dirty)) {
        if (fullnameControl.errors['required']) {
          this.signUpAlert = 'Fullname is required';
        }
      } else {
        this.signUpAlert = '';
      }
    });
    this.frmSignUp.get('username')?.valueChanges.subscribe(() => {
      const usernameControl = this.frmSignUp.get('username');
      if (usernameControl?.errors && (usernameControl?.touched || usernameControl?.dirty)) {
        if (usernameControl.errors['required']) {
          this.signUpAlert = 'Username is required';
        } else if (usernameControl.errors['minlength']) {
          this.signUpAlert = 'Username should be at least ' + usernameControl.errors['minlength'].requiredLength + ' characters';
        }
      } else {
        this.signUpAlert = '';
      }
    });
    this.frmSignUp.get('password')?.valueChanges.subscribe(() => {
      const passwordControl = this.frmSignUp.get('password');
      if (passwordControl?.errors && (passwordControl?.touched || passwordControl?.dirty)) {
        if (passwordControl.errors['required']) {
          this.signUpAlert = 'Password is required';
        }
      } else {
        this.signUpAlert = '';
      }
    });
  }
  formSignIn = {
    userName: '',
    password: '',
  };
  formSignUp = {
    userName: '',
    fullName: '',
    password: ''
  }
  signInAlert = ''
  signUpAlert = ''
  ngOnInit(): void {

  }

  signIn() {
      if(this.frmSignIn.valid){
        axios
        .post('http://localhost:3000/api/user/signin',this.formSignIn)
        .then(response=>{
          const data = response.data
          if(data) this.signInAlert = data.notification
          return data
        })
        .then(data => {
          if(data.succes) {
            sessionStorage.setItem('login',
              JSON.stringify({
                "fullName": data.user.fullName, 
                "idUser": data.user._id
              })
            )
            window.location.href = '/workspaces'
          }        
        })
        .then(() => {
          // const navigationExtras: NavigationExtras = {
          //   skipLocationChange: true
          // };
          if(sessionStorage.getItem('login')) this.router.navigate(['/workspaces'])
        })
        .catch(error => {
          console.log(error)
        })
      }else{
        this.signInAlert = 'Finish form before submit'
      }
  }
  signUp() {
    if(this.frmSignUp.valid) {
      axios
      .post('http://localhost:3000/api/user/add',this.formSignUp)
      .then(response => {
        return response.data             
      })
      .then(data => {
        if(data.succes) {

          sessionStorage.setItem('login',
            JSON.stringify({
              "fullName": data.user.fullName, 
              "idUser": data.user._id
            })
          )
          window.location.href = '/workspaces'
        }
      })
    }else{
      this.signUpAlert = 'Finish form before submit'
    }
  }
  
}
