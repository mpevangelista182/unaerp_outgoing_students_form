document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("mobilityForm");
  const submitBtn = document.getElementById("submitBtn");

  // === Barra de progresso ===
  const progressContainer = document.createElement("div");
  progressContainer.style.display = "none";
  progressContainer.style.marginTop = "15px";
  progressContainer.style.background = "#e6e6e6";
  progressContainer.style.borderRadius = "6px";
  progressContainer.style.height = "22px";
  progressContainer.style.overflow = "hidden";
  progressContainer.style.position = "relative";

  const progressBar = document.createElement("div");
  progressBar.style.height = "100%";
  progressBar.style.width = "0%";
  progressBar.style.background = "#0066cc";
  progressBar.style.transition = "width 0.3s ease";

  const progressText = document.createElement("span");
  progressText.style.position = "absolute";
  progressText.style.top = "0";
  progressText.style.left = "50%";
  progressText.style.transform = "translateX(-50%)";
  progressText.style.color = "#fff";
  progressText.style.fontSize = "0.9em";
  progressText.style.lineHeight = "22px";
  progressText.textContent = "0%";

  progressContainer.appendChild(progressBar);
  progressContainer.appendChild(progressText);
  submitBtn.insertAdjacentElement("afterend", progressContainer);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    // === 1️⃣ Verificação de uploads obrigatórios ===
    const requiredFiles = [
      { id: "curriculo", label: "Currículo Lattes ou Vitae" },
      { id: "historico", label: "Histórico Escolar da UNAERP" },
      { id: "passaporte", label: "Passaporte" },
      { id: "termoCiencia", label: "Termo de Ciência e Responsabilidade" },
      { id: "termoLGPD", label: "Termo LGPD" },
      { id: "termoFinanceiro", label: "Termo de Ciência e Responsabilidade Financeira" },
      { id: "cartaMotivacao", label: "Carta de Motivação" }
    ];

    const missingFiles = [];
    const invalidFormat = [];

    requiredFiles.forEach(f => {
      const input = document.getElementById(f.id);
      if (!input || !input.files || input.files.length === 0) {
        missingFiles.push(f.label);
      } else {
        const file = input.files[0];
        const ext = file.name.split(".").pop().toLowerCase();
        if (ext !== "pdf") invalidFormat.push(f.label);
      }
    });

    if (missingFiles.length > 0) {
      alert("Por favor, envie os seguintes arquivos obrigatórios:\n\n" + missingFiles.join("\n"));
      return resetButton();
    }

    if (invalidFormat.length > 0) {
      alert("Os seguintes arquivos não estão em formato PDF:\n\n" + invalidFormat.join("\n") + "\n\nEnvie apenas arquivos .pdf.");
      return resetButton();
    }

    // === 2️⃣ Preparar dados e backend ===
    const formData = new FormData(form);
    const url = form.action;

    if (!url) {
      alert("Nenhum endpoint configurado. Defina o atributo 'action' do formulário para o seu backend.");
      return resetButton();
    }

    // === 3️⃣ Exibir barra de progresso ===
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressText.textContent = "0%";

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    xhr.upload.addEventListener("progress", function (event) {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percent + "%";
        progressText.textContent = percent + "%";
      }
    });

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        progressBar.style.width = "100%";
        progressText.textContent = "100%";
        alert("✅ Obrigado! Seu formulário foi enviado com sucesso!");
        form.reset();
      } else {
        alert("❌ Erro ao enviar o formulário. Código: " + xhr.status);
      }
      resetButton();
    };

    xhr.onerror = function () {
      alert("❌ Falha de conexão durante o envio. Verifique sua internet ou o servidor de destino.");
      resetButton();
    };

    xhr.send(formData);

    // === 4️⃣ Reset visual e botão ===
    function resetButton() {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Formulário";
      setTimeout(() => {
        progressContainer.style.display = "none";
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
      }, 1500);
    }
  });
});
