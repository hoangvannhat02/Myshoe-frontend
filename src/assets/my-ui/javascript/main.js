


  $(document).ready(function () {
  const btn = $('.btn-cart');
  const elementClose = $('.quickView__close');
  const quickViewElement = $('.quickView');
  const btnShowQuickView = $('.link-info-pro');
  // function toast({ title = '', message = '', type = 'info', duration = 3000 }) {
  //   const main = $('#toast');
  //   if (main) {
  //     const toast = document.createElement('div');
  //     toast.classList.add('toast', `toast--${type}`);

  //     // Thêm thanh trượt
  //     const progress = document.createElement('div');
  //     progress.classList.add('toast__progress');

  //     const autoRemove = setTimeout(function () {
  //       toast.remove();
  //     }, duration + 1000);

  //     $(toast).click(function (e) {
  //       if (e.target.closest('.toast__close')) {
  //         toast.remove();
  //         clearTimeout(autoRemove);
  //       }
  //     })

  //     const delay = (duration / 1000).toFixed(2);
  //     progress.style.animation = `progressAnimation linear ${duration / 1000}s forwards`;
  //     toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;


  //     const icons = {
  //       success: 'fa-solid fa-circle-check',
  //       info: 'fa-solid fa-circle-info',
  //       warning: 'fa-solid fa-circle-exclamation',
  //       error: 'fa-solid fa-circle-exclamation'
  //     }

  //     toast.innerHTML = `
  //               <div class="toast__icon">
  //                   <i class="${icons[type]}"></i>
  //               </div>
  //               <div class="toast__body">
  //                   <h3 class="toast__title"> 
  //                       ${title}
  //                   </h3>
                    
  //                   <p class="toast__msg">
  //                       ${message}
  //                   </p>
  //               </div>
                
  //               <div class="toast__close">
  //                   <i class="fa-solid fa-xmark"></i>
  //               </div> 
  //               <div class="toast__progress"></div>`
  //     main.append(toast)
  //     progress.innerHTML = '<div class="toast__progress"></div>';
  //     main.append(progress)
  //   }
  // }
  // btn.click(function (e) {
  //   e.preventDefault();
  //   toast({
  //     title: 'Thành công',
  //     message: "Thêm vào giỏ hàng thành công",
  //     type: "success",
  //     duration: 3000
  //   })
  // })

  elementClose.click(function () {
    quickViewElement.hide();
  })

  btnShowQuickView.click(function (e) {
    e.preventDefault();
    const target = $(e.target);
    if(target.hasClass('fa-eye')){
      quickViewElement.show();
    }
    quickViewElement.show();
  })

  $('.quickView__overlay').click(function () {
    quickViewElement.hide();
  })
})
