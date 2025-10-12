import { TokenResponse } from '../types';

export class TokenStorage {
  private readonly storageKey = 'lanonasis_mcp_tokens';
  private keytar: any;

  constructor() {
    // Lazy load keytar only in Node environment
    if (this.isNode()) {
      try {
        this.keytar = require('keytar');
      } catch (e) {
        console.warn('Keytar not available - falling back to file storage');
      }
    }
  }

  async store(tokens: TokenResponse): Promise<void> {
    const tokenString = JSON.stringify(tokens);

    if (this.isNode()) {
      // Terminal: Use system keychain if available
      if (this.keytar) {
        await this.keytar.setPassword('lanonasis-mcp', 'tokens', tokenString);
      } else {
        // Fallback to encrypted file
        await this.storeToFile(tokenString);
      }
    } else if (this.isElectron()) {
      // Desktop: Use Electron secure storage
      await (window as any).electronAPI.secureStore.set(this.storageKey, tokens);
    } else if (this.isMobile()) {
      // Mobile: Use secure storage plugin
      await (window as any).SecureStorage.set(this.storageKey, tokenString);
    } else {
      // Web: Use encrypted localStorage
      const encrypted = await this.encrypt(tokenString);
      localStorage.setItem(this.storageKey, encrypted);
    }
  }

  async retrieve(): Promise<TokenResponse | null> {
    let tokenString: string | null = null;

    try {
      if (this.isNode()) {
        // Terminal: Try keychain first
        if (this.keytar) {
          tokenString = await this.keytar.getPassword('lanonasis-mcp', 'tokens');
        }
        
        // Fallback to file if not in keychain
        if (!tokenString) {
          tokenString = await this.retrieveFromFile();
        }
      } else if (this.isElectron()) {
        // Desktop: Use Electron secure storage
        const tokens = await (window as any).electronAPI.secureStore.get(this.storageKey);
        return tokens || null;
      } else if (this.isMobile()) {
        // Mobile: Use secure storage plugin
        tokenString = await (window as any).SecureStorage.get(this.storageKey);
      } else {
        // Web: Use encrypted localStorage
        const encrypted = localStorage.getItem(this.storageKey);
        if (encrypted) {
          tokenString = await this.decrypt(encrypted);
        }
      }

      return tokenString ? JSON.parse(tokenString) : null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  async clear(): Promise<void> {
    if (this.isNode()) {
      if (this.keytar) {
        await this.keytar.deletePassword('lanonasis-mcp', 'tokens');
      }
      await this.deleteFile();
    } else if (this.isElectron()) {
      await (window as any).electronAPI.secureStore.delete(this.storageKey);
    } else if (this.isMobile()) {
      await (window as any).SecureStorage.remove(this.storageKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  isTokenExpired(tokens: TokenResponse): boolean {
    if (!tokens.expires_in) return false;
    
    // Assume token was issued at storage time
    // In production, should store issued_at timestamp
    const storedAt = this.getStoredAt(tokens);
    if (!storedAt) return true;
    
    const expiresAt = storedAt + (tokens.expires_in * 1000);
    const now = Date.now();
    
    // Consider expired if less than 5 minutes remaining
    return (expiresAt - now) < 300000;
  }

  private getStoredAt(tokens: TokenResponse): number | null {
    // In production, store this with the tokens
    // For now, use a rough estimate
    return Date.now() - 3600000; // Assume stored 1 hour ago
  }

  private async storeToFile(tokenString: string): Promise<void> {
    if (!this.isNode()) return;
    
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const crypto = require('crypto');
    
    const configDir = path.join(os.homedir(), '.lanonasis');
    const tokenFile = path.join(configDir, 'mcp-tokens.enc');
    
    // Ensure directory exists
    await fs.mkdir(configDir, { recursive: true });
    
    // Encrypt tokens
    const key = this.getFileEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    
    let encrypted = cipher.update(tokenString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Store with IV
    const data = iv.toString('hex') + ':' + encrypted;
    await fs.writeFile(tokenFile, data, { mode: 0o600 });
  }

  private async retrieveFromFile(): Promise<string | null> {
    if (!this.isNode()) return null;
    
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    const crypto = require('crypto');
    
    const tokenFile = path.join(os.homedir(), '.lanonasis', 'mcp-tokens.enc');
    
    try {
      const data = await fs.readFile(tokenFile, 'utf8');
      const [ivHex, encrypted] = data.split(':');
      
      const key = this.getFileEncryptionKey();
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      return null;
    }
  }

  private async deleteFile(): Promise<void> {
    if (!this.isNode()) return;
    
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    
    const tokenFile = path.join(os.homedir(), '.lanonasis', 'mcp-tokens.enc');
    
    try {
      await fs.unlink(tokenFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  private getFileEncryptionKey(): Buffer {
    const crypto = require('crypto');
    const os = require('os');
    
    // Derive key from machine ID + fixed salt
    const machineId = os.hostname() + os.userInfo().username;
    const salt = 'lanonasis-mcp-oauth-2024';
    
    return crypto.pbkdf2Sync(machineId, salt, 100000, 32, 'sha256');
  }

  private async encrypt(text: string): Promise<string> {
    // Simple encryption for web storage
    // In production, use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // This is a placeholder - implement proper encryption
    return btoa(String.fromCharCode(...data));
  }

  private async decrypt(encrypted: string): Promise<string> {
    // Simple decryption for web storage
    // In production, use Web Crypto API
    const binary = atob(encrypted);
    const bytes = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  private isNode(): boolean {
    return typeof process !== 'undefined' && 
           process.versions && 
           process.versions.node &&
           !this.isElectron();
  }

  private isElectron(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).electronAPI !== undefined;
  }

  private isMobile(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).SecureStorage !== undefined;
  }
}