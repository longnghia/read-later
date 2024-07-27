import Swal from 'sweetalert2';

const toast = (text: string, timeout = 1500) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timeout,
    timerProgressBar: true,
    didOpen: (_toast) => {
      _toast.addEventListener('mouseenter', Swal.stopTimer);
      _toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    customClass: {
      container: 'swal2-small',
    },
    icon: 'success',
    title: text,
  });
};

export default toast;
