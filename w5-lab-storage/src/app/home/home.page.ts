import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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

  constructor(private storage: Storage) {
    storage.create();
  }

  async setItem() {
    try {
      await this.storage.set(this.key, this.value);
      this.output = `Set ${this.key}: ${this.value}`;
    } catch (error) {
      console.error('Error setting item', error);
      this.output = `Error setting item: ${error}`;
    }
  }

  async getItem() {
    try {
      const value = await this.storage.get(this.key);
      this.output = `Get ${this.key}: ${value}`;
    } catch (error) {
      console.error('Error getting item', error);
      this.output = `Error getting item: ${error}`;
    }
  }
  
  async removeItem() {
    try {
      await this.storage.remove(this.key);
      this.output = `Removed ${this.key}`;
    } catch (error) {
      console.error('Error removing item', error);
      this.output = `Error removing item: ${error}`;
    }
  }

  async clearStorage() {
    try {
      await this.storage.clear();
      this.output = 'Storage cleared';
    } catch (error) {
      console.error('Error clearing storage', error);
      this.output = `Error clearing storage: ${error}`;
    }
  }

  async getKeys() {
    try {
      const keys = await this.storage.keys();
      this.output = `Keys: ${keys.join(', ')}`;
    } catch (error) {
      console.error('Error getting keys', error);
      this.output = `Error getting keys: ${error}`;
    }
  }

  async getLength() {
    try {
      const length = await this.storage.length();
      this.output = `Storage length: ${length}`;
    } catch (error) {
      console.error('Error getting storage length', error);
      this.output = `Error getting storage length: ${error}`;
    }
  }

  async iterateStorage() {
    try {
      let output = 'Storage items:\n';
      await this.storage.forEach((value, key, index) => {
        output += `${index}: ${key} => ${value}\n`;
      });
      this.output = output;
    } catch (error) {
      console.error('Error iterating over storage', error);
      this.output = `Error iterating over storage: ${error}`;
    }
  }
}
