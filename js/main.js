document.addEventListener('DOMContentLoaded', () => {
  // Elementos da tela de boas-vindas
  const welcomeScreen = document.getElementById('welcome-screen');
  const bookingScreen = document.getElementById('booking-screen');
  const scheduleBtn = document.getElementById('schedule-btn');

  // Elementos do sistema de chat e agendamento
  const sendButton = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-message-input');
  const chatConversation = document.getElementById('chat-conversation');
  const AgendarBtn = document.getElementById('AgendarBtn');
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-btn');
  const bookingForm = document.getElementById('booking-form');
  const bookingHistory = document.getElementById('booking-history');

  // Evento para o botão "Agendar Horário" na tela de boas-vindas
  scheduleBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    bookingScreen.classList.remove('hidden');
  });
  
  // Evento do botão de envio de mensagem
  sendButton.addEventListener('click', enviarMensagem);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      enviarMensagem();
    }
  });

  let step = 0;
let userName = '';

function enviarMensagem() {
  const mensagem = chatInput.value.trim();
  if (!mensagem) return;

  // Mostra a mensagem do usuário
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message sent';
  messageDiv.textContent = mensagem;
  chatConversation.appendChild(messageDiv);
  chatInput.value = '';
  chatConversation.scrollTop = chatConversation.scrollHeight;

  setTimeout(() => {
    const resposta = document.createElement('div');
    resposta.className = 'chat-message';

    if (step === 0) {
      userName = mensagem;
      resposta.textContent = `${userName}, clique no botão Agendar para agendar. 📅`;
      AgendarBtn.style.display = 'inline';
      chatInput.disabled = true;
      sendButton.disabled = true;
      step = 1;
    } else if (step === 1) {
      resposta.textContent = `Agendamento realizado com sucesso, ${userName}! ✅`;
    }
    chatConversation.appendChild(resposta);
    chatConversation.scrollTop = chatConversation.scrollHeight;
  }, 500);
}
  // Eventos do modal
  AgendarBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  // Fechar modal ao clicar fora dele
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
  
  // Capturar evento de envio do formulário de agendamento
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = document.getElementById('service').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    if (!service || !date || !time) {
      exibirErro('Por favor, preencha todos os campos do agendamento.');
      return;
    }
    
    try {
      // Formatar data para exibição
      const dataFormatada = new Date(date).toLocaleDateString('pt-BR');
      
      // Criar novo item para histórico de agendamentos
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${service}</strong><br>
        Data: ${dataFormatada}<br>
        Horário: ${time}
      `;
      bookingHistory.appendChild(li);
      
      // Adicionar mensagem no chat sobre o agendamento
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message';
      messageDiv.textContent = `Agendamento confirmado: ${service} para ${dataFormatada} às ${time}`;
      chatConversation.appendChild(messageDiv);
      chatConversation.scrollTop = chatConversation.scrollHeight;
      
      // Resetar formulário e fechar modal
      bookingForm.reset();
      modal.classList.add('hidden');
      
      // Mostrar mensagem de sucesso
      exibirMensagem('Agendamento realizado com sucesso!', 'success');
    } catch (erro) {
      console.error('Erro ao agendar:', erro);
      exibirErro('Falha ao realizar agendamento. Por favor, tente novamente.');
    }
  });
  
  // Função para exibir mensagens de erro
  function exibirErro(mensagem) {
    exibirMensagem(mensagem, 'error');
  }
  
  // Função para exibir mensagens (erro ou sucesso)
  function exibirMensagem(mensagem, tipo) {
    let messageDiv = document.getElementById('message-container');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = 'message-container';
      document.body.prepend(messageDiv);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = tipo === 'error' ? 'error-message' : 'success-message';
    alertDiv.textContent = mensagem;
    messageDiv.appendChild(alertDiv);
    
    // Remover a mensagem após 5 segundos
    setTimeout(() => {
      alertDiv.remove();
      if (!messageDiv.hasChildNodes()) {
        messageDiv.remove();
      }
    }, 5000);
  }
});
