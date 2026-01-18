// main.js - Hauptskript, lädt alle Module

// Warte bis DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM geladen - Initialisiere Anwendung');
    
    // Initialisiere alle Module
    initAllModules();
    
    // Globale Event Listener
    setupGlobalEvents();
});

// Initialisiere alle Anwendungsmodule
function initAllModules() {
    // Navigation wird automatisch von navigation.js initialisiert
    console.log('Navigation wird automatisch initialisiert');
    
    // FAQ Accordion initialisieren (falls auf Seite vorhanden)
    initFAQ();
    
    // Produktfilter initialisieren (falls auf Seite vorhanden)
    initProductFilter();
    
    // Smooth Scroll für interne Links
    initSmoothScroll();
    
    // Weitere Module können hier initialisiert werden...
}

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                // Toggle aktive Klasse für die Frage
                question.classList.toggle('active');
                
                // Toggle aktive Klasse für die Antwort
                const answer = question.nextElementSibling;
                answer.classList.toggle('active');
                
                // Schließe andere offene FAQs
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherQuestion.nextElementSibling.classList.remove('active');
                    }
                });
            });
        });
        
        console.log(`FAQ Accordion mit ${faqQuestions.length} Fragen initialisiert`);
    }
}

// Produktfilter
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Entferne aktive Klasse von allen Buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Füge aktive Klasse zum geklickten Button hinzu
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filtere Produkte
                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        console.log(`Produktfilter mit ${filterButtons.length} Buttons initialisiert`);
    }
}

// Smooth Scroll für interne Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Verwende Utils.smoothScrollTo wenn verfügbar
                if (typeof Utils !== 'undefined' && Utils.smoothScrollTo) {
                    Utils.smoothScrollTo(targetElement);
                } else {
                    // Fallback
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Globale Event Listener
function setupGlobalEvents() {
    // Sidebar Events abhören
    document.addEventListener('sidebarOpened', () => {
        console.log('Sidebar wurde geöffnet');
        // Hier können andere Aktionen ausgelöst werden
    });
    
    document.addEventListener('sidebarClosed', () => {
        console.log('Sidebar wurde geschlossen');
        // Hier können andere Aktionen ausgelöst werden
    });
    
    // Window Resize mit Debounce
    const handleResize = Utils.debounce(() => {
        console.log('Fenster wurde angepasst:', window.innerWidth, 'x', window.innerHeight);
        // Anpassungen bei Größenänderung
    }, 250);
    
    window.addEventListener('resize', handleResize);
}

// Globale Fehlerbehandlung
window.addEventListener('error', function(e) {
    console.error('Globaler Fehler:', e.error);
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unbehandelte Promise-Ablehnung:', e.reason);
});

// Debug-Hilfe: Zeige alle global verfügbaren Module
console.log('Verfügbare Module:', {
    Navigation: typeof Navigation !== 'undefined' ? '✅ Verfügbar' : '❌ Nicht verfügbar',
    Utils: typeof Utils !== 'undefined' ? '✅ Verfügbar' : '❌ Nicht verfügbar'
});