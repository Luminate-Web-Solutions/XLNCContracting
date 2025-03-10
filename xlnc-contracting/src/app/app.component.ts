import { Component, OnInit, OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from './services/contact.service';

interface Service {
  name: string;
  image: string;
  description: string;
  
}

interface Project {
  id: string;
  title: string;
  image: string;
  client?: string;
  contractor?: string;
  engineer?: string;
  CreativeLabs?: string;
  RetailShops?: string;
  MarzouquiVilla?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  selectedService: Service | null = null;
  isScrolled = false;
  activeSection = '';
  isMenuOpen = false;
  contactForm: FormGroup;
  isSubmitting = false;
  selectedCaptcha: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  selectCaptcha(type: string) {
    this.selectedCaptcha = type;
  }



  

  isMobile = window.innerWidth <= 768;
  private images = [
    'hero.jpeg',
    'Slider3.jpg',
    'Slider2.jpg',
  ];
  private currentIndex = 0;
  private intervalId: any;

  

  ngOnInit() {
    this.startSlideshow();
    this.updateBackgroundImage();
  }


  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  updateActiveSection() {
    const sections = ['home', 'about', 'health-safety', 'team', 'news', 'projects', 'service', 'contact'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  isAboutActive(): boolean {
    return ['about', 'health-safety', 'team'].includes(this.activeSection);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private updateBackgroundImage() {
    const heroElement = document.querySelector('.hero') as HTMLElement;
    if (heroElement) {
      heroElement.style.backgroundImage = `url(${this.images[this.currentIndex]})`;
    }
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateBackgroundImage();
    this.resetTimer();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateBackgroundImage();
    this.resetTimer();
  }

  private resetTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startSlideshow();
  }

  services: Service[] = [
    {
      name: 'Carpentry Works',
      image: 'Carpenter2.jpg',
      description: 'Expert carpentry services for all your woodworking needs.'
    },
    {
      name: 'Cleaning Services',
      image: 'CW2.jpg',
      description: 'Professional cleaning services for commercial and residential spaces.'
    },
    {
      name: 'Electrical Works',
      image: 'EW2.jpg',
      description: 'Complete electrical solutions for your property.'
    },
    {
      name: 'Fit-out Works',
      image: 'FO4.jpg',
      description: 'Custom fit-out solutions for commercial spaces.'
    },
    {
      name: 'HVAC Works',
      image: 'HVAC3.jpg',
      description: 'Installation and maintenance of HVAC systems.'
    },
    {
      name: 'Maintenance Contracts',
      image: 'MNW1.png',
      description: 'Regular maintenance services for your property.'
    },
    {
      name: 'Masonry Works',
      image: 'MW3.jpg',
      description: 'Professional masonry services for construction projects.'
    },
    {
      name: 'Painting Works',
      image: 'PW1.jpg',
      description: 'Quality painting services for interior and exterior.'
    },
    {
      name: 'Plumbing & Sewerage Works',
      image: 'PASW3.jpg',
      description: 'Complete plumbing and sewerage solutions.'
    },
    {
      name: 'Structure/Steel Works',
      image: 'SS1.jpg',
      description: 'Structural steel work for construction projects.'
    },
    {
      name: 'Tiling Works',
      image: 'TW3.png',
      description: 'Professional tiling services for all surfaces.'
    },
    {
      name: 'Water Proofing Works',
      image: 'WP2.jpg',
      description: 'Effective waterproofing solutions for your property.'
    }
  ];
  selectService(service: Service) {
    this.selectedService = this.selectedService === service ? null : service;
  }

  projects: Project[] = [
    {
      id: 'creative-lab',
      title: 'CREATIVE LAB - DUBAI POLICE',
      image: '1-3.jpg',
      client: 'Dubai Police Main',
      contractor: 'Speed House',
      engineer: 'Farhan Sh...'
    },
    {
      id: 'villa-01',
      title: 'VILLA - 01 - DUBAI',
      image: '010.jpeg'
    },
    {
      id: 'fardan-villa',
      title: 'FARDAN VILLA - DUBAI',
      image: '1-1.jpg'
    },
    {
      id: 'more-projects',
      title: 'MORE PROJECTS',
      image: 'IMG_E1146.jpg',
      CreativeLabs: 'Dubai Police',
      RetailShops: 'Dubai Al',
     MarzouquiVilla: 'Dubai ...'
    }
  ];


  galleryImages = [
    { url: '3.jpg', alt: 'Project Image 1' },
    { url: '48.jpg', alt: 'Project Image 2' },
    { url: '49.jpg', alt: 'Project Image 3' },
    { url: '33.jpg', alt: 'Project Image 4' },
    { url: '5.jpg', alt: 'Project Image 5' }
  ];

  

  statsNumbers: { [key in 'projectsCompleted' | 'clientsWorked' | 'ongoingProjects' | 'since']: { start: number; end: number; current: number } } = {
    projectsCompleted: { start: 0, end: 81, current: 0 },
    clientsWorked: { start: 0, end: 67, current: 0 },
    ongoingProjects: { start: 0, end: 6, current: 0 },
    since: { start: 0, end: 2015, current: 0 }
  };

  private statsAnimationStarted = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.updateActiveSection();
    this.checkStatsVisibility();
  }

  private checkStatsVisibility() {
    if (this.statsAnimationStarted) return;

    const statsSection = document.querySelector('.statistics-section');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      this.startStatsAnimation();
      this.statsAnimationStarted = true;
    }
  }

  private startStatsAnimation() {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const animate = () => {
      (Object.keys(this.statsNumbers) as Array<keyof typeof this.statsNumbers>).forEach(key => {
        const stat = this.statsNumbers[key];
        const increment = (stat.end - stat.start) / steps;
        if (stat.current < stat.end) {
          stat.current = Math.min(stat.current + increment, stat.end);
        }
      });

      if (Object.values(this.statsNumbers).some(stat => stat.current < stat.end)) {
        setTimeout(animate, interval);
      }
    };

    animate();
  }
  onSubmit() {
    if (this.contactForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }
  
    if (this.selectedCaptcha !== 'truck') {
      this.snackBar.open('Please select the correct captcha option', 'Close', {
        duration: 3000
      });
      return;
    }
  
    this.isSubmitting = true;
    this.contactService.submitContactForm(this.contactForm.value).subscribe({
      next: (response) => {
        console.log('Response:', response); // Log the response for debugging
        if (response.success) {
          this.snackBar.open('Message sent successfully!', 'Close', {
            duration: 3000
          });
          this.contactForm.reset();
          this.selectedCaptcha = null;
        } else {
          console.warn('Unexpected response status:', response.message); // Log unexpected status
          this.snackBar.open('Failed to send message. Please try again.', 'Close', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error:', error); // Log the error for debugging
        this.snackBar.open('Failed to send message. Please try again.', 'Close', {
          duration: 3000
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}

