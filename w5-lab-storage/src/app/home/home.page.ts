import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class HomePage {
  key: string = '';
  value: string = '';
  output: string = '';

  constructor(private storageService: StorageService) {}

  async setItem() {
    if (!this.key || !this.value) {
      this.output = 'Error: Key and value must be provided';
      alert('Error: Key and value must be provided');
      return;
    }
    try {
      await this.storageService.set(this.key, this.value);
      this.output = `Set ${this.key}: ${this.value}`;
    } catch (error) {
      console.error('Error setting item', error);
      this.output = `Error setting item: ${error}`;
    }
  }

  async getItem() {
    try {
      const value = await this.storageService.get(this.key);
      if (value === null || value === undefined) {
        this.output = `Error: No item found for key ${this.key}`;
        alert(`Error: No item found for key ${this.key}`);
        throw new Error(`No item found for key ${this.key}`);
      }
      this.output = `Get ${this.key}: ${value}`;
    } catch (error) {
      console.error('Error getting item', error);
      this.output = `Error getting item: ${error}`;
    }
  }
  
  async removeItem() {
    try {
      const value = await this.storageService.get(this.key);
      if (value === null || value === undefined) {
        this.output = `Error: No item found for key ${this.key}`;
        alert(`Error: No item found for key ${this.key}`);
        throw new Error(`No item found for key ${this.key}`);
      }
      await this.storageService.remove(this.key);
      this.output = `Removed ${this.key}`;
    } catch (error) {
      console.error('Error removing item', error);
      this.output = `Error removing item: ${error}`;
    }
  }

  async clearStorage() {
    try {
      const length = await this.storageService.length();
      if (length === 0) {
        this.output = 'Error: Storage is already empty';
        alert('Error: Storage is already empty');
        throw new Error('Storage is already empty');
      }
      await this.storageService.clear();
      this.output = 'Storage cleared';
    } catch (error) {
      console.error('Error clearing storage', error);
      this.output = `Error clearing storage: ${error}`;
    }
  }

  async getKeys() {
    try {
      const keys = await this.storageService.keys();
      if (keys.length === 0) {
      this.output = 'Error: No keys found in storage';
      alert('Error: No keys found in storage');
      throw new Error('No keys found in storage');
      }
      this.output = `Keys: ${keys.join(', ')}`;
    } catch (error) {
      console.error('Error getting keys', error);
      this.output = `Error getting keys: ${error}`;
    }
  }

  async getLength() {
    try {
      const length = await this.storageService.length();
      if (length === 0) {
      this.output = 'Error: Storage is empty';
      alert('Error: Storage is empty');
      throw new Error('Storage is empty');
      }
      this.output = `Storage length: ${length}`;
    } catch (error) {
      console.error('Error getting storage length', error);
      this.output = `Error getting storage length: ${error}`;
    }
  }

  async iterateStorage() {
    try {
      const length = await this.storageService.length();
      if (length === 0) {
        this.output = 'Error: Storage is empty';
        alert('Error: Storage is empty');
        throw new Error('Storage is empty');
      }
      let output = 'Storage items:\n';
      await this.storageService.forEach((value, key, index) => {
        output += `${index}: ${key} => ${value}\n`;
      });
      this.output = output;
    } catch (error) {
      console.error('Error iterating over storage', error);
      this.output = `Error iterating over storage: ${error}`;
    }
  }
}
