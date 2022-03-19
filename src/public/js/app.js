$(document).ready(function () {
    $('.container-home .home-page .background-header-slider .container-bg-im').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        fade: true,
        arrows: false,
        draggable: false
    });
});
const hiddenblock = document.querySelector('.search-form-hidden')
//header scroll 
var lastscrolltop = 0;
var header = document.querySelector('.header .top')

const scrollTopBtn = document.querySelector('.scrolltop')

window.addEventListener('scroll', function () {
    navbarscroll();
    scrollToTopBtn();
    mostViewsArea();
})

function navbarscroll (){
    let scrolltop = window.pageYOffset

    if (scrolltop > lastscrolltop) {
        header.style.top = "-10rem";
        // addTransform()
    } else {
        header.style.top = '1rem';
        // removeTransform()
    }
    lastscrolltop = scrolltop
}
function scrollToTopBtn(){
    let scrolltop = window.pageYOffset
    if (scrolltop > 600) {
        scrollTopBtn.classList.add('active')
    } else {
        scrollTopBtn.classList.remove('active')
    }
}
function mostViewsArea(){

    const boxMostView = document.querySelector('.containerMV_PostDetail')
    const boxDetailPost =  document.querySelector('.container-postdetail')
    if(boxDetailPost)
    {
        let scrolltop = window.pageYOffset
        const height =  boxDetailPost.offsetHeight
        const heightReal =  height - 300
        if(scrolltop >= heightReal)
        {
            if(boxMostView)
            {
                // boxMostView.classList.add('active')
                boxMostView.setAttribute('style','position: absolute; right: 12rem;bottom:2rem;width: 310px;height: fit-content;')
            }
        }
        else
        {
            if(boxMostView)
            {
                // boxMostView.classList.remove('active')
                boxMostView.setAttribute('style','position: fixed; right: 12rem;w;idth: 310pxheight: fit-content;')
            }
        }
    }
}
function addTransform () {
    const boxMostView = document.querySelector('.containerMV_PostDetail')
    boxMostView.classList.add('transform')
}
function removeTransform () {
    const boxMostView = document.querySelector('.containerMV_PostDetail')
    if(boxMostView.classList.contains('transform'))
        boxMostView.classList.remove('transform')
}

//// HANDLE CLICK EVENT ////

//barsbtn  click 

const barsbtn = document.querySelector('.btn-bars');
const navbar = document.querySelector('.top .navbar')
barsbtn.onclick = () => {
    navbar.classList.toggle('active');
}

//line slide
// const navbtn = document.querySelectorAll('.top .navbar a')
// const line = document.querySelector('.top .navbar .line')
// navbtn.forEach(item => {
//     item.onmousemove = (e) => {

//         e.preventDefault()
//         line.style.left = item.offsetLeft + 'px';
//         line.style.width = item.offsetWidth + 'px';
//     }
// })


const categoryBtn = document.querySelector('.icon-home-bars') ? document.querySelector('.icon-home-bars') : hiddenblock

const boxCate = document.querySelector('.container-li');


categoryBtn.onclick = () => {
    boxCate.classList.toggle('active')
}


//theme control

// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.querySelector('.interface');

const enableDarkMode = () => {
    // 1. Add the class to the body
    document.body.classList.add('dark-mode');
    // 2. Update darkMode in localStorage
    localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove('dark-mode');
    // 2. Update darkMode in localStorage 
    localStorage.setItem('darkMode', null);
}

// If the user already visited and enabled darkMode
// start things off with it on
if (darkMode === 'enabled') {
    enableDarkMode();
}

// When someone clicks the button
darkModeToggle.addEventListener('click', () => {

    darkModeToggle.classList.toggle('fa-sun')
    // get their darkMode setting
    darkMode = localStorage.getItem('darkMode');

    // if it not current enabled, enable it
    if (darkMode !== 'enabled') {
        enableDarkMode();
        // if it has been enabled, turn it off  
    } else {
        disableDarkMode();
    }
});




///toast message
function clickclick({ title = '', message = '', type = 'info', duration = 2000 }) {
    const main = document.querySelector('#toast')
    if (main) {

        const toast = document.createElement('div');
        const show = duration + 1000;

        //auto remove toast
        const autoremoveID = setTimeout(function () {
            main.removeChild(toast);
        }, show)

        //click remove toast

        toast.onclick = (e) => {
            if (e.target.closest('.container__close')) {
                main.removeChild(toast);
                clearTimeout(autoremoveID);
            }
        }
        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle',
            error: 'fas fa-exclamation-circle',
        }

        const icon = icons[type]
        const delay = (duration / 1000).toFixed(2)

        toast.classList.add('container-toast', `container--${type}`);
        toast.style.animation = ` slideleft .3s linear,fadeout 1s linear forwards ${delay}s`;
        toast.innerHTML = `<div class="container__icon">
            <i class=" ${icon}"></i>
        </div>
        <div class="container__content">
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
        <div class="container__close">
            <i class="fas fa-times"></i>
        </div>`;
        main.appendChild(toast);
    }
}
function success() {

    clickclick(
        {
            title: 'success',
            message: 'here is notification ',
            type: 'success',
            duration: 2000
        }
    )
}
function warning() {

    clickclick(
        {
            title: 'warning',
            message: 'here is warning ',
            type: 'warning',
            duration: 2000
        }
    )
}
function error() {

    clickclick(
        {
            title: 'error',
            message: 'here is error ',
            type: 'error',
            duration: 2000
        }
    )
}




//varlidation form register
// Đối tượng `Validator`
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {

            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });
        });
    }

}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'please enter this field'
        }
    };
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'this field must be email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Please enter at least ${min} characters`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'password confirm incorrectly';
        }
    }
}

/////slick///





///socket io 
let socket = io()

const inputCmt = document.querySelector('.contentcomment') ? document.querySelector('.contentcomment') : hiddenblock;

const slug = window.location.href.split('/').slice(-1)[0];
const email = document.querySelector('#getemail') ? document.querySelector('#getemail').innerText.trim() : '';
const username = document.querySelector('.info-user .name') ? document.querySelector('.info-user .name').innerText : '';

const sendBtn = document.querySelector('.btn-send-comment') ? document.querySelector('.btn-send-comment') : hiddenblock;
const commentBox = document.querySelector('.comments-box');

const avatasrc = document.querySelector('.info-user .image img') ? document.querySelector('.info-user .image img').src.split('/').slice(3, 5).join('/') : '';

inputCmt.onclick = () => {
    if (username === '') {
        myFunction()
    }
}
function myFunction() {
    let text = "please login to comment !";
    if (confirm(text) == true) {
        window.location.href = 'http://localhost:3000/account/login'
    } else {

    }

}

sendBtn.onclick = (e) => {
    let comment = inputCmt.value
    if (!comment) {
        return
    }
    if (username === '') {
        return
    }
    postComment(comment)

}
function postComment(cmt) {
    let data = {
        username: username,
        comment: cmt,
        email: email,
        slug: slug
    }
    appendToDom(data)
    inputCmt.value = ''
    socketsendcmt(data)

    syncWithDb(data)
}
function appendToDom(data) {

    const box = document.createElement('div')
    box.classList.add('box')

    const html = ` 
                <div class="avata">
                    <img src="/${avatasrc}"
                        alt="image">
                </div>

                <div class="content">
                   
                    <div class="username">
                        <h3>${data.username}</h3>
                        <smal class="time">${moment(data.time).format('LT')}</smal>
                    </div>
                    <p>${data.comment}</p>
                </div> `
    box.innerHTML = html
    commentBox.appendChild(box)

}
function socketsendcmt(data) {
    socket.emit('comment', data)
}
socket.on('send', function (data) {
    appendToDom(data)
})

inputCmt.onkeyup = (e) => {
    socket.emit('typing', { username })
}
let timerId = null
function debounce(func, timer) {
    if (timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}
const typingDiv = document.querySelector('.ontyping p')
socket.on('usertyping', function (data) {
    typingDiv.innerText = `${data.username} is typing...`
    debounce(function () {
        typingDiv.innerText = ''
    }, 1500)
})

function syncWithDb(data) {

    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comment', { method: 'Post', body: JSON.stringify(data), headers })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}




/// click delete comment

const threedogs = document.querySelectorAll('.threedos-btn')
// const boxdrops = document.querySelectorAll('.dropdown')




threedogs.forEach(result => {

    const id = result.id
    const acc = document.querySelector(`div[data-id="${id}"]`)
    result.onclick = () => {
        if (result.value === email) {
            if (acc) {
                acc.classList.toggle('active')
            }
        }
    }
    result.onmouseleave = () =>
    {
       
        if(acc.classList.contains('active'))
        {
            acc.classList.remove('active')
        }
    }

})


const deletecmt = (id) => {

    removeCmtFromDom(id)
    socketsenddelecmt(id)
    deleteCmtDb(id)
}

function deleteCmtDb(id) {

    const headers = {
        'Content-Type': 'application/json'
    }
    fetch(`/api/deletecmt/${id}`, { method: 'Post', headers })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}
function removeCmtFromDom(id) {

    let boxCmt = document.querySelector(`.box-item-${id}`)

    if (boxCmt) {
        boxCmt.remove();
    }

}
function socketsenddelecmt(id) {
    socket.emit('deletecomment', id)
}
socket.on('deletecommentserver', function (id) {
    removeCmtFromDom(id)
})



