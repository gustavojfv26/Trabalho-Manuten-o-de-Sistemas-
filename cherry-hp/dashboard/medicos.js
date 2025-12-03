document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('.table tbody');
    
    // Dados estáticos dos médicos com IDs únicos
    const medicosEstaticos = [
        { id: '1', crm: 'SP-123456', nome: 'Dra. Ana Souza', especialidade: 'Cardiologia', telefone: '(11) 9999-8888', email: 'ana.souza@clinica.com', status: 'Ativo' },
        { id: '2', crm: 'SP-111222', nome: 'Dr. Roberto Firmino', especialidade: 'Cardiologia', telefone: '(11) 9777-6666', email: 'roberto.firmino@clinica.com', status: 'Ativo' },
        { id: '3', crm: 'SP-333444', nome: 'Dra. Carla Diaz', especialidade: 'Cardiologia', telefone: '(11) 9555-4444', email: 'carla.diaz@clinica.com', status: 'Férias' },
        { id: '4', crm: 'SP-555666', nome: 'Dr. Lucas Silva', especialidade: 'Cardiologia', telefone: '(11) 9333-2222', email: 'lucas.silva@clinica.com', status: 'Ativo' },
        { id: '5', crm: 'SP-777888', nome: 'Dra. Marina Ruy', especialidade: 'Cardiologia', telefone: '(11) 9111-0000', email: 'marina.ruy@clinica.com', status: 'Ativo' },
        { id: '6', crm: 'SP-654321', nome: 'Dr. Carlos Mendes', especialidade: 'Pediatria', telefone: '(11) 9888-7777', email: 'carlos.mendes@clinica.com', status: 'Ativo' },
        { id: '7', crm: 'SP-999000', nome: 'Dra. Julia Roberts', especialidade: 'Pediatria', telefone: '(11) 9222-3333', email: 'julia.roberts@clinica.com', status: 'Ativo' },
        { id: '8', crm: 'SP-121212', nome: 'Dr. Paulo Gustavo', especialidade: 'Pediatria', telefone: '(11) 9444-5555', email: 'paulo.gustavo@clinica.com', status: 'Inativo' },
        { id: '9', crm: 'SP-343434', nome: 'Dr. Marcos Mion', especialidade: 'Ortopedia', telefone: '(11) 9666-7777', email: 'marcos.mion@clinica.com', status: 'Ativo' },
        { id: '10', crm: 'SP-565656', nome: 'Dra. Tatá Werneck', especialidade: 'Ortopedia', telefone: '(11) 9888-9999', email: 'tata.werneck@clinica.com', status: 'Ativo' },
        { id: '11', crm: 'SP-787878', nome: 'Dr. Fabio Porchat', especialidade: 'Ortopedia', telefone: '(11) 9000-1111', email: 'fabio.porchat@clinica.com', status: 'Ativo' },
        { id: '12', crm: 'SP-909090', nome: 'Dra. Ingrid Guimarães', especialidade: 'Ortopedia', telefone: '(11) 9222-4444', email: 'ingrid.guimaraes@clinica.com', status: 'Férias' }
    ];
    
    // Inicializar localStorage - FORÇAR REINICIALIZAÇÃO COM IDs
    function initMedicos() {
        let medicos = JSON.parse(localStorage.getItem('cherry_medicos'));
        
        // Verificar se os médicos têm IDs, se não tiverem, reinicializar
        if (!medicos || medicos.length === 0 || !medicos[0].id) {
            console.log('Reinicializando médicos com IDs...');
            localStorage.setItem('cherry_medicos', JSON.stringify(medicosEstaticos));
            medicos = medicosEstaticos;
        }
        
        return medicos;
    }
    
    // Renderizar tabela
    function renderMedicos() {
        const medicos = initMedicos();
        if (!tableBody) return;
        
        console.log('Renderizando', medicos.length, 'médicos');
        
        tableBody.innerHTML = '';
        medicos.forEach(medico => {
            if (!medico.id) {
                console.error('Médico sem ID:', medico);
                return;
            }
            
            const row = document.createElement('tr');
            row.className = 'doctor-row';
            row.setAttribute('data-crm', medico.crm);
            row.setAttribute('data-name', medico.nome);
            row.setAttribute('data-specialty', medico.especialidade);
            row.setAttribute('data-status', medico.status);
            row.setAttribute('data-id', medico.id);
            
            const statusClass = medico.status === 'Ativo' ? 'active' : medico.status === 'Férias' ? 'warning' : 'inactive';
            const buttonClass = medico.status === 'Ativo' ? 'btn-danger' : 'btn-success';
            const buttonText = medico.status === 'Ativo' ? 'Desativar' : 'Ativar';
            
            row.innerHTML = `
                <td>${medico.crm}</td>
                <td>${medico.nome}</td>
                <td>${medico.especialidade}</td>
                <td>${medico.telefone}</td>
                <td>${medico.email}</td>
                <td><span class="status-badge ${statusClass}">${medico.status}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="editDoctor('${medico.id}')">Editar</button>
                    <button class="btn ${buttonClass}" onclick="toggleDoctorStatus('${medico.id}')">${buttonText}</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Função global para editar médico
    window.editDoctor = function(id) {
        console.log('Editando médico com ID:', id);
        window.location.href = `../cadastro/medico.html?id=${id}&edit=true`;
    };
    
    // Função global para toggle status
    window.toggleDoctorStatus = function(id) {
        const medicos = JSON.parse(localStorage.getItem('cherry_medicos')) || [];
        const medicoIndex = medicos.findIndex(m => m.id === id);
        
        if (medicoIndex === -1) return;
        
        const medico = medicos[medicoIndex];
        const isInactive = medico.status === 'Inativo' || medico.status === 'Férias';
        
        if (isInactive) {
            medicos[medicoIndex].status = 'Ativo';
            localStorage.setItem('cherry_medicos', JSON.stringify(medicos));
            renderMedicos();
            showNotification('Médico ativado com sucesso!', 'success');
        } else {
            if (confirm('Tem certeza que deseja desativar este médico?')) {
                medicos[medicoIndex].status = 'Inativo';
                localStorage.setItem('cherry_medicos', JSON.stringify(medicos));
                renderMedicos();
                showNotification('Médico desativado.', 'warning');
            }
        }
    };
    
    // Inicializar
    renderMedicos();
});
