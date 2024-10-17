import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ModalController } from '@ionic/angular';
import { EditMovieModalComponent } from '../../edit-movie-modal/edit-movie-modal.component'; // Adjust the path as necessary
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class MoviesPage implements OnInit {
  movieName: string = '';
  releaseYear: string = '';
  movies: { name: string; year: string; isWatched?: boolean }[] = [];
  filteredMovies: { name: string; year: string; isWatched?: boolean }[] = [];
  errorMessage: string = '';
  isAddingMovie: boolean = false; // State for adding a movie
  selectedFilter: string = 'all'; // Current filter

  constructor(private storageService: StorageService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.loadMovies();
    this.filteredMovies = this.movies; // Initialize filteredMovies
  }

  async addMovie() {
    // Validate that movie name contains only letters and release year contains only numbers
    const nameRegex = /^[A-Za-z\s]+$/;
    const yearRegex = /^\d{4}$/;

    if (this.movieName && this.releaseYear) {
      if (!nameRegex.test(this.movieName)) {
        this.errorMessage = 'Movie name should contain only letters.';
        return;
      }

      if (!yearRegex.test(this.releaseYear)) {
        this.errorMessage = 'Release year should be a 4-digit number.';
        return;
      }

      const movie = { name: this.movieName, year: this.releaseYear, isWatched: false };
      this.movies.push(movie);
      this.filterMovies(); // Update filtered movies after adding a new movie

      try {
        // Save updated movie list to storage
        await this.storageService.set('movies', this.movies);
        
        // Clear the input fields after saving
        this.movieName = '';
        this.releaseYear = '';
        
        // Reset error message on successful save
        this.errorMessage = '';
      } catch (error) {
        console.error('Error adding movie:', error);
        this.errorMessage = 'Error adding movie. Please try again.';
      }
    } else {
      this.errorMessage = 'Movie name and release year are required.';
    }
  }

  async loadMovies() {
    try {
      const storedMovies = await this.storageService.get('movies');
      if (storedMovies) {
        this.movies = storedMovies;
      }
      this.errorMessage = '';
    } catch (error) {
      console.error('Error loading movies:', error);
      this.errorMessage = 'Error loading movies. Please try again.';
    }
  }

  async deleteMovie(index: number) {
    this.movies.splice(index, 1);
    try {
      await this.storageService.set('movies', this.movies);
      this.errorMessage = '';
      this.filterMovies(); // Update filtered movies after deletion
    } catch (error) {
      console.error('Error deleting movie:', error);
      this.errorMessage = 'Error deleting movie. Please try again.';
    }
  }

  // Open modal for editing a movie
  async openEditModal(index: number) {
    const modal = await this.modalController.create({
      component: EditMovieModalComponent,
      componentProps: {
        movieName: this.movies[index].name,
        releaseYear: this.movies[index].year,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const updatedMovie = result.data;
        this.movies[index] = updatedMovie; // Update the movie in the list
        this.updateStorage(); // Update storage with new movie list
      }
    });

    return await modal.present();
  }

  // Update the storage after editing a movie
  async updateStorage() {
    try {
      await this.storageService.set('movies', this.movies);
    } catch (error) {
      console.error('Error updating storage:', error);
      this.errorMessage = 'Error updating movie list. Please try again.';
    }
  }

  updateWatchedStatus(movie: { isWatched?: boolean }) {
    // You can log or perform any action here when the watched status changes.
    console.log('Updated watched status for movie:', movie);
  }

  filterMovies() {
    if (this.selectedFilter === 'watched') {
        this.filteredMovies = this.movies.filter(movie => movie.isWatched);
    } else if (this.selectedFilter === 'unwatched') {
        this.filteredMovies = this.movies.filter(movie => !movie.isWatched);
    } else {
        this.filteredMovies = [...this.movies]; // Show all movies
    }

    // Check if there are no movies in the filtered list and set an error message
    if (this.filteredMovies.length === 0) {
        this.errorMessage = 'No movies found in this section.';
    } else {
        this.errorMessage = ''; // Clear the error message if there are movies
    }
  }

}
