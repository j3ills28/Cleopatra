// gallery.js - Modulare Version

(function() {
    'use strict';
    
    // Private Variablen
    let lightbox = null;
    
    // Initialisiere Galerie
    function initGallery() {
        const productImages = document.querySelectorAll('.product-image img');
        
        if (productImages.length > 0) {
            setupLightbox();
            
            productImages.forEach(img => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', function() {
                    openLightbox(this.src, this.alt);
                });
            });
            
            console.log(`Galerie mit ${productImages.length} Bildern initialisiert`);
        }
    }
    
    // Lightbox einrichten
    function setupLightbox() {
        if (!document.getElementById('lightbox')) {
            createLightboxHTML();
            setupLightboxEvents();
        }
    }
    
    // Lightbox HTML erstellen
    function createLightboxHTML() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img id="lightbox-img" src="" alt="">
                    <div id="lightbox-caption"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        addLightboxStyles();
    }
    
    // Lightbox Styles hinzufügen
    function addLightboxStyles() {
        if (!document.getElementById('lightbox-styles')) {
            const style = document.createElement('style');
            style.id = 'lightbox-styles';
            style.textContent = `
                .lightbox {
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                
                #lightbox-img {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                
                #lightbox-caption {
                    color: white;
                    text-align: center;
                    padding: 10px;
                    font-size: 1.1rem;
                }
                
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: -10px;
                    color: white;
                    font-size: 2rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                
                .lightbox-close:hover {
                    color: #c0c0c0;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Lightbox Events einrichten
    function setupLightboxEvents() {
        lightbox = document.getElementById('lightbox');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                    closeLightbox();
                }
            });
        }
    }
    
    // Lightbox öffnen
    function openLightbox(imgSrc, imgAlt) {
        if (!lightbox) setupLightbox();
        
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        if (lightboxImg && lightboxCaption) {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightboxCaption.textContent = imgAlt;
            lightbox.style.display = 'flex';
            
            // Sidebar schließen wenn offen
            if (typeof Navigation !== 'undefined' && Navigation.isOpen) {
                Navigation.close();
            }
        }
    }
    
    // Lightbox schließen
    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = 'none';
        }
    }
    
    // Öffentliche API
    const Gallery = {
        init: initGallery,
        open: openLightbox,
        close: closeLightbox
    };
    
    // Automatisch initialisieren
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            Gallery.init();
        });
    } else {
        Gallery.init();
    }
    
    // Export
    window.Gallery = Gallery;
    
})();