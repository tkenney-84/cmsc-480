import { Injectable } from '@angular/core';
import SweetAlert2  from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  fireToast(icon: any, title: any) {
    SweetAlert2.fire({
      icon: icon,
      title: title,
      timer: 3400,
      timerProgressBar: true,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
    });
  }

}
