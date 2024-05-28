import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  showToast({ title = '', message = '', type = 'info', duration = 3000 }): void {
    const main = document.getElementById('toast');
    if (main) {
      const toast = document.createElement('div');
      toast.classList.add('toast', `toast--${type}`);

      const progress = document.createElement('div');
      progress.classList.add('toast__progress');

      const autoRemove = setTimeout(() => {
        toast.remove();
        progress.remove();
      }, duration);

      toast.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement; // Chuyển đổi e.target thành HTMLElement
      
        const closeButton = target.closest('.toast__close');
        if (closeButton) {
          progress.remove();
          toast.remove();
          clearTimeout(autoRemove);
        }
      });
      

      const delay = (duration / 1000).toFixed(2);
      progress.style.animation = `progressAnimation linear ${duration / 1000}s forwards`;
      toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

      const icons: { [key: string]: string } = {
        success: 'fa-solid fa-circle-check',
        info: 'fa-solid fa-circle-info',
        warning: 'fa-solid fa-circle-exclamation',
        error: 'fa-solid fa-circle-exclamation'
      };

      toast.innerHTML = `
        <div class="toast__icon">
          <i class="${icons[type]}"></i>
        </div>
        <div class="toast__body">
          <h3 class="toast__title"> 
            ${title}
          </h3>
          <p class="toast__msg">
            ${message}
          </p>
        </div>
        <div class="toast__close">
          <i class="fa-solid fa-xmark"></i>
        </div>
        `;
      progress.innerHTML = '<div class="toast__progress"></div>';

      main.appendChild(toast);
      main.appendChild(progress)
    }
  }
}
