import './style-404.scss';

const errorContent = document.querySelector('.error__content') as HTMLElement;
window.addEventListener('mousemove', function(e: MouseEvent) {
    const x: number = e.clientX / window.innerWidth;
    const y: number = e.clientY / window.innerHeight;  
    errorContent.style.transform = 'translate(-' + x * 20 + 'px, -' + y * 20 + 'px)';
});