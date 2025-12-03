document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard/index.html';
        });
    }
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const pageName = this.getAttribute('data-page');
            if (pageName) {
                console.log(`Carregando página: ${pageName}`);
            }
        });
    });
    
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    const registerForms = document.querySelectorAll('.register-form');
    registerForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cadastro realizado com sucesso (simulado)');
            if (form.id === 'paciente-form') {
                window.location.href = '../dashboard/pacientes.html';
            } else if (form.id === 'medico-form') {
                window.location.href = '../dashboard/medicos.html';
            }
        });
    });
});

const days = document.querySelectorAll('.day:not(.other-month)');
days.forEach(day => {
    day.addEventListener('click', function() {
        days.forEach(d => d.classList.remove('selected'));
        this.classList.add('selected');
        console.log(`Data selecionada: ${this.querySelector('span').textContent}/05/2023`);
    });
});

const appointments = document.querySelectorAll('.appointment');
appointments.forEach(app => {
    app.addEventListener('click', function(e) {
        e.stopPropagation();
        alert(`Consulta selecionada: ${this.querySelector('p').textContent}`);
    });
});

const filterButtons = document.querySelectorAll('.filter-options select');
filterButtons.forEach(select => {
    select.addEventListener('change', function() {
        console.log(`Filtro alterado: ${this.value}`);
    });
});

const reportButtons = document.querySelectorAll('.report-card .btn');
reportButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const reportTitle = this.parentElement.querySelector('h4').textContent;
        alert(`Relatório "${reportTitle}" gerado com sucesso (simulado)`);
    });
});

const specialtyCards = document.querySelectorAll('.specialty-card');
specialtyCards.forEach(card => {
    card.addEventListener('click', function() {
        const specialty = this.querySelector('h4').textContent;
        console.log(`Especialidade selecionada: ${specialty}`);
    });
});

const records = document.querySelectorAll('.record');
records.forEach(record => {
    record.addEventListener('click', function() {
        const recordDate = this.querySelector('h4').textContent.replace('Consulta em ', '');
        console.log(`Prontuário de ${recordDate} selecionado`);
    });
});

const certFileInput = document.querySelector('#integracao-tab input[type="file"]');
if (certFileInput) {
    certFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            alert(`Certificado digital "${this.files[0].name}" selecionado (simulado)`);
        }
    });
}

const integrationCheckboxes = document.querySelectorAll('.integration-card input[type="checkbox"]');
integrationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const integrationName = this.closest('.integration-card').querySelector('h4').textContent;
        const status = this.checked ? 'ativada' : 'desativada';
        console.log(`Integração ${integrationName} ${status}`);
    });
});

const backupCheckbox = document.querySelector('.backup-card input[type="checkbox"]');
if (backupCheckbox) {
    backupCheckbox.addEventListener('change', function() {
        console.log(`Backup automático ${this.checked ? 'ativado' : 'desativado'}`);
    });
}
