

const barBtn = document.querySelector('.header .bar-btn')
const navBarLeft  =document.querySelector('.impotant')


barBtn.onclick =()=> 
{
    barBtn.classList.toggle('fa-times')
    navBarLeft.classList.toggle('active')

}