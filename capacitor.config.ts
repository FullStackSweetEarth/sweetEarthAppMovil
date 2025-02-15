//  <reference types="@capacitor/local-notifications" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    // CapacitorHttp: {
    //   // cl: true,
    //   enabled: true
    // }
  },
  // server: {
  //   cleartext: true,
  //   allowNavigation: ["*"],
  //   androidScheme: "https"
  // }
};

export default config;