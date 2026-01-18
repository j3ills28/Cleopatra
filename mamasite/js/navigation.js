// navigation.js - Verantwortlich für Sidebar-Navigation

// Öffentliche Variablen (können von main.js aus zugegriffen werden)
let isSidebarOpen = false;

// DOM-Elemente
let menuToggle, sidebarClose, navOverlay, navSidebar;

// Initialisiere Navigation
function initNavigation() {
    // DOM-Elemente selektieren
    menuToggle = document.getElementById('menuToggle');
    sidebarClose = document.getElementById('sidebarClose');
    navOverlay = document.getElementById('navOverlay');
    navSidebar = document.getElementById('navSidebar');
    
    if (!menuToggle || !navSidebar) {
        console.warn('Navigation-Elemente nicht gefunden');
        return;
    }
    
    // Event Listener hinzufügen
    setupEventListeners();
    
    // Aktive Seite hervorheben
    highlightCurrentPage();
    
    console.log('Navigation initialisiert');
}

// Event Listener einrichten
function setupEventListeners() {
    // Öffne Sidebar
    menuToggle.addEventListener('click', openSidebar);
    
    // Schließe Sidebar
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeSidebar);
    }
    
    // ESC-Taste zum Schließen
    document.addEventListener('keydown', handleKeyDown);
    
    // Schließe Sidebar bei Klick auf Nav-Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
}

// Sidebar öffnen
function openSidebar() {
    if (navOverlay && navSidebar) {
        navOverlay.classList.add('active');
        navSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        isSidebarOpen = true;
        
        // Event auslösen für andere Skripte
        document.dispatchEvent(new CustomEvent('sidebarOpened'));
    }
}

// Sidebar schließen
function closeSidebar() {
    if (navOverlay && navSidebar) {
        navOverlay.classList.remove('active');
        navSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
        isSidebarOpen = false;
        
        // Event auslösen für andere Skripte
        document.dispatchEvent(new CustomEvent('sidebarClosed'));
    }
}

// Tastatur-Event Handler
function handleKeyDown(e) {
    if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
    }
}

// Nav-Link Klick Handler
function handleNavLinkClick() {
    // Kurze Verzögerung für bessere UX
    setTimeout(closeSidebar, 300);
}

// Aktuelle Seite hervorheben
function highlightCurrentPage() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Hilfsfunktion: Aktuelle Seite ermitteln
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Öffentliche API (für andere Skripte zugänglich)
const Navigation = {
    // Methoden
    init: initNavigation,
    open: openSidebar,
    close: closeSidebar,
    highlightCurrentPage: highlightCurrentPage,
    
    // Getter für Status
    get isOpen() {
        return isSidebarOpen;
    },
    
    // Getter für DOM-Elemente (falls benötigt)
    get elements() {
        return {
            menuToggle,
            sidebarClose,
            navOverlay,
            navSidebar
        };
    }
};

// Automatisch initialisieren wenn DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
    });
} else {
    Navigation.init();
}

// Export für Module-System (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}