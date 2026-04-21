const URL_API = 'https://jsonplaceholder.typicode.com/users';


function obterIniciais(nome) {
  return nome.split(' ').slice(0, 2).map(palavra => palavra[0]).join('').toUpperCase();
}


function definirCarregando(ligado) {
  const btn = document.getElementById('btnRecarregar');
  document.getElementById('estadoCarregamento').classList.toggle('show', ligado);
  document.getElementById('grade').style.display = ligado ? 'none' : 'grid';
  btn.classList.toggle('carregando', ligado);
  btn.disabled = ligado;
}


function renderizarEstatisticas(usuarios) {
  const cidades = new Set(usuarios.map(u => u.address.city)).size;
  const empresas = new Set(usuarios.map(u => u.company.name)).size;
  
  document.getElementById('statTotal').textContent = usuarios.length;
  document.getElementById('statCidades').textContent = cidades;
  document.getElementById('statEmpresas').textContent = empresas;
}


function renderizarCards(usuarios) {
  const grade = document.getElementById('grade');
  grade.innerHTML = usuarios.map((user, i) => `
    <div class="card" style="animation-delay:${i * 45}ms">
      <div class="card-indice">// usuário ${String(user.id).padStart(2, '0')}</div>
      <div class="card-avatar">${obterIniciais(user.name)}</div>
      <div class="card-nome">${user.name}</div>
      <div class="card-usuario">@${user.username}</div>
      
      <div class="card-linha">
        <span class="card-icone">✉</span>
        <span class="card-val"><a href="mailto:${user.email}">${user.email}</a></span>
      </div>
      
      <div class="card-linha">
        <span class="card-icone">☎</span>
        <span class="card-val">${user.phone}</span>
      </div>
      
      <div class="card-linha">
        <span class="card-icone">⌖</span>
        <span class="card-val">${user.address.city}</span>
      </div>

      <div class="card-sep"></div>
      
      <div class="card-empresa">
        <strong>${user.company.name}</strong><br>
        "${user.company.catchPhrase}"
      </div>
    </div>
  `).join('');
}


async function buscarUsuarios() {
  definirCarregando(true);
  const estadoErro = document.getElementById('estadoErro');
  estadoErro.classList.remove('show');

  try {
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    renderizarEstatisticas(dados);
    renderizarCards(dados);

  } catch (erro) {
    estadoErro.classList.add('show');
    document.getElementById('msgErro').textContent = erro.message;
    document.getElementById('grade').innerHTML = '';
  } finally {
    definirCarregando(false);
  }
}


buscarUsuarios();