import { createNotifier } from '../notifications.js';

export function createToastService(region) {
  return createNotifier(region);
}
