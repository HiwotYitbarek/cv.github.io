
        /* =========================================================
           Scroll reveal
        ========================================================= */

        const revealElements =
            document.querySelectorAll('.reveal');


        const observer =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add('visible');

                        }

                    });

                },

                {
                    threshold: 0.12
                }

            );


        revealElements.forEach(element => {

            observer.observe(element);

        });



        /* =========================================================
          Hero video
        ========================================================= */

        document.addEventListener('DOMContentLoaded', () => {
            const video = document.querySelector('.hero-video');

            if (!video) return;

            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;

            const startVideo = () => {
                video.play().catch(() => {

                });
            };

            startVideo();

            ['touchstart', 'click', 'scroll'].forEach(event => {
                window.addEventListener(event, startVideo, {
                    once: true,
                    passive: true
                });
            });
        });

        (function () {
            const video = document.querySelector('.hero-video');
            if (!video) return;

            
            video.muted = true;
            video.defaultMuted = true;

            const playVideo = () => {
       
                setTimeout(() => {
                    const promise = video.play();
                    if (promise !== undefined) {
                        promise.catch(() => {
                           
                            const startSilent = () => {
                                video.play();
                                window.removeEventListener('touchstart', startSilent);
                                window.removeEventListener('mousemove', startSilent);
                                window.removeEventListener('scroll', startSilent);
                            };

                            window.addEventListener('touchstart', startSilent, { once: true });
                            window.addEventListener('mousemove', startSilent, { once: true });
                            window.addEventListener('scroll', startSilent, { once: true });
                        });
                    }
                }, 300); // 300 millisecond delay
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', playVideo);
            } else {
                playVideo();
            }
        })();


        /* =========================================================
              Reduce motion 
           ========================================================= */

        const prefersReducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {

            document
                .querySelectorAll('.visual-track')
                .forEach(track => {

                    track.style.animation = 'none';

                });

        }


        /* =========================================================
           Language system 
        ========================================================= */

        let currentLang =
            localStorage.getItem('site_lang') || 'en';


        /* =========================================================
           Typewriter
        ========================================================= */

        class TxtRotate {

            constructor(el, period) {

                this.el = el;

                this.period =
                    parseInt(period, 10) || 2000;

                this.loopNum = 0;

                this.txt = '';

                this.isDeleting = false;

                this.toRotate = [];

                this.updateLanguage(currentLang);


                this.tick();
            }


            /* -----------------------------------------------------
               Change typewriter language 
            ----------------------------------------------------- */

            updateLanguage(lang) {

                const attribute =
                    `data-type-${lang}`;

                const data =
                    this.el.getAttribute(attribute);



                if (!data) {
                    console.warn(
                        `Missing ${attribute} on typewriter element`
                    );

                    return;
                }


                try {

                    this.toRotate =
                        JSON.parse(data);

                } catch (error) {

                    console.error(
                        `Invalid JSON in ${attribute}`,
                        error
                    );

                    return;
                }



                this.loopNum = 0;

                this.txt = '';

                this.isDeleting = false;



                this.el.innerHTML =
                    '<span class="wrap"></span>';
            }


            /* -----------------------------------------------------
               Typewriter animation 
            ----------------------------------------------------- */

            tick() {

                if (
                    !this.toRotate ||
                    this.toRotate.length === 0
                ) {
                    return;
                }


                const i =
                    this.loopNum %
                    this.toRotate.length;


                const fullTxt =
                    this.toRotate[i];


                if (!this.isDeleting) {

                    this.txt =
                        fullTxt.substring(
                            0,
                            this.txt.length + 1
                        );

                }


                else {

                    this.txt =
                        fullTxt.substring(
                            0,
                            this.txt.length - 1
                        );
                }
                this.el.innerHTML =
                    '<span class="wrap">' +
                    this.txt +
                    '</span>';

                let delta =
                    200 - Math.random() * 100;

                if (this.isDeleting) {
                    delta /= 2;
                }

                if (
                    !this.isDeleting &&
                    this.txt === fullTxt
                ) {

                    delta = this.period;

                    this.isDeleting = true;
                }

                else if (
                    this.isDeleting &&
                    this.txt === ''
                ) {

                    this.isDeleting = false;

                    this.loopNum++;

                    delta = 500;
                }

                setTimeout(() => {

                    this.tick();

                }, delta);
            }
        }


        /* =========================================================
           Store all typewriters 
        ========================================================= */

        const typewriters = [];


        /* =========================================================
           Set language 
        ========================================================= */

        function setLanguage(lang) {

            
            currentLang = lang;

            localStorage.setItem(
                'site_lang',
                lang
            );


            /* -----------------------------------------------------
               Normal translated elements 
            ----------------------------------------------------- */

            document
                .querySelectorAll('[data-en]')
                .forEach(el => {

                    const text =
                        el.getAttribute(
                            `data-${lang}`
                        );


                    if (text !== null) {

                        el.innerHTML = text;
                    }

                });


            /* -----------------------------------------------------
               Typewriters 
            ----------------------------------------------------- */

            typewriters.forEach(typewriter => {

                typewriter.updateLanguage(lang);

            });


            /* -----------------------------------------------------
               Language button
            ----------------------------------------------------- */

            const toggleBtn =
                document.getElementById(
                    'lang-toggle'
                );


            if (toggleBtn) {

                toggleBtn.textContent =
                    lang === 'en'
                        ? 'Dansk'
                        : 'English';
            }
        }


        /* =========================================================
           Initialize website 
        ========================================================= */

        document.addEventListener(
            'DOMContentLoaded',
            () => {


                /* -------------------------------------------------
                   Find all typewriters 
                ------------------------------------------------- */

                document
                    .querySelectorAll('.typewrite')
                    .forEach(el => {

                        const typewriter =
                            new TxtRotate(
                                el,
                                el.getAttribute(
                                    'data-period'
                                )
                            );


                        typewriters.push(
                            typewriter
                        );

                    });


                /* -------------------------------------------------
                   Language button 
                ------------------------------------------------- */

                const toggleBtn =
                    document.getElementById(
                        'lang-toggle'
                    );


                if (toggleBtn) {

                    toggleBtn.addEventListener(
                        'click',
                        () => {

                            const newLang =
                                currentLang === 'en'
                                    ? 'da'
                                    : 'en';


                            setLanguage(
                                newLang
                            );

                        }
                    );

                }


                setLanguage(
                    currentLang
                );

            }
        );


        /* =========================================================
           Typewriter cursor 
        ========================================================= */

        const cursorCSS =
            document.createElement('style');


        cursorCSS.type =
            'text/css';


        cursorCSS.innerHTML = `
    
        .typewrite > .wrap {
            border-right:
                0.08em solid var(--yellow);
    
            animation:
                blink-cursor 0.75s step-end infinite;
        }
    
        @keyframes blink-cursor {
    
            from,
            to {
                border-color: transparent;
            }
    
            50% {
                border-color: var(--yellow);
            }
    
        }
    
    `;


        document.head.appendChild(
            cursorCSS
        );






