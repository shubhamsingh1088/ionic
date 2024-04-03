import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  isFrontPhoto = false;
  isBackPhoto = false;
  constructor() { }
}
