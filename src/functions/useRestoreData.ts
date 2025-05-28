import Browser from 'webextension-polyfill';
import { Messages } from '../utils/messages';
import { isValidBackupData, sanitizeBackupData } from '../utils/security';

export async function useRestoreData(json: string) {
  if (!json || typeof json !== 'string') {
    throw new Error('Invalid backup data: empty or invalid input');
  }

  try {
    // SECURITY FIX: Validate JSON structure before parsing to prevent code injection
    const data = JSON.parse(json);

    // Validate the data structure
    if (!isValidBackupData(data)) {
      throw new Error('Invalid backup data structure');
    }

    // Sanitize the data to ensure safety
    const sanitizedData = sanitizeBackupData(data);

    await Browser.runtime.sendMessage({
      message: Messages.Restore,
      data: sanitizedData,
    });
  } catch (error) {
    console.error('Invalid backup file:', error);
    throw new Error('Invalid or corrupted backup file');
  }
}
