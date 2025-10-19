document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('contactForm');
            const multiInput = document.getElementById('file-upload');

            form.addEventListener('submit', e => {
                e.preventDefault();

                const fd = new FormData(form);
                Array.from(multiInput.files).forEach((file, idx) => {
                    const field = idx === 0 ? 'file' :
                        idx === 1 ? 'file2' :
                            'file' + (idx + 1);
                    fd.set(field, file);
                });
                // убираем поле multiple, если нужно
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
        });

        // функция показа оверлея в том же виде, что у вас раньше
        function showSuccessMessage() {
            const successHTML = `
   <div class="success-message" id="successMessage">
    <div class="success-content">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"
                stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>Заявка успешно отправлена!</h3>
      <p>Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
      <button class="success-close" onclick="hideSuccessMessage()">Хорошо</button>
    </div>
  </div>`;
            document.body.insertAdjacentHTML('beforeend', successHTML);
        }

        function hideSuccessMessage() {
            const el = document.getElementById('successMessage');
            if (el) el.remove();
        }

document.addEventListener('DOMContentLoaded', function () {
            const feedbackBtn = document.getElementById('feedbackBtn');
            const feedbackModal = document.getElementById('feedbackModal');
            const feedbackClose = document.getElementById('feedbackClose');
            const feedbackForm = document.getElementById('feedbackForm');
            const feedbackIframe = document.getElementById('feedback_iframe');

            // Открытие модального окна с анимацией
            feedbackBtn.addEventListener('click', function () {
                feedbackModal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Блокируем скролл
            });

            // Закрытие модального окна
            function closeFeedbackModal() {
                feedbackModal.classList.remove('show');
                document.body.style.overflow = ''; // Возвращаем скролл
                // Очищаем форму
                feedbackForm.reset();
                clearFeedbackFileDisplay();
                clearFeedbackValidation();
            }

            feedbackClose.addEventListener('click', closeFeedbackModal);

            // Закрытие по клику на фон
            feedbackModal.addEventListener('click', function (e) {
                if (e.target === feedbackModal) {
                    closeFeedbackModal();
                }
            });

            // Закрытие по ESC
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && feedbackModal.classList.contains('show')) {
                    closeFeedbackModal();
                }
            });

            // Валидация полей формы в модальном окне
            document.querySelectorAll('.feedback-form [required]').forEach(input => {
                const fieldName = input.name;
                const errorEl = document.getElementById('feedback-error-' + fieldName);

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

            function clearFeedbackValidation() {
                document.querySelectorAll('.feedback-form .input-invalid').forEach(el => {
                    el.classList.remove('input-invalid');
                });
                document.querySelectorAll('.feedback-form .error-text').forEach(el => {
                    el.style.display = 'none';
                });
            }

            // Обработка файлов в модальном окне
            const feedbackFileInput = document.getElementById('feedback-file-upload');
            const feedbackFileLabel = feedbackFileInput.nextElementSibling;
            const feedbackFileCount = document.getElementById('feedback-file-count');
            const feedbackCountSpan = document.getElementById('feedback-count');
            const feedbackFileList = document.getElementById('feedback-file-list');

            feedbackFileInput.addEventListener('change', function (e) {
                const files = Array.from(e.target.files);
                updateFeedbackFileDisplay(files);
            });

            function updateFeedbackFileDisplay(files) {
                if (files.length === 0) {
                    feedbackFileLabel.classList.remove('has-files');
                    feedbackFileCount.style.display = 'none';
                    feedbackFileList.innerHTML = '';
                    return;
                }

                feedbackFileLabel.classList.add('has-files');
                feedbackFileCount.style.display = 'block';
                feedbackCountSpan.textContent = files.length;

                feedbackFileList.innerHTML = '';
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
                    removeBtn.onclick = () => removeFeedbackFile(index);

                    li.appendChild(fileName);
                    li.appendChild(fileSize);
                    li.appendChild(removeBtn);
                    feedbackFileList.appendChild(li);
                });
            }

            function removeFeedbackFile(index) {
                const dt = new DataTransfer();
                const files = Array.from(feedbackFileInput.files);

                files.forEach((file, i) => {
                    if (i !== index) {
                        dt.items.add(file);
                    }
                });

                feedbackFileInput.files = dt.files;
                updateFeedbackFileDisplay(Array.from(dt.files));
            }

            function clearFeedbackFileDisplay() {
                feedbackFileLabel.classList.remove('has-files');
                feedbackFileCount.style.display = 'none';
                feedbackFileList.innerHTML = '';
            }

            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }

            // Отправка формы в модальном окне
            feedbackForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = new FormData(feedbackForm);
                const files = Array.from(feedbackFileInput.files);

                // Преобразуем файлы в нужный формат
                files.forEach((file, idx) => {
                    const fieldName = idx === 0 ? 'file' :
                        idx === 1 ? 'file2' :
                            'file' + (idx + 1);
                    formData.set(fieldName, file);
                });
                formData.delete('files');

                // Отправляем через fetch
                fetch(feedbackForm.action, {
                    method: feedbackForm.method,
                    body: formData,
                    credentials: 'include'
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.text();
                    })
                    .then(() => {
                        closeFeedbackModal();
                        showSuccessMessage();
                    })
                    .catch(() => {
                        alert('Ошибка отправки. Попробуйте позже.');
                    });
            });
        });

document.addEventListener('DOMContentLoaded', function () {
            // Определяем, мобильное ли устройство
            function isMobile() {
                return window.innerWidth <= 1408;
            }

            // Валидация полей ввода
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

            // Валидация чекбокса
            const checkbox = document.getElementById('agreement');
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

            // Обработка загрузки файлов
            const fileInput = document.getElementById('file-upload');
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
                    fileLabel.classList.remove('has-files');
                    fileCount.style.display = 'none';
                    fileList.innerHTML = '';
                    return;
                }

                fileLabel.classList.add('has-files');
                fileCount.style.display = 'block';
                countSpan.textContent = files.length;

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

            // Обработка клика по услугам
            const serviceCards = document.querySelectorAll('.service-card');
            const serviceDescriptions = document.querySelectorAll('.service-description');

            serviceCards.forEach(card => {
                card.addEventListener('click', function () {
                    const serviceId = this.getAttribute('data-service');

                    if (isMobile()) {
                        // Мобильная логика
                        const mobileDescription = document.getElementById('mobile-' + 'description-' + serviceId);
                        const isActive = this.classList.contains('active');

                        // Закрываем все мобильные описания и убираем активный класс со всех карточек
                        serviceCards.forEach(c => {
                            c.classList.remove('active');
                            const mobileDesc = c.querySelector('.mobile-service-description');
                            if (mobileDesc) {
                                mobileDesc.style.display = 'none';
                            }
                        });

                        // Если карточка не была активна, открываем соответствующее описание
                        if (!isActive && mobileDescription) {
                            this.classList.add('active');
                            mobileDescription.style.display = 'block';
                            const img = this.querySelector('img');
                            if (img) {
                                img.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    } else {
                        // Десктопная логика
                        const targetDescription = document.getElementById('description-' + serviceId);
                        const isActive = this.classList.contains('active');

                        // Закрываем все описания и убираем активный класс со всех карточек
                        serviceCards.forEach(c => c.classList.remove('active'));
                        serviceDescriptions.forEach(desc => desc.classList.remove('active'));

                        // Если карточка не была активна, открываем соответствующее описание
                        if (!isActive && targetDescription) {
                            this.classList.add('active');
                            targetDescription.classList.add('active');
                            // Плавная прокрутка к картинке услуги
                            const img = this.querySelector('img');
                            if (img) {
                                img.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }
                });
            });

            // Обработка изменения размера окна
            // Отслеживание размеров для определения реального изменения размера
            let previousWidth = window.innerWidth;
            let resizeTimeout;

            // Обработка изменения размера окна с задержкой
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimeout);

                resizeTimeout = setTimeout(() => {
                    const currentWidth = window.innerWidth;

                    // Закрываем описания только если изменилась ширина экрана (поворот устройства)
                    // а не при скролле, который меняет только высоту
                    if (Math.abs(currentWidth - previousWidth) > 50) {
                        // Закрываем все активные описания при значительном изменении ширины
                        serviceCards.forEach(c => {
                            c.classList.remove('active');
                            const mobileDesc = c.querySelector('.mobile-service-description');
                            if (mobileDesc) {
                                mobileDesc.style.display = 'none';
                            }
                        });
                        serviceDescriptions.forEach(desc => desc.classList.remove('active'));

                        // Обновляем сохраненную ширину
                        previousWidth = currentWidth;
                    }
                }, 200); // 200ms задержка чтобы избежать множественных срабатываний
            });

        });

(function () {
            var btn = document.getElementById('scrollTop2');

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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Улучшенная плавная прокрутка для внутренних ссылок
            function smoothScrollTo(target) {
                const element = document.querySelector(target);
                if (element) {
                    const offsetTop = element.offsetTop - 20; // отступ 20px сверху
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }

            // Ждем полной загрузки DOM
            document.addEventListener('DOMContentLoaded', function () {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        if (targetId && targetId !== '#') {
                            smoothScrollTo(targetId);
                        }
                    });
                });
            });

            // Дополнительная проверка для случая, если DOM уже загружен
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initSmoothScroll);
            } else {
                initSmoothScroll();
            }

            function initSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        if (targetId && targetId !== '#') {
                            smoothScrollTo(targetId);
                        }
                    });
                });
            }
        })();

document.addEventListener('DOMContentLoaded', function() {
    const navBurger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    
    // Открытие/закрытие меню
    navBurger.addEventListener('click', function() {
        navBurger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navBurger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.top-nav-menu')) {
            navBurger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

(function () {
            var form = document.getElementById('contactForm');
            var iframe = document.querySelector('iframe[name="hidden_iframe"]');

            // Обработка отправки формы
            form.addEventListener('submit', function () {
                // После отправки — слушаем загрузку iframe
                iframe.addEventListener('load', onIframeLoad);
            });

            function onIframeLoad() {
                showSuccessMessage();
                form.reset(); // Очистить форму

                // Очищаем отображение файлов
                document.querySelector('.file-label').classList.remove('has-files');
                document.getElementById('file-count').style.display = 'none';
                document.getElementById('file-list').innerHTML = '';

                // Убираем слушатель, чтобы при повторной отправке не дублировать
                iframe.removeEventListener('load', onIframeLoad);
            }

            // Функция показа сообщения об успехе
            function showSuccessMessage() {
                var successHTML = `
  <div class="success-message" id="successMessage">
    <div class="success-content">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"
                stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>Заявка успешно отправлена!</h3>
      <p>Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
      <button class="success-close" onclick="hideSuccessMessage()">Хорошо</button>
    </div>
  </div>
`;

                document.body.insertAdjacentHTML('beforeend', successHTML);
            }

            // Функция скрытия сообщения
            window.hideSuccessMessage = function () {
                var successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.remove();
                }
            };

            // Скрыть сообщение при клике вне его
            document.addEventListener('click', function (e) {
                if (e.target.classList.contains('success-message')) {
                    hideSuccessMessage();
                }
            });
        })();