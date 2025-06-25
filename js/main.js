document.addEventListener('DOMContentLoaded', () => {
  // Inicialização do Firebase Messaging e obtenção do token
  if ('Notification' in window && window.firebase && firebase.messaging) {
    Notification.requestPermission().then(function(permission) {
      console.log('Permissão para notificação:', permission);
    });
    const messaging = firebase.messaging();
    messaging
      .getToken({ vapidKey: 'YOUR_PUBLIC_VAPID_KEY_IF_NEEDED' })
      .then((token) => {
        if (token) {
          console.log("Token FCM do celular:", token);
          localStorage.setItem("tokenCabeleireiro", token); // salva para uso no agendamento
        }
      })
      .catch((err) => {
        console.error("Erro ao obter permissão ou token:", err);
      });
  }

  // Elementos da tela
  const welcomeScreen = document.getElementById('welcome-screen');
  const bookingScreen = document.getElementById('booking-screen');
  const scheduleBtn = document.getElementById('schedule-btn');
  const sendButton = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-message-input');
  const chatConversation = document.getElementById('chat-conversation');
  const AgendarBtn = document.getElementById('AgendarBtn'); // Botão "Agendar" no cabeçalho da tela de agendamento
  const AgendarHorárioBtn = document.getElementById('AgendarHorárioBtn'); // Botão "Agendar Horário"
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-btn');
  const bookingForm = document.getElementById('booking-form');
  const bookingHistory = document.getElementById('booking-history');
  const clearChatBtn = document.getElementById('clear-chat-btn'); // Novo botão "Apagar Tudo"

  // Esconde o botão Agendar do cabeçalho inicialmente
  if (AgendarBtn) AgendarBtn.style.display = 'none';
  // Esconde o botão Agendar Horário inicialmente
  if (AgendarHorárioBtn) AgendarHorárioBtn.style.display = 'none';

  // Mostra o modal ao clicar no botão "Agendar Horário"
  if (scheduleBtn && modal) {
    scheduleBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  // Fecha o modal ao clicar no botão de fechar
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Fecha o modal ao clicar fora dele
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Exemplo de lógica para o botão "Agendar" do cabeçalho
  if (AgendarBtn && modal) {
    AgendarBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  // Evento para o botão "Agendar Horário" na tela de boas-vindas
  if (AgendarHorárioBtn && welcomeScreen && bookingScreen) {
    AgendarHorárioBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      bookingScreen.classList.remove('hidden');
    });
  }

  // Lógica para o botão "Apagar Tudo" do chat
  if (clearChatBtn && chatConversation && chatInput && sendButton && AgendarBtn) {
    clearChatBtn.addEventListener('click', () => {
      chatConversation.innerHTML = '';
      chatInput.value = '';
      chatInput.disabled = false;
      sendButton.disabled = false;
      // Esconde o botão Agendar do cabeçalho novamente
      AgendarBtn.style.display = 'none';
      // Mensagem de feedback visual
      chatConversation.innerHTML = '<div class="text-center text-gray-400 mt-4">Chat limpo!</div>';
    });
  }

  // Lógica para enviar mensagem no chat
  let step = 0;
  let userName = '';

  function enviarMensagem() {
    if (!chatInput || !chatConversation) return;
    const mensagem = chatInput.value.trim();
    if (!mensagem) return;

    // Se o usuário digitar "apagar tudo", limpa o chat
    if (mensagem.toLowerCase() === 'apagar tudo') {
      chatConversation.innerHTML = '<div class="text-center text-gray-400 mt-4">Chat limpo!</div>';
      chatInput.value = '';
      chatInput.disabled = false;
      sendButton.disabled = false;
      if (AgendarBtn) AgendarBtn.style.display = 'none';
      return;
    }

    // Mostra a mensagem do usuário
    const messageDiv = document.createElement('div');
    messageDiv.className = 'mb-2 p-2 rounded bg-gray-100 text-black';
    messageDiv.textContent = mensagem;
    chatConversation.appendChild(messageDiv);
    chatInput.value = '';
    chatConversation.scrollTop = chatConversation.scrollHeight;

    setTimeout(() => {
      const resposta = document.createElement('div');
      resposta.className = 'mb-2 p-2 rounded bg-green-100 text-black';
      if (step === 0) {
        userName = mensagem;
        resposta.textContent = `${userName}, clique no botão Agendar para agendar. 📅`;
        if (AgendarBtn) {
          AgendarBtn.style.display = 'inline';
        }
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

  // Evento do botão de envio de mensagem
  if (sendButton && chatInput) {
    sendButton.addEventListener('click', enviarMensagem);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        enviarMensagem();
      }
    });
  }

  // Evento de envio do formulário de agendamento
  if (bookingForm && bookingHistory && chatConversation && modal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const service = bookingForm.service ? bookingForm.service.value : '';
      const date = bookingForm.date ? bookingForm.date.value : '';
      const time = bookingForm.time ? bookingForm.time.value : '';
      if (service && date && time) {
        // Formatar data para exibição
        const dataFormatada = new Date(date).toLocaleDateString('pt-BR');
        // Criar novo item para histórico de agendamentos
        const li = document.createElement('li');
        li.className = 'p-4 bg-gray-200 rounded flex flex-col gap-1';
        li.innerHTML = `<strong>${service}</strong><span>${dataFormatada} às ${time}</span>`;
        bookingHistory.appendChild(li);

        // Mensagem no chat sobre o agendamento
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
        notificarConfirmacaoAgenda();
      } else {
        exibirErro('Por favor, preencha todos os campos do agendamento.');
      }
    });
  }

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
    setTimeout(() => {
      alertDiv.remove();
      if (!messageDiv.hasChildNodes()) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Notificação após agendar
  function notificarConfirmacaoAgenda() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Agendamento confirmado!', {
        body: 'Sua agenda foi confirmada com sucesso.',
        icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png'
      });
    }
  }
});
