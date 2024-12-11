let campoId = 0; // Contador global para os campos adicionados
let proximoId = 1;
const idsDisponiveis = new Set(); // Armazena IDs liberados para reutilização

document.getElementById('adicionarCampo').addEventListener('click', function () {
    // Determina o próximo número para o campo
    const novoCampoId = idsDisponiveis.size > 0 ? Math.min(...idsDisponiveis) : proximoId++;

    // Remove o ID da lista de disponíveis
    idsDisponiveis.delete(novoCampoId);

    // Cria o grupo do campo
    const novoCampo = document.createElement('div');
    novoCampo.className = 'my-3';
    novoCampo.id = `campo-${novoCampoId}`;

    // Cria o label
    const label = document.createElement('label');
    label.setAttribute('for', `campoExtra${novoCampoId}`);
    label.className = 'form-label';
    label.textContent = `Artigo ${novoCampoId}`;

    // Campo de entrada (textarea)
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control';
    textarea.name = `campoExtra${novoCampoId}`;
    textarea.id = `campoExtra${novoCampoId}`;
    textarea.rows = 2;
    textarea.placeholder = `Digite algo para o campo extra ${novoCampoId}`;

    // Botão de apagar
    const botaoApagar = document.createElement('button');
    botaoApagar.type = 'button';
    botaoApagar.className = 'btn btn-danger mt-2';
    botaoApagar.innerHTML = '<i class="fa-regular fa-xmark"></i> Apagar';
    botaoApagar.onclick = function () {
        // Remove o campo e devolve o ID à lista de disponíveis
        document.getElementById(`campo-${novoCampoId}`).remove();
        idsDisponiveis.add(novoCampoId);
    };

    // Adiciona os elementos ao grupo
    novoCampo.appendChild(label);
    novoCampo.appendChild(textarea);
    novoCampo.appendChild(botaoApagar);

    // Adiciona o grupo ao contêiner
    document.getElementById('camposAdicionais').appendChild(novoCampo);

    // Incrementa o contador global
    campoId++;
});

// Obtendo os elementos
const justSim = document.getElementById('justSim');
const justNao = document.getElementById('justNao');
const justTextarea = document.getElementById('justTextarea');

// Função para mostrar ou esconder o div com textarea
function toggleJustTextarea() {
    if (justSim.checked) {
        justTextarea.style.display = 'block'; // Mostra o textarea
    } else {
        justTextarea.style.display = 'none'; // Esconde o textarea
    }
}

// Adiciona eventos para monitorar as mudanças nos inputs
justSim.addEventListener('change', toggleJustTextarea);
justNao.addEventListener('change', toggleJustTextarea);

// Chama a função para definir o estado inicial
toggleJustTextarea();

function carregarImagem(url) {
    return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        });
}

const imagemUrl = "https://i.imgur.com/7F8ftTl.png"; // Substitua pelo URL da sua imagem

carregarImagem(imagemUrl).then((imagemBase64) => {
    createPDF(imagemBase64);
});

// Função para gerar o PDF com jsPDF
function createPDF(imagemBase64) {
    const { jsPDF } = window.jspdf;

    // Agrupando os valores em um objeto
    const formData = {
        categoria: document.getElementById('categoria').value || "",
        id: document.getElementById('idnum').value || "",
        data: document.getElementById('data').value || "",
        cidade: document.getElementById('cidade').value || "",
        nome: document.getElementById('nome').value || "",
        cargo: document.getElementById('cargo').value || "",
        orgao: document.getElementById('orgao').value || "",
        estado: document.getElementById('estado').value || "",
        prefacio: document.getElementById('prefacio').value || "",
        fonte: document.getElementById('fonte').value || "helvetica",
        justificativa: document.getElementById('justificativa').value || "",
    };

    const categoria = formData.categoria;
    let categoriaNome;
    switch (categoria) {
        case 'PL':
            categoriaNome = 'Projeto de Lei';
            break;
        case 'PEC':
            categoriaNome = 'Proposta de Emenda à Constituição';
            break;
        case 'PER':
            categoriaNome = 'Proposta de Emenda ao Regimento';
            break;
        case 'PDL':
            categoriaNome = 'Projeto de Decreto Legislativo';
            break;
        case 'PLC':
            categoriaNome = 'Projeto de Lei Complementar';
            break;
        default:
            categoriaNome = 'Categoria Desconhecida';
    }

    let frase1;
    switch(formData.cargo){
        case 'Presidente':
            frase1 = 'O PRESIDENTE DA REPÚBLICA no uso da atribuição que lhe confere na Constituição Federal, ';
            break;
        case 'Senador':
            frase1 = 'O Congresso Nacional ';
            break;
        case 'Deputado':
            frase1 = 'O Congresso Nacional ';
            break;
        case 'Governador':
            frase1 = 'O GOVERNADOR no uso da atribuição que lhe confere na Constituição Federal, ';
            break;
        default:
            frase1 = 'O Congresso Nacional ';
    }

    let frase2;
    if (formData.cargo === 'Presidente' && formData.categoria === 'PL' || formData.cargo === 'Governador' && formData.categoria === 'PL') {
        frase2 = 'protocola o seguinte Projeto de Lei:';
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PEC' || formData.cargo === 'Governador' && formData.categoria ==='PEC') {
        frase2 = 'protocola a seguinte Proposta de Emenda à Constituição:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PER' || formData.cargo === 'Governador' && formData.categoria ==='PER') {
        frase2 = 'protocola a seguinte Proposta de Emenda ao Regimento:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PDL' || formData.cargo === 'Governador' && formData.categoria ==='PDL') {
        frase2 = 'protocola o seguinte Projeto de Decreto Legislativo:'
    } else if (formData.cargo === 'Presidente' && formData.categoria ==='PLC' || formData.cargo === 'Governador' && formData.categoria ==='PLC') {
        frase2 = 'protocola o seguinte Projeto de Lei Complementar:'
    } else {
        frase2 = 'decreta:';
    }
    
    const frase12 = frase1 + frase2;

    const categoriaNomeM = categoriaNome ? categoriaNome.toUpperCase() : '';

    // Converte a data para o objeto Date
    const dataObj = new Date(formData.data + 'T00:00:00');;
    const ano = dataObj.getFullYear();

    // Formato 1: 07/12/2024 (dd/mm/yyyy)
    const dataFormatada1 = dataObj.toLocaleDateString('pt-BR');

    // Formato 2: 7 de dezembro de 2024
    const dataFormatada2 = dataObj.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Formato 3: 7 DE DEZEMBRO DE 2024 (tudo em maiúsculo)
    const dataFormatada3 = dataFormatada2.toUpperCase();

    // Inicializando jsPDF
    const doc = new jsPDF();

    doc.setFontSize(12);
    let y = 10; // Posição inicial no eixo Y
    const pageHeight = 297; // Altura da página em mm
    const marginBottom = 20; // Margem inferior para evitar cortar texto

    // Função para verificar e adicionar quebra de página
    function verificarQuebraPagina(incrementoAltura) {
        if (y + incrementoAltura > pageHeight - marginBottom) {
            doc.addPage();
            y = 10; // Reinicia a posição Y na nova página
        }
    }

    // Adicionar imagem
    if (imagemBase64) {
        doc.addImage(imagemBase64, 'PNG', 10, 10, 1200, 800); // Altere as dimensões e posição conforme necessário
    }
    y += 40; // Ajustar posição Y

    // Adicionando cabeçalho
    y += 20;
    verificarQuebraPagina(10);
    doc.setFont(formData.fonte, 'bold');
    doc.text(`${categoriaNomeM} Nº ${formData.id} DE ${dataFormatada3}`, 100, y, { align: 'center' });

    // Prefácio/ementa
    y += 20;
    doc.setFont(formData.fonte, 'italic');
    if (formData.prefacio) {
        verificarQuebraPagina(10);
        const prefacioTexto = doc.splitTextToSize(formData.prefacio, 100);
        doc.text(prefacioTexto, 200, y, { align: 'right' });
        y += prefacioTexto.length * 6; // Ajuste para múltiplas linhas
    }

    // Texto inicial
    y += 30;
    doc.setFont(formData.fonte, 'normal');
    if (frase12) {
        verificarQuebraPagina(10);
        const fraseTexto = doc.splitTextToSize(frase12, 180);
        doc.text(fraseTexto, 10, y, { align: 'left' });
        y += fraseTexto.length * 6;
    }

    // Adicionar campos extras
    y += 10;
    for (let i = 1; i <= campoId; i++) {
        const campoExtra = document.querySelector(`textarea[name="campoExtra${i}"]`);
        if (campoExtra) {
            verificarQuebraPagina(10);
            const textoCampo = `Art. ${i}º - ${campoExtra.value}`;
            const textoQuebrado = doc.splitTextToSize(textoCampo, 180);
            doc.text(textoQuebrado, 10, y);
            y += textoQuebrado.length * 6; // Ajuste para múltiplas linhas
        }
    }

    // Adicionar texto final
    const textoFinal = `Art. ${campoId + 1}º - Este ${categoriaNome} entra em vigor na data de sua publicação.`;
    verificarQuebraPagina(10);
    const textoFinalQuebrado = doc.splitTextToSize(textoFinal, 180);
    doc.text(textoFinalQuebrado, 10, y);
    y += textoFinalQuebrado.length * 6;

    // Cidade e data
    y += 20;
    verificarQuebraPagina(10);
    doc.setFont(formData.fonte, 'normal');
    doc.text(`${formData.cidade}, ${dataFormatada2}`, 200, y, { align: 'right' });

    // Nova página para justificativa
    doc.addPage();
    y = 30;
    doc.text(`JUSTIFICATIVA`, 110, y, { align: 'center' });

    // Adicionar justificativa
    y += 20;
    const justificativaTexto = doc.splitTextToSize(formData.justificativa, 180);
    doc.text(justificativaTexto, 10, y);

    // Retornar o documento
    return doc;

}

// Mostrar os dados do formulário em uma div
function showInDiv() {
    const formData = {
        categoria: document.getElementById('categoria').value || "",
        id: document.getElementById('idnum').value || "",
        data: document.getElementById('data').value || "",
        cidade: document.getElementById('cidade').value || "",
        nome: document.getElementById('nome').value || "",
        cargo: document.getElementById('cargo').value || "",
        orgao: document.getElementById('orgao').value || "",
        estado: document.getElementById('estado').value || "",
        prefacio: document.getElementById('prefacio').value || "",
    };

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h4>Resultado:</h4>
        <p><strong>Nome:</strong> ${formData.nome}</p>
        <p><strong>Categoria:</strong> ${formData.categoria}</p>
        <p><strong>Data:</strong> ${formData.data}</p>
        <p><strong>Cidade:</strong> ${formData.cidade}</p>
        <p><strong>Prefácio:</strong> ${formData.prefacio}</p>
    `;
}

// Pré-visualizar o PDF em uma nova aba
function previewPDF() {
    const doc = createPDF();
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
}

// Baixar o PDF
function downloadPDF() {
    const doc = createPDF();
    doc.save("formulario.pdf");
}
