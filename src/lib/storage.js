/**
 * Storage layer — @capacitor/preferences wrapper
 * Replaces chrome.storage.local for iOS/Android compatibility.
 *
 * Account schema:
 * {
 *   id: string,
 *   issuer: string,
 *   label: string,
 *   secret: string,          // TOTP secret key (Base32)
 *   vpnPassword: string,     // VPN password
 *   algorithm: 'SHA-1'|'SHA-256'|'SHA-512',
 *   digits: 6|8,
 *   period: 30|60,
 *   createdAt: number,
 * }
 */
import { Preferences } from '@capacitor/preferences';
import { generateId } from './utils.js';

const ACCOUNTS_KEY = 'accounts';

/**
 * Load all accounts from storage
 * @returns {Promise<Array>}
 */
export async function getAccounts() {
  try {
    const { value } = await Preferences.get({ key: ACCOUNTS_KEY });
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('[Authenticator] getAccounts failed:', e);
    return [];
  }
}

/**
 * Save a new account
 * @param {{ issuer, label, secret, vpnPassword, algorithm, digits, period }} account
 */
export async function saveAccount(account) {
  const list = await getAccounts();

  const record = {
    id: generateId(),
    issuer: account.issuer || '',
    label: account.label || '',
    secret: (account.secret || '').toUpperCase().replace(/\s/g, ''),
    vpnPassword: account.vpnPassword || '',
    algorithm: account.algorithm || 'SHA-1',
    digits: account.digits || 6,
    period: account.period || 30,
    createdAt: Date.now(),
  };

  list.push(record);
  await Preferences.set({ key: ACCOUNTS_KEY, value: JSON.stringify(list) });
  return record;
}

/**
 * Update an existing account by id
 */
export async function updateAccount(id, updates) {
  const list = await getAccounts();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error('Account not found');

  const updated = {
    ...list[idx],
    ...updates,
  };

  // Normalize secret key format
  if (updates.secret) {
    updated.secret = updates.secret.toUpperCase().replace(/\s/g, '');
  }

  list[idx] = updated;
  await Preferences.set({ key: ACCOUNTS_KEY, value: JSON.stringify(list) });
  return updated;
}

/**
 * Delete an account by id
 */
export async function deleteAccount(id) {
  const list = (await getAccounts()).filter((a) => a.id !== id);
  await Preferences.set({ key: ACCOUNTS_KEY, value: JSON.stringify(list) });
}

/**
 * Clear all stored data
 */
export async function clearAllData() {
  await Preferences.clear();
}
