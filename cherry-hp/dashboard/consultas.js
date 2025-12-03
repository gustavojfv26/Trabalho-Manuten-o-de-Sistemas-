document.addEventListener('DOMContentLoaded', function() {
    // --- Inicialização ---
    const currentDateElement = document.getElementById('current-date');
    let currentDate = new Date();
    
    // Elementos do DOM
    const modal = document.getElementById('consultationModal');
    const tableBody = document.querySelector('.table tbody');
    const dayViewContainer = document.querySelector('.day-view .time-slots');
    const weekGrid = document.querySelector('.week-grid');
    const calendarDays = document.querySelector('.calendar-days');
    const statsValues = document.querySelectorAll('.stat-value');

    // --- Funções Auxiliares ---
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDisplayDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    function updateDateDisplay() {
        currentDateElement.textContent = formatDisplayDate(currentDate);
        renderAppointments();
        renderDayView();
        renderWeekView();
        renderMonthView();
        updateStats();
    }

    function getWeekDates(date) {
        const week = [];
        const curr = new Date(date);
        const first = curr.getDate() - curr.getDay();
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(curr);
            day.setDate(first + i);
            week.push(day);
        }
        return week;
    }

    function getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        const firstDayOfWeek = firstDay.getDay();
        for (let i = firstDayOfWeek; i > 0; i--) {
            const day = new Date(firstDay);
            day.setDate(day.getDate() - i);
            days.push({ date: day, otherMonth: true });
        }
        
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), otherMonth: false });
        }
        
        return days;
    }

    // --- Carregamento de Dados ---
    function loadPacientes() {
        const pacientesEstaticos = [
            { nome: 'João Silva' },
            { nome: 'Maria Oliveira' },
            { nome: 'Pedro Costa' },
            { nome: 'Ana Paula' }
        ];
        
        const pacientesLS = JSON.parse(localStorage.getItem('cherry_pacientes')) || [];
        const todosPacientes = [...pacientesEstaticos, ...pacientesLS];
        
        console.log('Carregando pacientes:', todosPacientes.length, 'encontrados');
        const select = document.getElementById('paciente-consulta');
        if (select) {
            select.innerHTML = '<option value="">Selecione um paciente</option>';
            todosPacientes.forEach(p => {
                const option = document.createElement('option');
                option.value = p.nome;
                option.textContent = p.nome;
                select.appendChild(option);
            });
        } else {
            console.warn('Select de paciente não encontrado');
        }
    }

    function loadMedicos() {
        const medicosEstaticos = [
            { nome: 'Dra. Ana Souza', especialidade: 'Cardiologia' },
            { nome: 'Dr. Carlos Mendes', especialidade: 'Pediatria' },
            { nome: 'Dra. Fernanda Lima', especialidade: 'Ortopedia' },
            { nome: 'Dr. Roberto Alves', especialidade: 'Dermatologia' }
        ];
        
        const usuarios = JSON.parse(localStorage.getItem('cherry_usuarios')) || [];
        const medicosLS = usuarios.filter(u => u.perfil === 'Médico');
        const todosMedicos = [...medicosEstaticos, ...medicosLS];
        
        console.log('Carregando médicos:', todosMedicos.length, 'encontrados');
        const select = document.getElementById('medico-consulta');
        if (select) {
            select.innerHTML = '<option value="">Selecione um médico</option>';
            todosMedicos.forEach(m => {
                const option = document.createElement('option');
                option.value = m.nome;
                option.textContent = m.especialidade ? `${m.nome} - ${m.especialidade}` : m.nome;
                select.appendChild(option);
            });
        } else {
            console.warn('Select de médico não encontrado');
        }
    }

    // --- Renderização ---
    function renderAppointments() {
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const dateStr = formatDate(currentDate);
        
        const medicoFilter = document.getElementById('medicoFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filtered = consultas.filter(c => {
            const matchDate = c.data === dateStr;
            const matchMedico = !medicoFilter || c.medico === medicoFilter;
            const matchStatus = !statusFilter || c.status === statusFilter;
            return matchDate && matchMedico && matchStatus;
        });

        if (tableBody) {
            tableBody.innerHTML = '';
            filtered.sort((a, b) => a.hora.localeCompare(b.hora));
            
            filtered.forEach(c => {
                const row = document.createElement('tr');
                row.className = 'consultation-row';
                row.innerHTML = `
                    <td>${c.hora}</td>
                    <td>${c.paciente}</td>
                    <td>${c.medico}</td>
                    <td>Clínica Geral</td>
                    <td><span class="status-badge ${c.status}">${getStatusLabel(c.status)}</span></td>
                    <td class="consultation-actions">
                        <button class="btn btn-primary btn-sm" onclick="viewAppointment('${c.id}')">Detalhes</button>
                        <button class="btn btn-success btn-sm" onclick="rescheduleAppointment('${c.id}')">Reagendar</button>
                        ${c.status !== 'canceled' ? `<button class="btn btn-danger btn-sm" onclick="cancelAppointment('${c.id}')">Cancelar</button>` : ''}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    function renderDayView() {
        if (!dayViewContainer) return;
        
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const dateStr = formatDate(currentDate);
        const todaysAppointments = consultas.filter(c => c.data === dateStr);
        
        dayViewContainer.innerHTML = '';
        const startHour = 8;
        const endHour = 18;
        
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                const endTimeStr = `${m === 30 ? (h + 1).toString().padStart(2, '0') : h.toString().padStart(2, '0')}:${m === 30 ? '00' : '30'}`;
                
                const appointment = todaysAppointments.find(c => c.hora === timeStr && c.status !== 'canceled');
                const canceledApp = todaysAppointments.find(c => c.hora === timeStr && c.status === 'canceled');
                
                const slot = document.createElement('div');
                
                if (appointment) {
                    slot.className = 'time-slot booked';
                    slot.innerHTML = `
                        <span>${timeStr} - ${endTimeStr}</span>
                        <span>${appointment.paciente} - ${appointment.medico}</span>
                        <div class="consultation-actions">
                            <button class="btn btn-sm btn-primary" onclick="viewAppointment('${appointment.id}')">Detalhes</button>
                            <button class="btn btn-sm btn-success" onclick="rescheduleAppointment('${appointment.id}')">Reagendar</button>
                            <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">Cancelar</button>
                        </div>
                    `;
                } else if (canceledApp) {
                    slot.className = 'time-slot canceled';
                    slot.innerHTML = `
                        <span>${timeStr} - ${endTimeStr}</span>
                        <span>${canceledApp.paciente} - ${canceledApp.medico} - CANCELADA</span>
                        <div class="consultation-actions">
                            <button class="btn btn-sm btn-primary" onclick="viewAppointment('${canceledApp.id}')">Detalhes</button>
                            <button class="btn btn-sm btn-success" onclick="rescheduleAppointment('${canceledApp.id}')">Reagendar</button>
                        </div>
                    `;
                } else {
                    slot.className = 'time-slot free';
                    slot.innerHTML = `
                        <span>${timeStr} - ${endTimeStr}</span>
                        <span>Disponível</span>
                        <button class="btn btn-sm btn-primary" onclick="scheduleAppointment('${timeStr}')">Agendar</button>
                    `;
                }
                dayViewContainer.appendChild(slot);
            }
        }
    }

    function renderWeekView() {
        if (!weekGrid) return;
        
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const weekDates = getWeekDates(currentDate);
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        weekGrid.innerHTML = '';
        
        weekDates.forEach((date, index) => {
            const dateStr = formatDate(date);
            const dayAppointments = consultas.filter(c => c.data === dateStr && c.status !== 'canceled');
            const isToday = formatDate(new Date()) === dateStr;
            
            const dayDiv = document.createElement('div');
            dayDiv.className = `week-day ${isToday ? 'current' : ''}`;
            dayDiv.innerHTML = `
                <div class="day-header">${diasSemana[index]}<br>${date.getDate()}/${date.getMonth() + 1}</div>
                <div class="day-count">${dayAppointments.length} consulta${dayAppointments.length !== 1 ? 's' : ''}</div>
            `;
            weekGrid.appendChild(dayDiv);
        });
    }

    function renderMonthView() {
        if (!calendarDays) return;
        
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const monthDays = getDaysInMonth(currentDate);
        
        calendarDays.innerHTML = '';
        
        monthDays.forEach(({ date, otherMonth }) => {
            const dateStr = formatDate(date);
            const dayAppointments = consultas.filter(c => c.data === dateStr && c.status !== 'canceled');
            const isToday = formatDate(new Date()) === dateStr;
            
            const dayDiv = document.createElement('div');
            dayDiv.className = `day ${otherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
            
            let content = `<span class="day-number">${date.getDate()}</span>`;
            
            dayAppointments.slice(0, 2).forEach(app => {
                const hora = app.hora.substring(0, 5);
                const medicoNome = app.medico.split(' ')[1] || app.medico.split(' ')[0];
                content += `
                    <div class="appointment-mini">
                        <small>${hora} - ${medicoNome}</small>
                    </div>
                `;
            });
            
            if (dayAppointments.length > 2) {
                content += `<small class="more-appointments">+${dayAppointments.length - 2} mais</small>`;
            }
            
            dayDiv.innerHTML = content;
            calendarDays.appendChild(dayDiv);
        });
    }

    function updateStats() {
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const dateStr = formatDate(currentDate);
        const todays = consultas.filter(c => c.data === dateStr);
        
        if (statsValues.length >= 4) {
            statsValues[0].textContent = todays.length;
            statsValues[1].textContent = todays.filter(c => c.status === 'confirmed').length;
            statsValues[2].textContent = todays.filter(c => c.status === 'pending').length;
            statsValues[3].textContent = todays.filter(c => c.status === 'canceled').length;
        }
    }

    function getStatusLabel(status) {
        switch(status) {
            case 'confirmed': return 'Confirmada';
            case 'pending': return 'Pendente';
            case 'canceled': return 'Cancelada';
            default: return status;
        }
    }
    
    function generateTimeOptions(currentTime) {
        const startHour = 8;
        const endHour = 18;
        let options = '';
        
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                const selected = timeStr === currentTime ? 'selected' : '';
                options += `<option value="${timeStr}" ${selected}>${timeStr}</option>`;
            }
        }
        
        return options;
    }

    function saveAppointment() {
        const pacienteSelect = document.getElementById('paciente-consulta');
        const medicoSelect = document.getElementById('medico-consulta');
        const dataInput = document.getElementById('data-consulta');
        const horaInput = document.getElementById('hora-consulta');
        const motivoInput = document.getElementById('motivo-consulta');
        
        if (!pacienteSelect || !medicoSelect || !dataInput || !horaInput) {
            alert('Erro: Campos do formulário não encontrados');
            return;
        }
        
        if (!pacienteSelect.value || !medicoSelect.value || !dataInput.value || !horaInput.value) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }
        
        const newAppointment = {
            id: Date.now().toString(),
            paciente: pacienteSelect.options[pacienteSelect.selectedIndex].text,
            medico: medicoSelect.options[medicoSelect.selectedIndex].text,
            data: dataInput.value,
            hora: horaInput.value,
            motivo: motivoInput ? motivoInput.value : '',
            status: 'confirmed'
        };
        
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        consultas.push(newAppointment);
        localStorage.setItem('cherry_consultas', JSON.stringify(consultas));
        
        console.log('Consulta salva:', newAppointment);
        alert('Consulta agendada com sucesso!');
        modal.style.display = 'none';
        
        renderAppointments();
        renderDayView();
        renderWeekView();
        renderMonthView();
        updateStats();
    }

    // --- Event Listeners ---
    
    document.getElementById('prev-date').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
    });
    
    document.getElementById('next-date').addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
    });

    document.getElementById('applyFilters').addEventListener('click', renderAppointments);

    modal.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário submetido');
        saveAppointment();
    });

    // Inicialização
    updateDateDisplay();

    // Funções globais
    window.scheduleAppointment = function(time) {
        document.getElementById('nova-consulta-btn').click();
        setTimeout(() => {
            console.log('Carregando dados para o modal...');
            loadPacientes();
            loadMedicos();
            const dataInput = document.getElementById('data-consulta');
            const horaInput = document.getElementById('hora-consulta');
            if (dataInput) dataInput.value = formatDate(currentDate);
            if (horaInput && time) horaInput.value = time;
        }, 250);
    };

    window.cancelAppointment = function(id) {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
            const index = consultas.findIndex(c => c.id === id);
            if (index !== -1) {
                consultas[index].status = 'canceled';
                localStorage.setItem('cherry_consultas', JSON.stringify(consultas));
                renderAppointments();
                renderDayView();
                renderWeekView();
                renderMonthView();
                updateStats();
            }
        }
    };

    window.viewAppointment = function(id) {
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const app = consultas.find(c => c.id === id);
        if (app) {
            const detailsModal = document.getElementById('detailsModal');
            const detailsContent = document.getElementById('detailsContent');
            
            // Formatar data para exibição
            const dataFormatada = new Date(app.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            detailsContent.innerHTML = `
                <div class="details-grid">
                    <div class="detail-row">
                        <div class="detail-label">📋 ID da Consulta</div>
                        <div class="detail-value">${app.id}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">👤 Paciente</div>
                        <div class="detail-value large">${app.paciente}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">👨‍⚕️ Médico</div>
                        <div class="detail-value large">${app.medico}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">📅 Data</div>
                        <div class="detail-value">${dataFormatada}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">🕐 Horário</div>
                        <div class="detail-value">${app.hora}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">📝 Motivo da Consulta</div>
                        <div class="detail-value">${app.motivo || 'Não informado'}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">⚡ Status</div>
                        <div class="detail-value">
                            <span class="status-badge ${app.status}">${getStatusLabel(app.status)}</span>
                        </div>
                    </div>
                    
                    ${app.historico && app.historico.length > 0 ? `
                        <div class="detail-row" style="border-left-color: #e67e22;">
                            <div class="detail-label">📜 Histórico de Reagendamentos</div>
                            <div class="detail-value">
                                ${app.historico.map((h, index) => `
                                    <div style="margin-top: ${index > 0 ? '10px' : '0'}; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">
                                        <strong>Reagendamento ${index + 1}:</strong><br>
                                        De: ${new Date(h.dataAnterior + 'T00:00:00').toLocaleDateString('pt-BR')} às ${h.horaAnterior}<br>
                                        ${h.statusAnterior ? `Status: <span class="status-badge ${h.statusAnterior}">${getStatusLabel(h.statusAnterior)}</span><br>` : ''}
                                        Motivo: ${h.motivo}<br>
                                        <small style="color: #7f8c8d;">Em ${new Date(h.dataReagendamento).toLocaleDateString('pt-BR')} às ${new Date(h.dataReagendamento).toLocaleTimeString('pt-BR')}</small>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="details-actions">
                    ${app.status !== 'canceled' ? `
                        <button class="btn btn-success" onclick="rescheduleAppointment('${app.id}')">
                            📅 Reagendar
                        </button>
                        <button class="btn btn-danger" onclick="cancelAppointmentFromDetails('${app.id}')">
                            ❌ Cancelar Consulta
                        </button>
                    ` : `
                        <button class="btn btn-success" onclick="rescheduleAppointment('${app.id}')">
                            📅 Reagendar Consulta
                        </button>
                        <button class="btn btn-secondary" disabled>
                            Consulta Cancelada
                        </button>
                    `}
                </div>
            `;
            
            detailsModal.style.display = 'flex';
        }
    };


    window.closeModal = function() {
        modal.style.display = 'none';
    };
    
    window.closeDetailsModal = function() {
        const detailsModal = document.getElementById('detailsModal');
        detailsModal.style.display = 'none';
    };
    
    window.cancelAppointmentFromDetails = function(id) {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
            const index = consultas.findIndex(c => c.id === id);
            if (index !== -1) {
                consultas[index].status = 'canceled';
                localStorage.setItem('cherry_consultas', JSON.stringify(consultas));
                
                // Fechar modal de detalhes
                closeDetailsModal();
                
                // Atualizar visualizações
                renderAppointments();
                renderDayView();
                renderWeekView();
                renderMonthView();
                updateStats();
                
                alert('Consulta cancelada com sucesso!');
            }
        }
    };
    
    window.rescheduleAppointment = function(id) {
        const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
        const app = consultas.find(c => c.id === id);
        
        if (!app) {
            alert('Consulta não encontrada!');
            return;
        }
        
        // Fechar modal de detalhes
        closeDetailsModal();
        
        // Abrir modal de reagendamento
        const modal = document.getElementById('consultationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = 'Reagendar Consulta';
        modalContent.innerHTML = `
            ${app.status === 'canceled' ? `
                <div class="reschedule-info" style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
                    <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ Atenção</h4>
                    <p style="margin: 0; color: #856404;">Esta consulta está <strong>CANCELADA</strong>. Ao reagendar, ela será automaticamente <strong>REATIVADA</strong> com status "Confirmada".</p>
                </div>
            ` : ''}
            
            <div class="reschedule-info" style="background-color: #e8f4fc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">📋 Consulta Atual</h4>
                <p style="margin: 5px 0;"><strong>Paciente:</strong> ${app.paciente}</p>
                <p style="margin: 5px 0;"><strong>Médico:</strong> ${app.medico}</p>
                <p style="margin: 5px 0;"><strong>Data Atual:</strong> ${new Date(app.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                <p style="margin: 5px 0;"><strong>Horário Atual:</strong> ${app.hora}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span class="status-badge ${app.status}">${getStatusLabel(app.status)}</span></p>
            </div>
            
            <form id="rescheduleForm">
                <h4 style="margin-bottom: 15px; color: #2c3e50;">📅 Nova Data e Horário</h4>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="nova-data">Nova Data *</label>
                        <input type="date" id="nova-data" value="${app.data}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="nova-hora">Novo Horário *</label>
                        <select id="nova-hora" required>
                            <option value="">Selecione um horário</option>
                            ${generateTimeOptions(app.hora)}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="motivo-reagendamento">Motivo do Reagendamento (opcional)</label>
                    <textarea id="motivo-reagendamento" rows="3" placeholder="Ex: Conflito de horário, solicitação do paciente, etc."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-success">Confirmar Reagendamento</button>
                </div>
            </form>
        `;
        
        modal.style.display = 'flex';
        
        // Adicionar event listener para o formulário
        setTimeout(() => {
            const form = document.getElementById('rescheduleForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const novaData = document.getElementById('nova-data').value;
                    const novaHora = document.getElementById('nova-hora').value;
                    const motivoReagendamento = document.getElementById('motivo-reagendamento').value;
                    
                    if (!novaData || !novaHora) {
                        alert('Por favor, preencha a nova data e horário!');
                        return;
                    }
                    
                    // Atualizar a consulta
                    const consultas = JSON.parse(localStorage.getItem('cherry_consultas')) || [];
                    const index = consultas.findIndex(c => c.id === id);
                    
                    if (index !== -1) {
                        // Salvar histórico de reagendamento
                        if (!consultas[index].historico) {
                            consultas[index].historico = [];
                        }
                        
                        consultas[index].historico.push({
                            dataAnterior: consultas[index].data,
                            horaAnterior: consultas[index].hora,
                            statusAnterior: consultas[index].status,
                            dataReagendamento: new Date().toISOString(),
                            motivo: motivoReagendamento || 'Não informado'
                        });
                        
                        // Atualizar data e hora
                        consultas[index].data = novaData;
                        consultas[index].hora = novaHora;
                        
                        // Se a consulta estava cancelada, reativar como confirmada
                        if (consultas[index].status === 'canceled') {
                            consultas[index].status = 'confirmed';
                        }
                        
                        localStorage.setItem('cherry_consultas', JSON.stringify(consultas));
                        
                        // Fechar modal
                        closeModal();
                        
                        // Atualizar visualizações
                        renderAppointments();
                        renderDayView();
                        renderWeekView();
                        renderMonthView();
                        updateStats();
                        
                        alert('Consulta reagendada com sucesso!');
                    }
                });
            }
        }, 100);
    };


    const novaConsultaBtn = document.getElementById('nova-consulta-btn');
    if (novaConsultaBtn) {
        novaConsultaBtn.addEventListener('click', function() {
            setTimeout(() => {
                console.log('Botão Nova Consulta clicado, carregando dados...');
                loadPacientes();
                loadMedicos();
            }, 250);
        });
    }
});
