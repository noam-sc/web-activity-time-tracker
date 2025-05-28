# Web Activity Time Tracker

[![GitHub license](https://img.shields.io/github/license/noam-sc/web-activity-time-tracker)](https://github.com/noam-sc/web-activity-time-tracker/blob/main/LICENSE)

Web Activity Time Tracker keeps track of how much time you spend on the web and presents the stats in a useful and intuitive way.
You can set a daily visit limit for sites and block it after the expiration of the limit.

Extension uses only local [chrome.storage API](https://developer.chrome.com/apps/storage) chrome.storage API to store data and it doesn't send data anywhere.

![image](https://user-images.githubusercontent.com/23387046/206865140-875bf7ab-a59e-42e3-bb9e-e348e8b85749.png) ![image](https://user-images.githubusercontent.com/23387046/206865174-aa409efe-495d-450e-a8ea-1d97024c9e23.png)

You can see your daily stats.

![image](https://github.com/Stigmatoz/web-activity-time-tracker/assets/23387046/d67c812c-2ba4-4ef8-a685-ab5fd77c7fbe)

And you can see your overall stats.

![image](https://github.com/Stigmatoz/web-activity-time-tracker/assets/23387046/6ea4547e-8bc6-4df7-ba0c-b5b330117270)

If you have suggestions or problems using the extension, please [submit a bug or a feature request](https://github.com/noam-sc/web-activity-time-tracker/issues).

# Chrome Web Store

Web Activity Time Tracker is not yet available via the official Chrome Web Store.

# Install from ZIP file

1. Download the latest available version from the [releases page](https://github.com/noam-sc/web-activity-time-tracker/releases).
2. Extract the ZIP file to your preferred location (whichever suits you).
3. Open the Chrome browser and navigate to `chrome://extensions/`.
4. Enable "Developer mode" in the upper right corner.
5. Click on the "Load unpacked" button and select the extracted folder.
6. The extension should now be installed and active in your browser. **Be sure to keep the extracted folder intact, as the extension will not work if the files are moved or deleted.**

# Install as an extension from source

1. Download the latest available version and unarchive to your preferred location (whichever suits you).
2. Using Google Chrome browser, navigate to chrome://extensions/ and enable "Developer mode" in the upper right corner.
3. Click on the "Load unpacked extension..." button.
4. Browse to the src directory of the unarchived folder and confirm.

# Run

To run the extension in development mode, you can clone the repository and run it locally.

```bash
npm install
npm run dev
```

# License

This work is licensed under an MIT License.
