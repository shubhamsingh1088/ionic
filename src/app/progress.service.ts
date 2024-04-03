import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressSubject: Subject<number> = new Subject<number>();

  // Observable stream for progress updates
  progress$ = this.progressSubject.asObservable();

  constructor() { }

  // Method to update progress
  updateProgress(progress: number) {
    this.progressSubject.next(progress);
  }

  // Method to reset progress
  resetProgress() {
    this.progressSubject.next(0);
  }

}
