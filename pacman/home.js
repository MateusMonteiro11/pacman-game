const btnPlay = document.getElementById('btnPlay');
btnPlay.addEventListener('click', () => {
  window.location.href = 'pacman.html';
});

const btnRules = document.getElementById('btnRules');
const btnCreator = document.getElementById('btnCreator');
const btnHome = document.getElementById('btnHome');
const content = document.getElementById('content');

const rulesText = `
  <div style="
    font-family: 'Press Start 2P', cursive;
    background-color: #171751;
    color: #white;
    padding: 20px;
    border: 4px solid yellow;
    border-radius: 10px;
    text-align: left;
    max-width: 600px;
    margin: auto;
  ">
    <h2 style="text-align: center; font-size: 14px; margin-bottom: 20px;">REGRAS DO JOGO</h2>
    <ul style="font-size: 8px; line-height: 1.8; padding-left: 20px;">
      <li>Controle o Pac-Man e coma todos os pontos amarelos no labirinto.</li>
      <li>Evite os fantasmas — se tocar neles, perde uma vida.</li>
      <li>Complete o labirinto para vencer a fase.</li>
      <li>Use as setas do teclado ou WASD para se mover.</li>
      <li>Você tem 3 vidas. Quando acabar, é game over!</li>
    </ul>
    <p style="font-size: 8px; text-align: center; margin-top: 20px;">Boa sorte e divirta-se!</p>
  </div>
`;


const creatorText = `
  <div style="
    font-family: 'Press Start 2P', cursive;
    background-color: #171751;
    color: #white;
    padding: 20px;
    border: 4px solid yellow;
    border-radius: 10px;
    text-align: center;
    max-width: 500px;
    margin: auto;
  ">
    <img 
      src="imagens/eu.jpeg" 
      alt="Foto de Mateus Monteiro" 
      style="width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 2px solid yellow; margin-bottom: 15px;"
    >
    <h2 style="font-size: 14px; margin-bottom: 10px;">Mateus Monteiro</h2>
    <p style="font-size: 8px; line-height: 1.6;">
      Estudante universitário da FEI<br>
      Desenvolvedor e entusiasta de tecnologia,
      apaixonado por criar experiências digitais e
      programas funcionais intuitivos.
    </p>
    <p style="margin-top: 20px; font-size: 8px;">Minhas redes</p>
    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
      <a href="" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style="width: 24px;">
      </a>
      <a href="" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 24px;">
      </a>
      <a href="https://www.instagram.com/teeusada?igsh=NmMzZ3ZlazZsaXpi&utm_source=qr" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px;">
      </a>
    </div>
  </div>
`;



btnRules.addEventListener('click', () => {
  content.innerHTML = rulesText;
  content.classList.remove('hidden');
  btnRules.setAttribute('aria-expanded', 'true');
});

btnCreator.addEventListener('click', () => {
  content.innerHTML = creatorText;
  content.classList.remove('hidden');
  btnRules.setAttribute('aria-expanded', 'true');
});

btnHome.addEventListener('click', () => {
  window.location.href = 'home.html';
});