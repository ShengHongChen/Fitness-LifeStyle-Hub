// 問候語功能
function showGreeting() {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
        greeting = "早安！開始美好的一天";
    } else if (hour < 18) {
        greeting = "午安！保持活力";
    } else {
        greeting = "晚安！記得放鬆休息";
    }
    
    document.getElementById("greeting").textContent = greeting;
}

function calculateProgress() {
    const totalDays = 98;
    const completedDays = parseInt(document.getElementById('completedDays').value) || 0;
    const startDate = new Date(document.getElementById('startDate').value);
    
    const progressPercent = Math.min((completedDays / totalDays) * 100, 100);
    
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${progressPercent}%`;
    
    document.getElementById('progressText').textContent = 
        `目前進度：${progressPercent.toFixed(1)}%`;
    
    const remainingDays = totalDays - completedDays;
    document.getElementById('daysRemaining').textContent = 
        `剩餘天數：${remainingDays} 天`;
    
    if (!isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + totalDays);
        document.getElementById('daysRemaining').textContent += 
            `（預計結束日期：${endDate.toLocaleDateString()}）`;
    }
}

function calculateProtein() {
    const weight = parseFloat(document.getElementById('weight').value);
    const activityLevel = parseFloat(document.getElementById('activityLevel').value);
    
    if (isNaN(weight) || weight < 30 || weight > 200) {
        document.getElementById('proteinResult').textContent = 
            '請輸入有效的體重（30-200 kg）';
        return;
    }

    const minProtein = (weight * activityLevel).toFixed(1);
    const maxProtein = (weight * (activityLevel + 0.2)).toFixed(1);
    
    document.getElementById('proteinResult').textContent = 
        `您的每日建議蛋白質攝取量：${minProtein}-${maxProtein} 克`;
    
    const breakfastProtein = (minProtein * 0.3).toFixed(1);
    const lunchProtein = (minProtein * 0.35).toFixed(1);
    const dinnerProtein = (minProtein * 0.35).toFixed(1);

    const eggsNeeded = Math.ceil(breakfastProtein * 0.6 / 11 * 2.5);
    const yogurtGrams = Math.ceil(breakfastProtein * 0.4 / 10 * 100);
    const chickenGrams = Math.ceil(lunchProtein / 23 * 100);
    const fishGrams = Math.ceil(dinnerProtein / 20 * 100);

    let tips = '飲食建議：\n';
    tips += `• 早餐：${breakfastProtein}克 (建議：${eggsNeeded} 顆蛋白 + ${yogurtGrams} g 優格)\n`;
    tips += `• 午餐：${lunchProtein}克 (建議：${chickenGrams} g 雞胸肉)\n`;
    tips += `• 晚餐：${dinnerProtein}克 (建議：${fishGrams} g 魚肉)\n`;
    tips += '• 建議將蛋白質分配在三餐中，有助於肌肉合成和修復\n';
    tips += '\n食物蛋白質含量參考：\n';
    tips += '• 雞蛋白：11g / 100g\n';
    tips += '• 雞胸肉：23g / 100g\n';
    tips += '• 魚肉（鮭魚）：20g / 100g\n';
    tips += '• 優格：10g / 100g';
    
    document.getElementById('proteinTips').innerHTML = tips.replace(/\n/g, '<br>');
}

function setupCharCount() {
    const inputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    inputs.forEach(input => {
        const counter = input.nextElementSibling;
        if (counter && counter.classList.contains('char-count')) {
            input.addEventListener('input', () => {
                counter.textContent = `${input.value.length}/${input.maxLength}`;
            });
        }
    });
}

function saveExperience(formData) {
    let experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    
    experiences.unshift(formData);
    
    localStorage.setItem('experiences', JSON.stringify(experiences));
}

function loadExperiences() {
    const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    const container = document.getElementById('experienceContainer');
    
    container.innerHTML = '';
    
    if (experiences.length === 0) {
        container.innerHTML = `
            <div class="no-content">
                <p>目前還沒有人分享健身故事</p>
                <p>成為第一個分享故事的人吧！</p>
            </div>
        `;
        return;
    }
    
    experiences.forEach(data => {
        const card = createExperienceCard(data);
        container.appendChild(card);
    });
}

function submitExperience(event) {
    event.preventDefault();
    
    const imageFile = document.getElementById('userImage').files[0];
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            submitFormWithImage(imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        submitFormWithImage(null);
    }
    
    return false;
}

function submitFormWithImage(imageData) {
    const formData = {
        name: document.getElementById('userName').value,
        goal: document.getElementById('userGoal').value,
        duration: document.getElementById('duration').value,
        achievement: document.getElementById('achievement').value,
        experience: document.getElementById('experience').value,
        tips: document.getElementById('tips').value,
        date: new Date().toLocaleDateString(),
        image: imageData
    };

    if (!formData.name || !formData.goal || !formData.experience) {
        alert('請填寫必填欄位');
        return;
    }

    if (formData.experience.length < 50) {
        alert('心得分享至少需要50個字');
        return;
    }

    saveExperience(formData);
    loadExperiences();
    
    document.getElementById('experienceForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imagePreview').src = '';
    
    document.querySelectorAll('.char-count').forEach(counter => {
        counter.textContent = `0/${counter.previousElementSibling.maxLength}`;
    });

    alert('分享成功！');
}

function createExperienceCard(data) {
    const card = document.createElement('div');
    card.className = 'experience-card';
    
    const imageHtml = data.image ? 
        `<div class="card-image">
            <img src="${data.image}" alt="${data.name}的分享圖片">
        </div>` : '';
    
    card.innerHTML = `
        <h3>${data.name} 的健身故事</h3>
        <div class="meta">
            目標：${data.goal}
            ${data.duration ? ` | 健身時長：${data.duration} 個月` : ''}
            ${data.achievement ? ` | 最佳成就：${data.achievement}` : ''}
            <br>分享時間：${data.date}
        </div>
        ${imageHtml}
        <div class="content">${data.experience}</div>
        ${data.tips ? `<div class="tips">給新手的建議：${data.tips}</div>` : ''}
    `;
    
    return card;
}

function setupImagePreview() {
    const imageInput = document.getElementById('userImage');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

window.onload = function() {
    if (document.querySelector('.community-page')) {
        setupCharCount();
        setupImagePreview();
        loadExperiences();
    }
    if (document.getElementById("greeting")) {
        showGreeting();
    }
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        startDateInput.value = dateString;
    }
}; 