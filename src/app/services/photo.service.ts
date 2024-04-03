import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { ToasterService } from '../toaster.service';
import { ProgressService } from '../progress.service';
import { ModalService } from '../modal.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  private dataSubject = new BehaviorSubject<any[]>([]);
  public data$ = this.dataSubject.asObservable();
  
  constructor(platform: Platform, private toasterService: ToasterService, private progressService: ProgressService, private modalService: ModalService, private http: HttpClient) {
    this.platform = platform;
  }
  
  public async addNewToGallery(type: string) {
    // Check for camera permissions before capturing a photo
    await this.requestPermissions();
    
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const file = await this.convertPhotoToFile(capturedPhoto);
    console.log(file);
    
    // Check if the format is Correct
    const allowedFormats = ['jpeg', 'jpg', 'png'];
    const format = capturedPhoto.format.toLowerCase();
    if (!allowedFormats.includes(format)) {
      this.toasterService.showError('Unsupported file format. Only JPEG and PDF files are allowed.');
      return;
    }
    
    // Read the file data to determine its size
    const response = await fetch(capturedPhoto.webPath!);
    if (!response.ok) {
      this.toasterService.showError('Failed to fetch file data.');
      return;
    }
    const blob = await response.blob();
    const fileSizeBytes = blob.size;
    
    // Check if the file size exceeds 5MB
    const fileSizeLimitMB = 5;
    const fileSizeLimitBytes = fileSizeLimitMB * 1024 * 1024; // Convert MB to bytes
    if (fileSizeBytes > fileSizeLimitBytes) {
      this.toasterService.showError('File size exceeds the limit of 5MB.');
      return;
    }
    let imagePath = capturedPhoto.webPath;
    
    // Pass the captured image to modal
    let result = await this.modalService.openDynamicModal(imagePath);
    let croppedImage = result.data.croppedImage;
    
    // Wait for savedImageFile to return file-path from savePicture function
    const savedImageFile = await this.savePicture(croppedImage);
    
    // Create an object and pass the value returned from savedImageFile to filepath key
    let newImageFile = {
      filepath: savedImageFile.filepath,
      webViewPath: croppedImage,
      type: type
    };
    
    // If the user confirms the image from the modal, add it in the photos array
    if (result.data && result.data.confirmed) {
      this.photos.unshift(newImageFile);
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });
    } else {
      console.log('User Canceled');
      return;
    }
    
    // Show Progress
    // this.progressService.updateProgress(100);
    // setTimeout(() => {
    //   this.progressService.resetProgress();
    //   this.loadSaved();
    // }, 1000);
  }

  async convertPhotoToFile(photo: Photo): Promise<File> {
    try {
      const res = await fetch(photo.webPath!);
      const blob = await res.blob();
      return new File([blob], 'filename.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('Error converting photo to file:', error);
      throw error; // Propagate the error
    }
  }

  async convertImageObjectToFile(imageObject: any): Promise<File> {
    try {
      // Retrieve the image data from local storage based on your imageObject structure
      const imageUrl = imageObject.webViewPath;
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Extract filename from filepath
      const filename = imageObject.filepath;

      // Create a File object
      const file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });

      console.log('Converted Image Object to File:', file);

      return file;
    } catch (error) {
      console.error('Error converting image object to file:', error);
      throw error; // Propagate the error
    }
  }
  
  private async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permissions = await Camera.requestPermissions();
      if (permissions.camera == 'denied' || permissions.photos == 'denied') {
        // Show an error message to the user
        this.showErrorDialog();
        throw new Error('Camera permissions denied');
      }
    }
  }
  
  private showErrorDialog() {
    this.toasterService.showError('Camera permissions denied. Please allow camera access to use this feature.');
  }
  
  private async savePicture(photo: any) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo
      };
    }
  } catch (error: any) {
    this.toasterService.showError(error);
    return null;
  }
  
  private async readAsBase64(photo: any) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      return file.data;
    } else {
      const response = await fetch(photo);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  
  public async loadSaved() {
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as any[];
    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }
  
  public async deletePicture(type: any, filePath: any) {
    this.photos = this.photos.filter(photo => photo.type !== type);
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    // delete photo file from filesystem
    const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  pushData(data: any) {
    const currentData = this.dataSubject.getValue();
    const index = currentData.findIndex(item => item.filepath === data.filepath);
    if (index === -1) {
      // Data is not a duplicate, push it to the array
      currentData.push({
        filepath: data.type === 'front' ? data.filepath : data.filepath,
        webviewPath: data.type === 'back' ? data.webviewPath : data.webviewPath,
        type: data.type,
      });
    } else {
      // Data is a duplicate, update filepath and webViewpath based on type
      currentData[index] = {
        ...currentData[index] || {},
        filepath: data.type === 'front' ? data.filepath : currentData[index].filepath,
        webviewPath: data.type === 'back' ? data.webviewPath : currentData[index].webviewPath,
      };
    }
    // Notify subscribers about the changes
    this.dataSubject.next([...currentData]);
  }
  
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  type: string
}
