const PRELOADER_MIN_TIME = 0;

const navbarList = document.querySelector('.navbar__list');
const navbarToggle = document.querySelector('.navbar__toggle');
const navbarLinks = document.querySelectorAll('.navbar__link');

let startTime;
let date = new Date();
let swup;

window.addEventListener('load', onLoad, false);

if ( document.readyState === 'complete' ||
    (document.readyState !== 'loading' && 
    !document.documentElement.doScroll) ) {

    onReady();

} else {

    document.addEventListener('DOMContentLoaded', onReady, false);
}

function onReady() {

    startTime = date.getTime();
}

function onLoad() {

    setupSwup();

    setupMenu();
    if (getPageKey() === 'contact' ) setupContactForm();
    if (getPageKey().includes('gallery')) setupBaguetteBox();

    setupPageLoader();
    window.addEventListener('resize', setupPageLoader);

    // ---------------------------------------------------------------------------------------------

    hideAndRemovePreloader();
}

function setupSwup() {

    const pageLoader = document.querySelector('.pageloader__animation');

    swup = new Swup();
    
    swup.on('transitionStart', ev => {
        
        pageLoader.classList.add('show')
    });

    swup.on('transitionEnd', ev => {

        pageLoader.classList.remove('show');
    });

    swup.on('contentReplaced', ev => {

        if (getPageKey() === 'contact') setupContactForm();
        if (getPageKey().includes('gallery')) setupBaguetteBox();

        navbarLinks.forEach(link => {

            link.classList.remove('active');

            if (link.getAttribute('href') === swup.getCurrentUrl()) {

                link.classList.add('active');
            }
        });
    });
}

function setupMenu() {

    navbarToggle.addEventListener('click', ev => {

        navbarList.classList.toggle('open');

    }, true);

    navbarLinks.forEach(el => {

        const linkPageKey = el.getAttribute('data-page-key');

        if (linkPageKey === getPageKey()) {

            el.classList.add('active');
        }

    }, false);

    window.addEventListener('click', ev => {

        if (ev.target !== navbarToggle && ev.target.parentElement !== navbarToggle) {

            navbarList.classList.remove('open');
        }

    }, true);

    window.addEventListener('resize', ev => {

        navbarList.classList.remove('open');

    }, false);

}

function getPageKey() {

    return document.querySelector('.main').getAttribute('data-page-key');
}

function getPageURL() {

    return document.querySelector('.main').getAttribute('data-page-url');
}

function setupPageLoader() {

    const headerH = document.querySelector('.header').offsetHeight;
    const footerH = document.querySelector('.footer').offsetHeight;

    document.documentElement.style.setProperty('--pgl-top', +headerH + 'px');
    document.documentElement.style.setProperty('--pgl-bottom', +footerH + 'px');
}

function setupBaguetteBox() {

    if (document.querySelector('.image-grid')) baguetteBox.run('.image-grid');
}


// -------------------------------------------------------------------------------------------------
// contact form
// -------------------------------------------------------------------------------------------------

function setupContactForm() {

    const form = document.getElementById('form');

    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactMessage = document.getElementById('contact-message');

    const submitButton = document.querySelector('#form .submit');

    const inputFields = [contactName, contactEmail, contactMessage];
        
    let valid = true;

    inputFields.forEach(el => {

        el.addEventListener('focusout', ev => {

            checkInputs();
        });

        el.addEventListener('input', ev => {

            checkInputs();
        });
    });

    checkInputs();

    submitButton.addEventListener('click', ev => {

        ev.preventDefault();

        if (valid) {

            // form.action = 'https://formsubmit.co/fincazefizan@outlook.com'
            form.action = 'https://formsubmit.co/e58d6b478ddd64071e378f5a54ed034e';
            form.submit();
        }    

        return false;
    });

    function checkInputs() {

        valid = true;

        if (
            (contactName.value.trim() === '') &&
            (contactEmail.value.trim() === '') &&
            (contactMessage.value.trim() === '')
        ) {

            inputFields.forEach(el => setSuccessFor(el));
            submitButton.setAttribute('disabled', true);
            
        } else {

            if (contactName.value.trim() === '') setErrorFor(contactName); else setSuccessFor(contactName);
    
            if (contactEmail.value.trim() === '') setErrorFor(contactEmail);
            else if (isValidEmail(contactEmail.value.trim())) setSuccessFor(contactEmail); else setErrorFor(contactEmail)
    
            if (contactMessage.value.trim() === '') setErrorFor(contactMessage); else setSuccessFor(contactMessage);
    
            if (valid) submitButton.removeAttribute('disabled')
            else submitButton.setAttribute('disabled', true);
        }
    }

    function setErrorFor(field) {

        field.parentElement.classList.add('error');
        field.parentElement.classList.remove('success');

        valid = false;
    }

    function setSuccessFor(field) {

        field.parentElement.classList.add('success');
        field.parentElement.classList.remove('error');
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}


// -------------------------------------------------------------------------------------------------
// HIDE AND REMOVE PRELOADER
// -------------------------------------------------------------------------------------------------

async function hideAndRemovePreloader() {

    const preloader = document.querySelector('.preloader');
    const overlay = document.querySelector('.preloader__overlay');
    const animation = document.querySelector('.preloader__animation');

    let timeLeft = Math.max(PRELOADER_MIN_TIME - (date.getTime() - startTime), 0);

    // wait until all loaded and minimum loading time is passed
    await new Promise((res) => setTimeout(res, timeLeft));

    // hide preloader
    animation.classList.add('hidden');
    overlay.classList.add('hidden');
    
    // remove preloader when hidden
    overlay.addEventListener('transitionend', () => {

        document.body.removeChild(preloader);
        console.log('Ready to go...');
    });
}

