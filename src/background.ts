import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './utils/logger';
import { scheduleJobs } from './jobs/sheduler';
import { Settings } from './functions/settings';
import { StorageParams } from './storage/storage-params';
import { injectStorage } from './storage/inject-storage';
import { todayLocalDate } from './utils/date';
import { checkPomodoro } from './functions/pomodoro';
import { Messages } from './utils/messages';
import { injectTabsRepositorySingleton } from './repository/inject-tabs-repository';
import { isValidMessage, sanitizeBackupData } from './utils/security';

logger.log('Start background script');
let pomodoroTimer: number;

self.onerror = err => {
  console.error('Unhandled error:', err);
};

Browser.storage.onChanged.addListener(async (changes, namespace) => {
  for (var key in changes) {
    if (Object.values(StorageParams).includes(key as StorageParams))
      await Settings.getInstance().reloadSetting(key as StorageParams);

    if (key == StorageParams.IS_POMODORO_ENABLED) {
      const value = changes[StorageParams.IS_POMODORO_ENABLED].newValue;
      pomodoro(value);
    }
  }
});

Browser.runtime.setUninstallURL('https://github.com/noam-sc/web-activity-time-tracker/');

Browser.runtime.onInstalled.addListener(async details => {
  if (details.reason == 'install') {
    logger.log('Extension installed:', details);
    const settingsStorage = injectStorage();
    await settingsStorage.saveValue(StorageParams.INSTALL_DATE, todayLocalDate());

    const initialPageUrl = Browser.runtime.getURL('src/welcome.html');
    await Browser.tabs.create({
      url: initialPageUrl,
      active: true,
    });
  }
  if (details.reason == 'update' && !details.previousVersion) {
    const showChangelog = (await Settings.getInstance().getSetting(
      StorageParams.SHOW_CHANGELOG,
    )) as boolean;
    if (showChangelog)
      await Browser.tabs.create({
        url: 'https://github.com/noam-sc/web-activity-time-tracker/releases',
        active: true,
      });
  }
});

Browser.runtime.onStartup.addListener(() => {
  logger.log(`onStartup event`);
});

Browser.windows.onFocusChanged.addListener(() => {
  logger.log('onFocusChanged');
});

async function pomodoro(value?: boolean) {
  if (value == undefined) {
    const settingsStorage = injectStorage();
    value = await settingsStorage.getValue(StorageParams.IS_POMODORO_ENABLED);
  }
  if (value == true) pomodoroTimer = setInterval(checkPomodoro, 1000);
  else clearInterval(pomodoroTimer);
}

pomodoro();
scheduleJobs();
initTracker();

Browser.runtime.onMessage.addListener(async message => {
  // SECURITY FIX: Validate message structure to prevent malicious messages
  if (!isValidMessage(message)) {
    console.warn('Invalid message received:', message);
    return;
  }

  if (message == Messages.ClearAllData) {
    const storage = injectStorage();
    const repo = await injectTabsRepositorySingleton();
    repo.removeAllTabs();
    await storage.saveTabs([]);
  }
  if (message.message == Messages.Restore) {
    const storage = injectStorage();
    // SECURITY FIX: Sanitize backup data before processing
    const sanitizedData = sanitizeBackupData(message.data);
    await storage.saveTabs(sanitizedData);
    const repo = await injectTabsRepositorySingleton();
    repo.initAsync();
  }
});
