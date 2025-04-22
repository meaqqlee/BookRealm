import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {UserProfile} from '../interfaces/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Form fields
  displayName: string = '';
  email: string = '';
  bio: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.displayName = profile.displayName || '';
        this.email = profile.email || '';
        this.bio = profile.bio || '';
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile information.';
        this.isLoading = false;
        console.error('Error loading profile:', error);
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEditing(): void {
    if (this.profile) {
      this.displayName = this.profile.displayName || '';
      this.email = this.profile.email || '';
      this.bio = this.profile.bio || '';
    }
    this.isEditing = false;
  }

  saveProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedProfile = {
      displayName: this.displayName,
      email: this.email,
      bio: this.bio
    };

    this.authService.updateUserProfile(updatedProfile).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isEditing = false;
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', error);
      }
    });
  }
}
