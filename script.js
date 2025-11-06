// ============================================
// ASTROSTAY - Premium Interplanetary Travel
// Interactive JavaScript Functionality
// ============================================

// Starfield Animation
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    const stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
    
    // Animate stars
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create gradient for nebula effect
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width
        );
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(183, 148, 246, 0.05)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            // Move stars
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
            
            // Twinkle effect
            star.opacity += (Math.random() - 0.5) * 0.02;
            star.opacity = Math.max(0.3, Math.min(1, star.opacity));
        });
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
}

// Initialize starfield on load
window.addEventListener('DOMContentLoaded', initStarfield);

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to Booking Section
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Booking Form Price Calculation
const bookingForm = document.getElementById('booking-form');
const destinationSelect = document.getElementById('destination');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const travelersInput = document.getElementById('travelers');
const cabinClassSelect = document.getElementById('cabin-class');
const totalPriceDisplay = document.getElementById('total-price');

// Base prices per person per night
const basePrices = {
    luna: 1200,
    mars: 2000,
    orbit: 3500
};

// Class multipliers
const classMultipliers = {
    standard: 1.0,
    luxury: 1.5,
    elite: 2.25
};

// Calculate total price
function calculatePrice() {
    const destination = destinationSelect.value;
    const travelers = parseInt(travelersInput.value) || 1;
    const cabinClass = cabinClassSelect.value;
    
    // Get dates from calendar selection or hidden inputs
    let checkInDate, checkOutDate;
    
    if (selectedCheckIn && selectedCheckOut) {
        checkInDate = new Date(selectedCheckIn);
        checkOutDate = new Date(selectedCheckOut);
    } else if (checkinInput && checkoutInput && checkinInput.value && checkoutInput.value) {
        checkInDate = new Date(checkinInput.value);
        checkOutDate = new Date(checkoutInput.value);
    } else {
        totalPriceDisplay.textContent = '$0';
        return 0;
    }
    
    if (!destination || !checkInDate || !checkOutDate || checkInDate >= checkOutDate) {
        totalPriceDisplay.textContent = '$0';
        return 0;
    }
    
    // Calculate number of nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Get base price
    const basePrice = basePrices[destination];
    
    // Get multiplier
    const multiplier = classMultipliers[cabinClass];
    
    // Calculate total
    const total = nights * travelers * basePrice * multiplier;
    
    // Update display
    totalPriceDisplay.textContent = `$${total.toLocaleString()}`;
    
    return total;
}

// Add event listeners for real-time calculation
[destinationSelect, checkinInput, checkoutInput, travelersInput, cabinClassSelect].forEach(element => {
    if (element) {
        element.addEventListener('change', calculatePrice);
        element.addEventListener('input', calculatePrice);
    }
});

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
if (checkinInput) {
    checkinInput.setAttribute('min', today);
    checkinInput.addEventListener('change', function() {
        if (checkoutInput.value && this.value) {
            const minCheckout = new Date(this.value);
            minCheckout.setDate(minCheckout.getDate() + 1);
            checkoutInput.setAttribute('min', minCheckout.toISOString().split('T')[0]);
        }
    });
}

// Booking Form Submission
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const total = calculatePrice();
        
        if (total === 0) {
            alert('Please fill in all fields correctly to calculate your booking price.');
            return;
        }
        
        // Show confirmation
        alert(`Booking Confirmed!\n\nThank you for choosing AstroStay. Your reservation has been processed.\n\nTotal: $${total.toLocaleString()}\n\nWe'll send you a confirmation email shortly.`);
        
        // Reset form
        bookingForm.reset();
        totalPriceDisplay.textContent = '$0';
        
        // Reset destination cards
        document.querySelectorAll('.booking-destination-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset dates
        selectedCheckIn = null;
        selectedCheckOut = null;
        if (document.getElementById('checkin-display')) {
            document.getElementById('checkin-display').value = '';
        }
        if (document.getElementById('checkout-display')) {
            document.getElementById('checkout-display').value = '';
        }
        updateNightsDisplay();
    });
}


// Contact Form Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        
        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            contactForm.reset();
        }, 2000);
        
        // In a real application, you would send the data to a server here
        console.log('Contact form submitted:', { name, email, message });
    });
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.destination-card, .feature-tile');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax Effect on Scroll
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const hero = document.querySelector('.hero-content');
    
    if (hero) {
        const speed = scrollTop * 0.5;
        hero.style.transform = `translateY(${speed}px)`;
        hero.style.opacity = 1 - (scrollTop / 500);
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    }
    
    lastScrollTop = scrollTop;
});

// Keyboard navigation for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (destinationModal && destinationModal.classList.contains('active')) {
            closeDestinationModal();
        }
        if (calendarModal && calendarModal.classList.contains('active')) {
            closeCalendar();
        }
    }
});

// Initialize date inputs with today's date for better UX
window.addEventListener('DOMContentLoaded', function() {
    if (checkinInput && !checkinInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        checkinInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (checkoutInput && checkinInput && checkinInput.value) {
        const dayAfter = new Date(checkinInput.value);
        dayAfter.setDate(dayAfter.getDate() + 1);
        checkoutInput.value = dayAfter.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', dayAfter.toISOString().split('T')[0]);
    }
    
    // Trigger initial price calculation if form is partially filled
    if (destinationSelect && destinationSelect.value) {
        calculatePrice();
    }

    // Initialize destination card click handlers
    initDestinationCards();
    
    // Initialize booking form enhancements
    initBookingForm();
});

// ============================================
// Destination Overview Modal Functionality
// ============================================

// Destination Data Structure
const destinationsData = {
    luna: {
        name: "Luna Suites",
        tagline: "Earthrise Views & Lunar Luxury",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop",
        price: 1200,
        travelTime: "3 days",
        bestTime: "Year-round",
        capacity: "1-4 guests",
        rating: "5.0",
        description: "Experience the ultimate lunar getaway at Luna Suites, where Earthrise views meet unparalleled luxury. Our state-of-the-art facilities blend seamlessly with the moon's breathtaking landscape, offering guests an unforgettable interplanetary experience. Each suite features panoramic windows showcasing the Earth's majestic beauty, advanced gravity simulation technology, and world-class amenities designed for the most discerning travelers.",
        features: [
            "Earthrise View Suites with 360° panorama",
            "Customizable Gravity Spa (0.16g to 1.0g)",
            "Crater Dining Experience with molecular cuisine",
            "Lunar Observatory with professional telescopes",
            "Moonwalk Excursions with certified guides",
            "Underground Thermal Pools",
            "Starlight Meditation Chambers",
            "Zero-Gravity Recreation Room"
        ],
        amenities: [
            "AI Concierge Service",
            "Quantum Internet Access",
            "Oxygen Regulation System",
            "Emergency Teleportation Access",
            "Personalized Gravity Pods",
            "Climate-Controlled Environment",
            "Private Terraces",
            "In-Suite Spa Facilities"
        ],
        experiences: [
            {
                title: "Crater Hiking Adventure",
                description: "Explore the Moon's most spectacular craters with our expert guides. Experience the unique lunar terrain and witness breathtaking views of the cosmos."
            },
            {
                title: "Earthrise Photography Session",
                description: "Capture the iconic Earthrise from the Moon's surface. Professional photography equipment and guidance included."
            },
            {
                title: "Lunar Wine Tasting",
                description: "Enjoy rare vintages in our exclusive crater dining facility, featuring wines specially preserved for space travel."
            },
            {
                title: "Zero-Gravity Stargazing",
                description: "Float among the stars in our zero-gravity observation deck, equipped with advanced telescopes for cosmic exploration."
            }
        ]
    },
    mars: {
        name: "Mars Haven",
        tagline: "Red-Dust Luxury Domes & AI Concierge",
        image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop",
        price: 2000,
        travelTime: "7 months",
        bestTime: "Martian Summer (18 months)",
        capacity: "2-6 guests",
        rating: "4.9",
        description: "Mars Haven represents the pinnacle of Martian hospitality, combining rugged planetary beauty with exceptional luxury. Our luxury domes are engineered to perfection, offering complete protection from Mars' harsh environment while providing stunning views of the red planet's unique landscape. Experience the thrill of being on another world while enjoying Earth-class comfort and service.",
        features: [
            "Luxury Pressure Domes with 360° views",
            "Advanced Life Support Systems",
            "AI Butler (AstroBot) in every suite",
            "Martian Rover Tours",
            "Red Planet Observatory",
            "Underground Greenhouse Gardens",
            "Martian Geology Lab Access",
            "Private Space Suit Fitting Rooms"
        ],
        amenities: [
            "24/7 AI Concierge (AstroBot)",
            "Martian Atmosphere Simulation",
            "Advanced Water Recycling",
            "Emergency Life Support",
            "Interplanetary Communication Hub",
            "Climate-Controlled Domes",
            "Private Terraces with Red Dust Filters",
            "In-Dome Recreational Facilities"
        ],
        experiences: [
            {
                title: "Mars Rover Expedition",
                description: "Journey across the Martian surface in our custom-built rovers. Visit ancient riverbeds, volcanic formations, and potential life-sign sites."
            },
            {
                title: "Olympus Mons Base Camp",
                description: "Camp at the base of the solar system's largest volcano. Experience Martian sunsets and sunrises like never before."
            },
            {
                title: "Martian Agriculture Tour",
                description: "Explore our advanced greenhouse facilities where we grow Earth crops in Martian soil, learning about sustainable space agriculture."
            },
            {
                title: "Phobos & Deimos Observation",
                description: "Witness Mars' two moons through our advanced observatory. Learn about their unique orbits and future exploration missions."
            }
        ]
    },
    orbit: {
        name: "Orbital Resort",
        tagline: "Zero-G Suites & Spacewalk Balcony",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=800&fit=crop",
        price: 3500,
        travelTime: "2 hours",
        bestTime: "Year-round",
        capacity: "1-8 guests",
        rating: "5.0",
        description: "Orbital Resort offers the most exclusive experience in space travel - complete weightlessness in absolute luxury. Floating 400 kilometers above Earth, our zero-gravity suites provide uninterrupted views of our home planet and the cosmos beyond. Experience what it truly means to be an astronaut while enjoying the finest amenities space has to offer.",
        features: [
            "Zero-Gravity Living Pods",
            "Private Spacewalk Balconies",
            "360° Earth Observation Deck",
            "Orbital Spa with Float Therapy",
            "Quantum Cuisine Restaurant",
            "Space Station Gym (Zero-G)",
            "Astronaut Training Simulator",
            "Satellite Communication Center"
        ],
        amenities: [
            "Real-Time Space Weather Monitoring",
            "Zero-Gravity Sleep Pods",
            "Advanced Life Support",
            "Earth-to-Orbit Communication",
            "Emergency Re-entry Capsules",
            "Space Suit Collection",
            "Private Observation Domes",
            "Interstellar Entertainment System"
        ],
        experiences: [
            {
                title: "Spacewalk Experience",
                description: "Step outside the station in a fully pressurized space suit. Float alongside the station while Earth rotates below you. Guided by certified spacewalk instructors."
            },
            {
                title: "Orbital Sunrise & Sunset",
                description: "Witness 16 sunrises and sunsets in a single day from our observation deck. Each more spectacular than the last as you orbit Earth every 90 minutes."
            },
            {
                title: "Zero-Gravity Dining",
                description: "Dine in complete weightlessness at our Quantum Cuisine restaurant. Experience molecular gastronomy designed specifically for zero-gravity environments."
            },
            {
                title: "Earth from Above Photography",
                description: "Capture stunning photographs of Earth from space. Professional equipment and guidance to help you capture the perfect shot of continents, oceans, and weather systems."
            }
        ]
    }
};

// Destination Modal Elements
const destinationModal = document.getElementById('destination-modal');
const destinationClose = document.querySelector('.destination-close');
let currentDestinationKey = null;

// Initialize Destination Card Click Handlers
function initDestinationCards() {
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('click', function() {
            const destinationKey = this.getAttribute('data-destination');
            if (destinationKey && destinationsData[destinationKey]) {
                openDestinationModal(destinationKey);
            }
        });
    });
}

// Open Destination Modal
function openDestinationModal(destinationKey) {
    if (!destinationsData[destinationKey]) return;
    
    currentDestinationKey = destinationKey;
    const dest = destinationsData[destinationKey];
    
    // Set hero image
    const heroImage = document.getElementById('destination-hero-image');
    if (heroImage) {
        heroImage.style.backgroundImage = `url(${dest.image})`;
    }
    
    // Set basic info
    document.getElementById('destination-name').textContent = dest.name;
    document.getElementById('destination-tagline').textContent = dest.tagline;
    document.getElementById('destination-price-value').textContent = `$${dest.price.toLocaleString()}`;
    document.getElementById('destination-travel-time').textContent = dest.travelTime;
    document.getElementById('destination-best-time').textContent = dest.bestTime;
    document.getElementById('destination-capacity').textContent = dest.capacity;
    document.getElementById('destination-rating').textContent = `${dest.rating} / 5.0`;
    
    // Set description
    document.getElementById('destination-description-text').textContent = dest.description;
    
    // Set features
    const featuresList = document.getElementById('destination-features-list');
    featuresList.innerHTML = '';
    dest.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Set amenities
    const amenitiesGrid = document.getElementById('destination-amenities-grid');
    amenitiesGrid.innerHTML = '';
    dest.amenities.forEach(amenity => {
        const div = document.createElement('div');
        div.className = 'amenity-item';
        div.textContent = amenity;
        amenitiesGrid.appendChild(div);
    });
    
    // Set experiences
    const experiencesList = document.getElementById('destination-experiences-list');
    experiencesList.innerHTML = '';
    dest.experiences.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'experience-item';
        const h4 = document.createElement('h4');
        h4.textContent = exp.title;
        const p = document.createElement('p');
        p.textContent = exp.description;
        div.appendChild(h4);
        div.appendChild(p);
        experiencesList.appendChild(div);
    });
    
    // Show modal
    if (destinationModal) {
        destinationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Destination Modal
function closeDestinationModal() {
    if (destinationModal) {
        destinationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    currentDestinationKey = null;
}

// Book from Destination Modal
function bookFromDestination() {
    if (!currentDestinationKey) return;
    
    // Pre-fill booking form
    if (destinationSelect) {
        destinationSelect.value = currentDestinationKey;
    }
    
    // Close modal
    closeDestinationModal();
    
    // Scroll to booking form
    setTimeout(() => {
        scrollToBooking();
        // Trigger price calculation
        calculatePrice();
    }, 300);
}

// Event Listeners for Destination Modal
if (destinationClose) {
    destinationClose.addEventListener('click', closeDestinationModal);
}

if (destinationModal) {
    destinationModal.addEventListener('click', function(e) {
        if (e.target === destinationModal) {
            closeDestinationModal();
        }
    });
}

// ============================================
// Enhanced Booking Form Functionality
// ============================================

// Destination Selection Cards
function initBookingForm() {
    // Initialize destination cards
    const bookingDestCards = document.querySelectorAll('.booking-destination-card');
    bookingDestCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            bookingDestCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            // Update hidden select
            const destination = this.getAttribute('data-destination');
            if (destinationSelect) {
                destinationSelect.value = destination;
                calculatePrice();
            }
        });
    });
    
    // Initialize calendar
    initCalendar();
}

// Calendar Functionality
const calendarModal = document.getElementById('calendar-modal');
const calendarGrid = document.getElementById('calendar-grid');
const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarPrevBtn = document.getElementById('calendar-prev-month');
const calendarNextBtn = document.getElementById('calendar-next-month');
const calendarClose = document.querySelector('.calendar-close');
const calendarClearBtn = document.getElementById('calendar-clear');

let currentCalendarDate = new Date();
let currentCalendarTarget = null; // 'checkin' or 'checkout'
let selectedCheckIn = null;
let selectedCheckOut = null;

function initCalendar() {
    // Calendar trigger buttons
    const calendarTriggers = document.querySelectorAll('.calendar-trigger');
    calendarTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            openCalendar(target);
        });
    });
    
    // Date display inputs (clickable)
    const dateDisplays = document.querySelectorAll('.date-display');
    dateDisplays.forEach(display => {
        display.addEventListener('click', function() {
            const id = this.id;
            if (id.includes('checkin')) {
                openCalendar('checkin');
            } else if (id.includes('checkout')) {
                openCalendar('checkout');
            }
        });
    });
    
    // Calendar navigation
    if (calendarPrevBtn) {
        calendarPrevBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (calendarNextBtn) {
        calendarNextBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // Calendar close
    if (calendarClose) {
        calendarClose.addEventListener('click', closeCalendar);
    }
    
    if (calendarModal) {
        calendarModal.addEventListener('click', function(e) {
            if (e.target === calendarModal) {
                closeCalendar();
            }
        });
    }
    
    // Clear button
    if (calendarClearBtn) {
        calendarClearBtn.addEventListener('click', function() {
            if (currentCalendarTarget === 'checkin') {
                selectedCheckIn = null;
                if (checkinInput) checkinInput.value = '';
                if (document.getElementById('checkin-display')) {
                    document.getElementById('checkin-display').value = '';
                }
            } else if (currentCalendarTarget === 'checkout') {
                selectedCheckOut = null;
                if (checkoutInput) checkoutInput.value = '';
                if (document.getElementById('checkout-display')) {
                    document.getElementById('checkout-display').value = '';
                }
            }
            renderCalendar();
            updateNightsDisplay();
            calculatePrice();
        });
    }
    
    // Initial render
    renderCalendar();
}

function openCalendar(target) {
    currentCalendarTarget = target;
    
    // Set calendar date to selected date or today
    if (target === 'checkin' && selectedCheckIn) {
        currentCalendarDate = new Date(selectedCheckIn);
    } else if (target === 'checkout' && selectedCheckOut) {
        currentCalendarDate = new Date(selectedCheckOut);
    } else {
        currentCalendarDate = new Date();
    }
    
    renderCalendar();
    
    if (calendarModal) {
        calendarModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCalendar() {
    if (calendarModal) {
        calendarModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function renderCalendar() {
    if (!calendarGrid || !calendarMonthYear) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Clear grid
    calendarGrid.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if date is in the past
        if (date < today) {
            dayCell.classList.add('disabled');
        } else {
            // Check if it's today
            if (date.getTime() === today.getTime()) {
                dayCell.classList.add('today');
            }
            
            // Check if selected
            if (selectedCheckIn && dateToString(date) === selectedCheckIn) {
                dayCell.classList.add('selected', 'range-start');
            } else if (selectedCheckOut && dateToString(date) === selectedCheckOut) {
                dayCell.classList.add('selected', 'range-end');
            } else if (selectedCheckIn && selectedCheckOut) {
                const checkInDate = new Date(selectedCheckIn);
                const checkOutDate = new Date(selectedCheckOut);
                if (date > checkInDate && date < checkOutDate) {
                    dayCell.classList.add('in-range');
                }
            }
            
            // Add click handler
            dayCell.addEventListener('click', function() {
                selectDate(date);
            });
        }
        
        calendarGrid.appendChild(dayCell);
    }
}

function selectDate(date) {
    const dateStr = dateToString(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Can't select past dates
    
    if (currentCalendarTarget === 'checkin') {
        selectedCheckIn = dateStr;
        if (checkinInput) checkinInput.value = dateStr;
        if (document.getElementById('checkin-display')) {
            document.getElementById('checkin-display').value = formatDateDisplay(date);
        }
        
        // If check-out is before check-in, clear it
        if (selectedCheckOut && new Date(selectedCheckOut) <= date) {
            selectedCheckOut = null;
            if (checkoutInput) checkoutInput.value = '';
            if (document.getElementById('checkout-display')) {
                document.getElementById('checkout-display').value = '';
            }
        }
        
        // Auto-advance to checkout if check-in is selected
        setTimeout(() => {
            if (selectedCheckIn && !selectedCheckOut) {
                currentCalendarTarget = 'checkout';
                const nextMonth = new Date(date);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                currentCalendarDate = nextMonth;
                renderCalendar();
            } else {
                closeCalendar();
            }
        }, 300);
    } else if (currentCalendarTarget === 'checkout') {
        if (selectedCheckIn && new Date(dateStr) <= new Date(selectedCheckIn)) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        selectedCheckOut = dateStr;
        if (checkoutInput) checkoutInput.value = dateStr;
        if (document.getElementById('checkout-display')) {
            document.getElementById('checkout-display').value = formatDateDisplay(date);
        }
        
        closeCalendar();
    }
    
    renderCalendar();
    updateNightsDisplay();
    calculatePrice();
}

function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}

function updateNightsDisplay() {
    const nightsDisplay = document.getElementById('nights-display');
    const nightsCount = document.getElementById('nights-count');
    
    if (selectedCheckIn && selectedCheckOut) {
        const checkIn = new Date(selectedCheckIn);
        const checkOut = new Date(selectedCheckOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nightsDisplay && nightsCount) {
            nightsCount.textContent = nights;
            nightsDisplay.style.display = 'block';
        }
    } else {
        if (nightsDisplay) {
            nightsDisplay.style.display = 'none';
        }
    }
}



