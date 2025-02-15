import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';

import { Platform } from '@ionic/angular';
import Swal from 'sweetalert2';

export interface INotificacion {
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  constructor(private _platform: Platform) {}

  ngOnInit() {}

  async lNotifi(data: INotificacion) {
    const options: ScheduleOptions = {
      notifications: [
        {
          id: 11,
          title: data.title,
          body: data.body,
          largeBody: 'sdajsdoijasodj',
          summaryText: 'sdasdasdasd',
        },
      ],
    };

    try {
      await LocalNotifications.schedule(options);
    } catch (ex) {}
  }
}
