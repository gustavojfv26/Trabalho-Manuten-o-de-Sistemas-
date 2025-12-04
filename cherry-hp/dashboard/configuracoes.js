document.addEventListener('DOMContentLoaded', function() {
    // --- Dados da Clínica ---
    const clinicaForm = document.getElementById('clinica-form');
    
    function loadClinicaData() {
        const data = JSON.parse(localStorage.getItem('cherry_clinica_data')) || {};
        if (data.nome) document.getElementById('clinica-nome').value = data.nome;
        if (data.cnpj) document.getElementById('clinica-cnpj').value = data.cnpj;
        if (data.endereco) document.getElementById('clinica-endereco').value = data.endereco;
        if (data.telefone) document.getElementById('clinica-telefone').value = data.telefone;
        if (data.email) document.getElementById('clinica-email').value = data.email;
    }

    if (clinicaForm) {
        loadClinicaData();
        clinicaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                nome: document.getElementById('clinica-nome').value,
                cnpj: document.getElementById('clinica-cnpj').value,
                endereco: document.getElementById('clinica-endereco').value,
                telefone: document.getElementById('clinica-telefone').value,
                email: document.getElementById('clinica-email').value
            };
            localStorage.setItem('cherry_clinica_data', JSON.stringify(data));
            alert('Dados da clínica salvos com sucesso!');
        });
    }

    // --- Horários ---
    const horariosForm = document.getElementById('horarios-form');
    const horariosTableBody = document.getElementById('horarios-table-body');
    
    function loadHorariosData() {
        let horarios = JSON.parse(localStorage.getItem('cherry_horarios')) || [];
        
        // Se não houver dados salvos ou se a estrutura estiver antiga (menos de 7 dias), inicializar padrão
        const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
        
        if (horarios.length !== 7) {
            horarios = diasSemana.map(dia => ({
                dia: dia,
                abre: '08:00',
                fecha: '18:00',
                intervaloInicio: '12:00',
                intervaloFim: '13:00',
                ativo: dia !== 'Domingo' // Domingo fechado por padrão
            }));
            localStorage.setItem('cherry_horarios', JSON.stringify(horarios));
        }
        
        if (horariosTableBody) {
            horariosTableBody.innerHTML = '';
            horarios.forEach((h, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${h.dia}</td>
                    <td><input type="time" value="${h.abre}" ${!h.ativo ? 'disabled' : ''}></td>
                    <td><input type="time" value="${h.fecha}" ${!h.ativo ? 'disabled' : ''}></td>
                    <td>
                        <input type="time" value="${h.intervaloInicio}" ${!h.ativo ? 'disabled' : ''}> - 
                        <input type="time" value="${h.intervaloFim}" ${!h.ativo ? 'disabled' : ''}>
                    </td>
                    <td>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="dia-${index}" ${h.ativo ? 'checked' : ''} onchange="toggleDia(${index}, this)">
                            <label class="form-check-label" for="dia-${index}">${h.ativo ? 'Aberto' : 'Fechado'}</label>
                        </div>
                    </td>
                `;
                horariosTableBody.appendChild(row);
            });
        }
    }

    if (horariosForm) {
        loadHorariosData();
        horariosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const rows = horariosTableBody.querySelectorAll('tr');
            const horarios = [];
            
            rows.forEach((row, index) => {
                const dia = row.cells[0].textContent;
                const inputs = row.querySelectorAll('input[type="time"]');
                const checkbox = row.querySelector('input[type="checkbox"]');
                
                horarios.push({
                    dia: dia,
                    abre: inputs[0].value,
                    fecha: inputs[1].value,
                    intervaloInicio: inputs[2].value,
                    intervaloFim: inputs[3].value,
                    ativo: checkbox.checked
                });
            });
            
            localStorage.setItem('cherry_horarios', JSON.stringify(horarios));
            alert('Horários salvos com sucesso!');
            loadHorariosData(); // Recarregar para atualizar estado visual (disabled inputs)
        });
    }

    window.toggleDia = function(index, checkbox) {
        const label = checkbox.nextElementSibling;
        label.textContent = checkbox.checked ? 'Aberto' : 'Fechado';
        
        // Habilitar/desabilitar inputs na mesma linha
        const row = checkbox.closest('tr');
        const inputs = row.querySelectorAll('input[type="time"]');
        inputs.forEach(input => {
            input.disabled = !checkbox.checked;
        });
    };

    // --- Usuários ---
    const usuariosTableBody = document.querySelector('#usuarios-tab tbody');
    
    function loadUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('cherry_usuarios')) || [];
        // Se vazio, adicionar admin padrão
        if (usuarios.length === 0) {
            usuarios.push({
                nome: 'Administrador',
                login: 'admin',
                perfil: 'Administrador',
                ultimoAcesso: '15/05/2023 09:45',
                status: 'Ativo'
            });
            localStorage.setItem('cherry_usuarios', JSON.stringify(usuarios));
        }
        
        if (usuariosTableBody) {
            usuariosTableBody.innerHTML = '';
            usuarios.forEach((user, index) => {
                const row = document.createElement('tr');
                const isAtivo = user.status === 'Ativo';
                row.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.login}</td>
                    <td>${user.perfil}</td>
                    <td>${user.ultimoAcesso || '-'}</td>
                    <td><span class="status-badge ${isAtivo ? 'active' : 'inactive'}">${user.status}</span></td>
                    <td>
                        <button class="btn btn-primary" onclick="editUser(${index})">Editar</button>
                        <button class="btn ${isAtivo ? 'btn-danger' : 'btn-success'}" onclick="toggleUserStatus(${index})">
                            ${isAtivo ? 'Desativar' : 'Ativar'}
                        </button>
                    </td>
                `;
                usuariosTableBody.appendChild(row);
            });
        }
    }
    
    if (document.getElementById('usuarios-tab')) {
        loadUsuarios();
    }

    // --- Modal de Edição de Usuário ---
    const usuarioModal = document.getElementById('usuario-modal');
    const usuarioEditForm = document.getElementById('usuario-edit-form');
    const btnCancelUsuario = document.getElementById('btn-cancel-usuario');

    if (btnCancelUsuario) {
        btnCancelUsuario.addEventListener('click', function() {
            usuarioModal.style.display = 'none';
        });
    }

    if (usuarioEditForm) {
        usuarioEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = document.getElementById('usuario-index').value;
            const nome = document.getElementById('edit-usuario-nome').value;
            const cpf = document.getElementById('edit-usuario-cpf').value;
            const email = document.getElementById('edit-usuario-email').value;
            const telefone = document.getElementById('edit-usuario-telefone').value;
            const login = document.getElementById('edit-usuario-login').value;
            const perfil = document.getElementById('edit-usuario-perfil').value;

            const usuarios = JSON.parse(localStorage.getItem('cherry_usuarios')) || [];
            if (usuarios[index]) {
                usuarios[index].nome = nome;
                usuarios[index].cpf = cpf;
                usuarios[index].email = email;
                usuarios[index].telefone = telefone;
                usuarios[index].login = login;
                usuarios[index].perfil = perfil;
                localStorage.setItem('cherry_usuarios', JSON.stringify(usuarios));
                usuarioModal.style.display = 'none';
                loadUsuarios();
            }
        });
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target == usuarioModal) {
            usuarioModal.style.display = 'none';
        }
    });

    // --- Integrações ---
    const integrationCheckboxes = document.querySelectorAll('.integration-card input[type="checkbox"]');
    
    function loadIntegrations() {
        const integrations = JSON.parse(localStorage.getItem('cherry_integracoes')) || {};
        integrationCheckboxes.forEach(checkbox => {
            const card = checkbox.closest('.integration-card');
            const title = card.querySelector('h4').textContent;
            if (integrations[title] !== undefined) {
                checkbox.checked = integrations[title];
            }
        });
    }
    
    if (integrationCheckboxes.length > 0) {
        loadIntegrations();
        integrationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const integrations = JSON.parse(localStorage.getItem('cherry_integracoes')) || {};
                const card = this.closest('.integration-card');
                const title = card.querySelector('h4').textContent;
                integrations[title] = this.checked;
                localStorage.setItem('cherry_integracoes', JSON.stringify(integrations));
            });
        });
    }

    // --- Backup ---
    const btnBackup = document.querySelector('.backup-card .btn-primary'); // Botão Gerar Backup
    const fileInputBackup = document.getElementById('backup-file');
    const btnRestore = fileInputBackup ? fileInputBackup.nextElementSibling : null;

    if (btnBackup) {
        const newBtn = btnBackup.cloneNode(true);
        btnBackup.parentNode.replaceChild(newBtn, btnBackup);
        
        newBtn.addEventListener('click', function() {
            const backupData = {
                clinica: localStorage.getItem('cherry_clinica_data'),
                horarios: localStorage.getItem('cherry_horarios'),
                usuarios: localStorage.getItem('cherry_usuarios'),
                integracoes: localStorage.getItem('cherry_integracoes'),
                pacientes: localStorage.getItem('cherry_pacientes'), // Incluindo pacientes se houver
                timestamp: new Date().toISOString()
            };
            
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "backup_cherry_hp.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    if (btnRestore) {
        btnRestore.addEventListener('click', function() {
            const file = fileInputBackup.files[0];
            if (!file) {
                alert('Selecione um arquivo de backup primeiro.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.clinica) localStorage.setItem('cherry_clinica_data', data.clinica);
                    if (data.horarios) localStorage.setItem('cherry_horarios', data.horarios);
                    if (data.usuarios) localStorage.setItem('cherry_usuarios', data.usuarios);
                    if (data.integracoes) localStorage.setItem('cherry_integracoes', data.integracoes);
                    if (data.pacientes) localStorage.setItem('cherry_pacientes', data.pacientes);
                    
                    alert('Backup restaurado com sucesso! A página será recarregada.');
                    location.reload();
                } catch (err) {
                    alert('Erro ao ler arquivo de backup.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        });
    }
    // --- Feriados ---
    const feriadosTableBody = document.getElementById('feriados-table-body');
    const btnAddFeriado = document.getElementById('btn-add-feriado');
    const feriadoModal = document.getElementById('feriado-modal');
    const feriadoForm = document.getElementById('feriado-form');
    const btnCancelFeriado = document.getElementById('btn-cancel-feriado');

    function loadFeriados() {
        const feriados = JSON.parse(localStorage.getItem('cherry_feriados')) || [];
        // Se vazio, adicionar exemplo
        if (feriados.length === 0) {
            localStorage.setItem('cherry_feriados', JSON.stringify(feriados));
        }

        if (feriadosTableBody) {
            feriadosTableBody.innerHTML = '';
            feriados.forEach((feriado, index) => {
                const row = document.createElement('tr');
                // Formatar data para exibição
                const dataParts = feriado.data.split('-');
                const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;
                
                row.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${feriado.descricao}</td>
                    <td>${feriado.recorrencia}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editFeriado(${index})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteFeriado(${index})">Remover</button>
                    </td>
                `;
                feriadosTableBody.appendChild(row);
            });
        }
    }

    if (feriadosTableBody) {
        loadFeriados();
    }

    if (btnAddFeriado) {
        btnAddFeriado.addEventListener('click', function() {
            document.getElementById('modal-title').textContent = 'Adicionar Feriado';
            document.getElementById('feriado-index').value = '';
            feriadoForm.reset();
            feriadoModal.style.display = 'block';
        });
    }

    if (btnCancelFeriado) {
        btnCancelFeriado.addEventListener('click', function() {
            feriadoModal.style.display = 'none';
        });
    }

    if (feriadoForm) {
        feriadoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const index = document.getElementById('feriado-index').value;
            const data = document.getElementById('feriado-data').value;
            const descricao = document.getElementById('feriado-descricao').value;
            const recorrencia = document.getElementById('feriado-recorrencia').value;

            const feriados = JSON.parse(localStorage.getItem('cherry_feriados')) || [];

            if (index === '') {
                // Adicionar
                feriados.push({ data, descricao, recorrencia });
            } else {
                // Editar
                feriados[index] = { data, descricao, recorrencia };
            }

            localStorage.setItem('cherry_feriados', JSON.stringify(feriados));
            feriadoModal.style.display = 'none';
            loadFeriados();
        });
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target == feriadoModal) {
            feriadoModal.style.display = 'none';
        }
    });
});

// Funções globais para Feriados
window.deleteFeriado = function(index) {
    if (confirm('Tem certeza que deseja remover este feriado?')) {
        const feriados = JSON.parse(localStorage.getItem('cherry_feriados')) || [];
        feriados.splice(index, 1);
        localStorage.setItem('cherry_feriados', JSON.stringify(feriados));
        location.reload(); 
    }
};

window.editFeriado = function(index) {
    const feriados = JSON.parse(localStorage.getItem('cherry_feriados')) || [];
    const feriado = feriados[index];
    if (feriado) {
        document.getElementById('modal-title').textContent = 'Editar Feriado';
        document.getElementById('feriado-index').value = index;
        document.getElementById('feriado-data').value = feriado.data;
        document.getElementById('feriado-descricao').value = feriado.descricao;
        document.getElementById('feriado-recorrencia').value = feriado.recorrencia;
        document.getElementById('feriado-modal').style.display = 'block';
    }
};

// Funções globais para ações de usuário
window.toggleUserStatus = function(index) {
    const usuarios = JSON.parse(localStorage.getItem('cherry_usuarios')) || [];
    if (usuarios[index]) {
        const currentStatus = usuarios[index].status;
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        
        if (confirm(`Tem certeza que deseja ${newStatus === 'Ativo' ? 'ativar' : 'desativar'} este usuário?`)) {
            usuarios[index].status = newStatus;
            localStorage.setItem('cherry_usuarios', JSON.stringify(usuarios));
            location.reload();
        }
    }
};

window.editUser = function(index) {
    const usuarios = JSON.parse(localStorage.getItem('cherry_usuarios')) || [];
    const user = usuarios[index];
    if (user) {
        document.getElementById('usuario-index').value = index;
        document.getElementById('edit-usuario-nome').value = user.nome;
        document.getElementById('edit-usuario-cpf').value = user.cpf || '';
        document.getElementById('edit-usuario-email').value = user.email || '';
        document.getElementById('edit-usuario-telefone').value = user.telefone || '';
        document.getElementById('edit-usuario-login').value = user.login;
        document.getElementById('edit-usuario-perfil').value = user.perfil;
        document.getElementById('usuario-modal').style.display = 'block';
    }
};

window.deleteUser = function(index) {
    toggleUserStatus(index);
};
