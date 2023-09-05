
const wrapper = document.querySelector('.wrapper');
const carousal = document.querySelector('.carousal');
const buttons = document.querySelectorAll(".wrapper button");
const firstCardWidth = document.querySelector(".card").offsetWidth;
const carousalChildrens = [...carousal.children];

let isDragging = false, startX, startScrollLeft, timeOutId;
let currentIndex = 0;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousal.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinte scrolling
carousalChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousal.insertAdjacentHTML('afterbegin', card.outerHTML)
});

// Insert copies of the first few cards to beginning of carousel for infinte scrolling
carousalChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousal.insertAdjacentHTML('beforeend', card.outerHTML)
});

// add event listeners for the navigation buttons to scroll the carousel left and right
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // console.log(btn.id);
        carousal.scrollLeft += btn.id === 'prevButton' ? -firstCardWidth : firstCardWidth;

      
    });

});



const dragStart = (e) => {
    isDragging = true;
    carousal.classList.add("dragging");

    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousal.scrollLeft;
}

const dragging = (e) => {
    // console.log(e.pageX);

    if (!isDragging) return;  // if isDragging is false return from here

    carousal.scrollLeft = e.pageX;

    // Updates the scroll position of the carousel based on the cursor movement
    carousal.scrollLeft = startScrollLeft - (e.pageX - startX);

}

const dragStop = (e) => {
    isDragging = false;
    carousal.classList.remove("dragging");
}


const autoPlay = () =>{
    if(window.innerWidth < 800) return; // return if window is smaller than 800 

    // Autoplay the carousel after every 2500 ms
    timeOutId = setTimeout(() => carousal.scrollLeft += firstCardWidth, 2500)
}

autoPlay();

const infiniteScroll = () => {

    // if the carousel is at the beinning, scroll to the end
    if (carousal.scrollLeft === 0) {
        // console.log("you have reached to the left end");
        carousal.classList.add("no-animation");
        carousal.scrollLeft = carousal.scrollWidth - (2 * carousal.offsetWidth);
        carousal.classList.remove("no-animation");
    }

    // if the carousel is at the beinning, scroll to the beginning
    else if (Math.ceil(carousal.scrollLeft) === carousal.scrollWidth - carousal.offsetWidth) {
        // console.log("you have reached to the right end");
        carousal.classList.add("no-animation");
        carousal.scrollLeft = carousal.offsetWidth;
        carousal.classList.remove("no-animation");
    }

//clear existing timeOut & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeOutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousal.addEventListener("mousedown", dragStart);
carousal.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousal.addEventListener("scroll", infiniteScroll);

wrapper.addEventListener("mouseenter", () => clearTimeout(timeOutId));
wrapper.addEventListener("mouseleave", autoPlay);

