import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-movie-modal',
  templateUrl: './edit-movie-modal.component.html',
  styleUrls: ['./edit-movie-modal.component.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule, CommonModule],
})
export class EditMovieModalComponent {
  @Input() movieName: string = '';
  @Input() releaseYear: string = '';
  @Output() movieUpdated: EventEmitter<{ name: string; year: string }> = new EventEmitter();

  constructor(private modalController: ModalController) {}

  save() {
    console.log('Saving movie:', this.movieName, this.releaseYear);
    this.movieUpdated.emit({ name: this.movieName, year: this.releaseYear });
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
