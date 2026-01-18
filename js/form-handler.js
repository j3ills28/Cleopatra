// Formular-Handler für Kontaktformular mit EmailJS

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Initialisiere EmailJS mit deiner User ID
        // ERSTELLE EIN KOSTENLOSES KONTO UNTER: https://www.emailjs.com/
        // DANACH SETZE DEINE EIGENE USER ID HIER EIN:
        emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Ersetze mit deinem Public Key!
        
        // Prüfe URL-Parameter für Produktreferenz
        checkUrlForProductReference();
        
        // Formular-Event-Listener
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Echtzeit-Validierung
        setupRealTimeValidation();
    }
});

// Prüfe URL auf Produktreferenz
function checkUrlForProductReference() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    
    if (product) {
        const productField = document.getElementById('product');
        const productReference = document.getElementById('productReference');
        
        if (productField) {
            productField.value = decodeURIComponent(product);
        }
        
        if (productReference) {
            productReference.innerHTML = `<strong>Ihre Anfrage bezieht sich auf:</strong> ${decodeURIComponent(product)}`;
            productReference.style.display = 'block';
            productReference.style.padding = '10px';
            productReference.style.backgroundColor = '#f8f9fa';
            productReference.style.borderRadius = '4px';
            productReference.style.marginBottom = '20px';
        }
    }
}

// Echtzeit-Validierung einrichten
function setupRealTimeValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const privacyInput = document.getElementById('privacy');
    
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
    
    if (subjectInput) {
        subjectInput.addEventListener('change', validateSubject);
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', validateMessage);
    }
    
    if (privacyInput) {
        privacyInput.addEventListener('change', validatePrivacy);
    }
}

// Validierungsfunktionen
function validateName() {
    const nameInput = document.getElementById('name');
    const errorElement = document.getElementById('nameError');
    const value = nameInput.value.trim();
    
    if (value.length < 2) {
        showError(nameInput, errorElement, 'Bitte geben Sie einen gültigen Namen ein (mindestens 2 Zeichen).');
        return false;
    } else {
        clearError(nameInput, errorElement);
        return true;
    }
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('emailError');
    const value = emailInput.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showError(emailInput, errorElement, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return false;
    } else {
        clearError(emailInput, errorElement);
        return true;
    }
}

function validateSubject() {
    const subjectInput = document.getElementById('subject');
    const errorElement = document.getElementById('subjectError');
    const value = subjectInput.value;
    
    if (!value) {
        showError(subjectInput, errorElement, 'Bitte wählen Sie einen Betreff aus.');
        return false;
    } else {
        clearError(subjectInput, errorElement);
        return true;
    }
}

function validateMessage() {
    const messageInput = document.getElementById('message');
    const errorElement = document.getElementById('messageError');
    const value = messageInput.value.trim();
    
    if (value.length < 10) {
        showError(messageInput, errorElement, 'Bitte geben Sie eine aussagekräftige Nachricht ein (mindestens 10 Zeichen).');
        return false;
    } else {
        clearError(messageInput, errorElement);
        return true;
    }
}

function validatePrivacy() {
    const privacyInput = document.getElementById('privacy');
    const errorElement = document.getElementById('privacyError');
    
    if (!privacyInput.checked) {
        showError(privacyInput, errorElement, 'Bitte stimmen Sie der Datenschutzerklärung zu.');
        return false;
    } else {
        clearError(privacyInput, errorElement);
        return true;
    }
}

// Fehler anzeigen/ausblenden
function showError(inputElement, errorElement, message) {
    inputElement.style.borderColor = '#e74c3c';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(inputElement, errorElement) {
    inputElement.style.borderColor = '#e9ecef';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Formular absenden
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validiere alle Felder
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    const isPrivacyValid = validatePrivacy();
    
    // Wenn alle Felder gültig sind
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid && isPrivacyValid) {
        // Zeige Ladeanimation
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('formSpinner');
        
        btnText.textContent = 'Wird gesendet...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Sammle Formulardaten
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            product: document.getElementById('product').value || 'Kein spezifisches Produkt',
            message: document.getElementById('message').value,
            page_url: window.location.href,
            timestamp: new Date().toLocaleString('de-DE')
        };
        
        // Sende E-Mail mit EmailJS
        // ERSTELLE ZUERST EIN TEMPLATE IN EMAILJS UND SETZE DIE IDs:
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Erfolgsmeldung anzeigen
                showFormMessage('Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden.', 'success');
                
                // Formular zurücksetzen
                contactForm.reset();
                
                // Button zurücksetzen
                btnText.textContent = 'Nachricht senden';
                spinner.classList.add('hidden');
                submitBtn.disabled = false;
                
                // Nachricht nach 5 Sekenden ausblenden
                setTimeout(() => {
                    const formMessage = document.getElementById('formMessage');
                    formMessage.style.display = 'none';
                }, 5000);
            }, function(error) {
                console.log('FAILED...', error);
                
                // Fehlermeldung anzeigen
                showFormMessage('Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.', 'error');
                
                // Button zurücksetzen
                btnText.textContent = 'Nachricht senden';
                spinner.classList.add('hidden');
                submitBtn.disabled = false;
            });
    } else {
        // Zeige allgemeine Fehlermeldung
        showFormMessage('Bitte überprüfen Sie Ihre Eingaben und füllen Sie alle Pflichtfelder korrekt aus.', 'error');
    }
}

// Formular-Nachricht anzeigen
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scrolle zur Nachricht
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}