import getPokemon from "./pokemon"

const app = {
    pages: [],
    show: new Event('show'),
    init: function(){
        // Animation event
        app.pages = document.querySelectorAll('.dynamic-header');
        app.pages.forEach((pg) => {
            pg.addEventListener('show', app.pageShown);
        })

        // Set active link
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', app.setActiveLink)
        })

        // 
        if (!location.hash) {
            location.hash = '#about'
        }

        // Init content
        app.getContent();

        // History popstate
        window.addEventListener('popstate', app.popState);
    },
    fetchFile: function(fragmentId, callback) {

        if(fragmentId === 'pokemon'){
            getPokemon('jigglypuff')
            .then(function(value){
                callback(value);
            })
        }
        else {
            fetch('content/' + fragmentId + '.html')
            .then(function(response){
                    return response.text()
            })
            .then(function(value){
                callback(value);
            });
        }
    },
    getContent: function(){
        var mainContent = document.getElementById('main');
        let fragmentId = location.hash.substr(1);
        app.fetchFile(fragmentId, function(content){
            mainContent.innerHTML = content;
        });
    },
    setActiveLink: function(ev){
        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(currentPage).classList.add('active');
        history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(currentPage).dispatchEvent(app.show);
        app.getContent();
    },
    // Update dynamic content
    nav: function(ev){
        return 0;
    },
    pageShown: function(ev){
        let pokemon = ev.target.querySelectorAll('.header-img')[1]
        pokemon.classList.add('img-flip');
        setTimeout((poke) => {
            poke.classList.remove('img-flip')
        }, 1000, pokemon); 
    },
    popState: function(ev){
        console.log(location.hash, 'popstate event');
        let hash = location.hash.replace('#','');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        document.getElementById(hash).dispatchEvent(app.show);
        app.getContent();
    }
}

document.addEventListener('DOMContentLoaded', app.init)