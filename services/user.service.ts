import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storageKeys';

export class UserService {
  static async getUserId(): Promise<string> {
    let userId = await StorageService.getItem<string>(StorageKeys.USER_ID);
    
    if (!userId) {
      // Generate a simple user ID
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await StorageService.setItem(StorageKeys.USER_ID, userId);
    }
    
    return userId;
  }
}

