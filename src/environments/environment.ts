// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "https://api.learningcurveai.co/api",
  lcClientSecret: "UiPw2Odniw1cQrIddlqwzxSTmeYjaFGG",

  settings: [
    {
      title: 'Please select your preferred conversations style',
      options: [
        { id: 'chatbotStyle', name: 'Formal', avatar: 'assets/formal-avatar.png', description: 'Academic, Professional, Sophisticated' },
        { id: 'chatbotStyle', name: 'Pro', avatar: 'assets/pro-avatar.png', description: 'Detailed, Knowledgeable, in-depth explanations' },
        { id: 'chatbotStyle', name: 'GenZ', avatar: 'assets/genz-avatar.png', description: 'Casual, Witty, Short, Slangy' },
        { id: 'chatbotStyle', name: 'Flash', avatar: 'assets/flash-avatar.png', description: 'Quick, Crisp, Concise, Short' },
      ]
    }
  ]

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
