document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const multiInput = document.getElementById('file-upload');

    if (form && multiInput) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(form);
            Array.from(multiInput.files).forEach((file, idx) => {
                const field = idx === 0 ? 'file' : idx === 1 ? 'file2' : 'file' + (idx + 1);
                fd.set(field, file);
            });
            fd.delete('files');

            fetch(form.action, {
                method: form.method,
                body: fd,
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) throw new Error();
                return response.text();
            })
            .then(() => {
                showSuccessMessage();
                form.reset();
                multiInput.value = '';
                document.getElementById('file-list').innerHTML = '';
                document.getElementById('file-count').style.display = 'none';
            })
            .catch(() => {
                alert('Ошибка отправки. Попробуйте позже.');
            });
        });
    }
});

function showSuccessMessage() {
    const successHTML = `
        <div id="successMessage" class="success-message" onclick="hideSuccessMessage()">
            <div class="success-content">
                <h3>Спасибо!</h3>
                <p>Ваше сообщение успешно отправлено</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function hideSuccessMessage() {
    const el = document.getElementById('successMessage');
    if (el) el.remove();
}

// Валидация полей ввода
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.contact-form [required]').forEach(input => {
        const errorEl = document.getElementById('error-' + input.name);
        input.addEventListener('input', () => {
            input.classList.remove('input-invalid');
            if (errorEl) errorEl.style.display = 'none';
        });
        input.addEventListener('invalid', e => {
            e.preventDefault();
            input.classList.add('input-invalid');
            if (errorEl) errorEl.style.display = 'block';
        });
    });

    const checkbox = document.getElementById('agreement');
    if (checkbox) {
        const errorCheckbox = document.getElementById('error-f_Agreement');
        checkbox.addEventListener('change', () => {
            checkbox.classList.remove('input-invalid-checkbox');
            if (errorCheckbox) errorCheckbox.style.display = 'none';
        });
        checkbox.addEventListener('invalid', e => {
            e.preventDefault();
            checkbox.classList.add('input-invalid-checkbox');
            if (errorCheckbox) errorCheckbox.style.display = 'block';
        });
    }

    // Обработка загрузки файлов
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
        const fileLabel = document.querySelector('.file-label');
        const fileCount = document.getElementById('file-count');
        const countSpan = document.getElementById('count');
        const fileList = document.getElementById('file-list');

        fileInput.addEventListener('change', function (e) {
            const files = Array.from(e.target.files);
            updateFileDisplay(files);
        });

        function updateFileDisplay(files) {
            if (files.length === 0) {
                if (fileLabel) fileLabel.classList.remove('has-files');
                if (fileCount) fileCount.style.display = 'none';
                if (fileList) fileList.innerHTML = '';
                return;
            }

            if (fileLabel) fileLabel.classList.add('has-files');
            if (fileCount) {
                fileCount.style.display = 'block';
                if (countSpan) countSpan.textContent = files.length;
            }

            if (fileList) {
                fileList.innerHTML = '';
                files.forEach((file, index) => {
                    const li = document.createElement('li');
                    li.className = 'file-item';

                    const fileName = document.createElement('span');
                    fileName.className = 'file-name';
                    fileName.textContent = file.name;

                    const fileSize = document.createElement('span');
                    fileSize.className = 'file-size';
                    fileSize.textContent = formatFileSize(file.size);

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'file-remove';
                    removeBtn.textContent = '×';
                    removeBtn.type = 'button';
                    removeBtn.onclick = () => removeFile(index);

                    li.appendChild(fileName);
                    li.appendChild(fileSize);
                    li.appendChild(removeBtn);
                    fileList.appendChild(li);
                });
            }
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function removeFile(index) {
            const dt = new DataTransfer();
            const files = Array.from(fileInput.files);
            files.forEach((file, i) => {
                if (i !== index) {
                    dt.items.add(file);
                }
            });
            fileInput.files = dt.files;
            updateFileDisplay(Array.from(dt.files));
        }
    }
});

// Кнопка скролла наверх
(function () {
    const btn = document.getElementById('scrollTop2');
    if (!btn) return;

    function updateScrollButton() {
        if (window.pageYOffset > 200) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateScrollButton();
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

// Плавная прокрутка для внутренних ссылок
document.addEventListener('DOMContentLoaded', function () {
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 120;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                smoothScrollTo(targetId);
            }
        });
    });
});

// ===== ИСПРАВЛЕННОЕ БУРГЕР-МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    const navBurger = document.querySelector('.nav-burger');
    const navLinks = document.querySelector('.nav-links');

    if (!navBurger || !navLinks) {
        console.warn('Бургер-меню или nav-links не найдены');
        return;
    }

    // Открытие/закрытие меню
    navBurger.addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем всплытие события
        navBurger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link-item').forEach(link => {
        link.addEventListener('click', function() {
            navBurger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        // Проверяем, что клик был вне nav-container и вне бургера
        if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
            navBurger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Закрытие меню при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 900) {
                navBurger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });
});

// Определение активной страницы в меню
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link-item');
    const currentPage = window.location.hash || '#home';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// ===== ИСПРАВЛЕННЫЙ СЛАЙДЕР ОТЗЫВОВ =====
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track-modern');
    const slides = document.querySelectorAll('.review-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!track || !slides.length) {
        console.warn('Слайдер отзывов не найден');
        return;
    }

    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();

    // Создаем точки для навигации
    const totalDots = Math.ceil(slides.length / slidesPerView);
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        if (dotsContainer) dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function getSlidesPerView() {
        if (window.innerWidth >= 1201) return 3;
        if (window.innerWidth >= 769) return 2;
        return 1;
    }

    function updateSlider() {
        slidesPerView = getSlidesPerView();
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 32;
        const offset = currentSlide * (slideWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Обновляем активную точку
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(slideIndex) {
        const maxSlide = Math.max(0, slides.length - slidesPerView);
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
        updateSlider();
    }

    function nextSlide() {
        const maxSlide = Math.max(0, slides.length - slidesPerView);
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }

    function prevSlide() {
        const maxSlide = Math.max(0, slides.length - slidesPerView);
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = maxSlide;
        }
        updateSlider();
    }

    // Обработчики событий
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Адаптивность при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            currentSlide = 0;
            updateSlider();
        }, 250);
    });

    // Автопрокрутка
    let autoSlide = setInterval(nextSlide, 5000);

    // Останавливаем автопрокрутку при наведении
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // Инициализация
    updateSlider();
});
