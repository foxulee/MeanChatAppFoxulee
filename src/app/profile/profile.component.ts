import { Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../admin/upload.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  form: FormGroup;
  details: any;
  uploaded: boolean = false;
  allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
  isWrongType = false;

  constructor(public auth: AuthenticationService, private fb: FormBuilder, private uploadService: UploadService) {
    this.createForm();
  }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      // console.log(this.details)
    }, (err) => {
      console.error(err);
    });
  }

  private createForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      mantra: ['', Validators.required],
      upload: null,
      club: [''],
    });
  }

  onFileChange(event) {
    this.isWrongType = false;

    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let arr = (file.name as string).split('.');
      let extensionName = arr[arr.length - 1].toLowerCase();

      // check the extension name 
      if (this.allowedFileTypes.indexOf(extensionName) < 0) {
        this.isWrongType = true;
        return false;
      }
      else { // extension name is valid
        let formData = new FormData();
        formData.append('upload', file);
        this.form.get('upload').setValue(file);

        this.uploadService.uploadUserImage(formData).subscribe(res => {
          this.uploaded = true;
          this.details.userImage = this.form.get('upload').value['name'];
        });
      }
    }
    else return false;
  }

  onSubmit() {
    if (this.form.valid) {
      const userProfile: any = {
        _id: this.auth.getUserDetails()._id,
        name: this.form.get('username').value,
        fullName: this.form.get('fullName').value,
        country: this.form.get('country').value,
        gender: this.form.get('gender').value,
        mantra: this.form.get('mantra').value,
      };
      if (this.form.get('upload').value) {
        // console.log(this.form.get('upload').value);
        userProfile.imageName = this.form.get('upload').value['name'];
      }

      this.auth.saveProfile(userProfile).subscribe(res => {
        this.ngOnInit();
      });
    }
  }
}
