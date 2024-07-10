import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ModalService } from 'src/app/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {
  
  data: any[] = [];
  public subscription!: Subscription;

  categoryForm: FormGroup;
  itemForm: FormGroup;
  categories: any[] = [];
  
  constructor(private authService: AuthService, public photoService: PhotoService, private router: Router, private route: ActivatedRoute, public modalService: ModalService, private fb: FormBuilder, private http: HttpClient) {
    this.categoryForm = this.fb.group({
      type: ['', Validators.required]
    });

    this.itemForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      sku: ['', Validators.required],
      image: ['']
    });
  }
  
  async ngOnInit() {
    this.loadCategories();
    this.photoService.data$.subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }
  
  logout() {
    this.authService.logout();
  }
  
  uploadImages() {
    this.router.navigate(['/dashboard/insurance-card'], { relativeTo: this.route });
  }

  iframeLink() {
    this.modalService.openIframeModal();
  }

  loadCategories() {
    this.http.get('http://localhost:3000/getAllCategories').subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.http.post('http://localhost:3000/createCategory', this.categoryForm.value).subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
      });
    }
  }

  createItem(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value || '');
    formData.append('category', this.itemForm.get('category')?.value || '');
    formData.append('description', this.itemForm.get('description')?.value || '');
    formData.append('price', this.itemForm.get('price')?.value || '');
    formData.append('sku', this.itemForm.get('sku')?.value || '');

    const imageFile = this.itemForm.get('image')?.value;
    if (imageFile instanceof File) {
      formData.append('image', imageFile);
    }

    this.http.post('http://localhost:3000/items', formData).subscribe(response => {
      console.log('Item created successfully', response);
      this.itemForm.reset();
    }, error => {
      console.error('Error creating item', error);
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Safe handling of form control
      const imageControl = this.itemForm.get('image');
      if (imageControl) {
        imageControl.setValue(file);
      }
    }
  }
  
}
