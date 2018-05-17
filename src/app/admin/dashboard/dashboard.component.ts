import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadService } from '../upload.service';
import { Club } from '../../models/club';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private fb: FormBuilder, private uploadService: UploadService) {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      club: ['', Validators.required],
      country: ['', Validators.required],
      upload: null
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const club: Club = {
      imageName: this.form.get('upload').value['name'],
      name: this.form.get('club').value,
      country: this.form.get('country').value
    };

    this.uploadService.addClub(club).subscribe(res => {
      this.clearFile();
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let formData = new FormData();
      let file = event.target.files[0];
      formData.append('upload', file);
      this.form.get('upload').setValue(file);
      this.loading = true;

      this.uploadService.uploadClubImage(formData).subscribe(res => {
        this.loading = false;
      });
    }
  }

  clearFile() {
    this.form.get('upload').setValue(null);
    this.form.get('club').setValue('');
    this.form.get('country').setValue('');
    this.fileInput.nativeElement.value = '';
  }

}
