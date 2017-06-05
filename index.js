var keycode = require('keycode'),
    currentSection;

var hljs = require('highlight.js');

function getAllSections(){
    return Array.prototype.slice.call(document.querySelectorAll('section'));
}

function setCurrentSection(section){
    currentSection && currentSection.classList.remove('current');
    currentSection = section;
    currentSection.classList.add('current');
    saveState();
}

function saveState(){
    var sections = getAllSections();
    var currentSectionIndex = Math.max(sections.indexOf(currentSection), 0);
    window.localStorage.setItem('currentSection', currentSectionIndex);
}

function loadState(){
    var allSections = document.querySelectorAll('section');
        currentSectionIndex = Math.min(parseInt(window.localStorage.getItem('currentSection')) || 0, allSections.length - 1);

    setCurrentSection(allSections[currentSectionIndex]);
}

function nextSlide(){
    var current = currentSection || document.querySelector('section'),
        nextSection = current.nextElementSibling || current;

    setCurrentSection(nextSection);
}

function previousSlide(){
    var current = currentSection || document.querySelector('section'),
        previousSection = current.previousElementSibling || current;

    setCurrentSection(previousSection);
}
hljs.initHighlightingOnLoad();

window.addEventListener('DOMContentLoaded', function(){
    loadState();

    window.addEventListener('keydown', function(event){
        var key = keycode(event);
        event.preventDefault();

        if(key === 'left'){
            previousSlide();
        }

        if(~['right', 'enter', 'space'].indexOf(key)){
            nextSlide();
        }
    });

    window.addEventListener('click', function(event){
        // 20% border click moves to next/prev slide.

        var x = 1 / window.innerWidth * event.pageX - 0.5;
        x = (x < -0.3 || x > 0.3) ? x : 0;
        var y = 1 / window.innerHeight * event.pageY - 0.5;
        y = (y < -0.3 || y > 0.3) ? y : 0;

        var direction = (x + y) / 2;

        if(direction < 0){
            previousSlide();
        }else if(direction > 0){
            nextSlide();
        }
    });
});