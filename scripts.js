// Seleciona os elementos do formulario
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const form = document.querySelector("form")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
 // Navega ate o span para pegar o elemento
const expensesQuantity = document.querySelector("aside header p span")
 // Navega ate o h2 para pegar o elemento
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  // Obtem o valor atual do input e remove os caracteres não numericos
    let value = amount.value.replace(/\D/g, "")
    
    // Transforma o valor em centavos
    value = Number(value) / 100

    // Atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Retorna & Formata o valor no padrão BRL, padrão Brasileiro
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (e) => {
  // Previne o comportamento padrão do evento de recarregar a pagina
  e.preventDefault()

  // Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(), // Estrategia para definir o Id com o timestamp
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text, // Pega o texto da opção selecionada atraves do indice selecionado
    amount: amount.value,
    created_at: new Date()
  }

  // Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento de li para adicionar o item na lista ul
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense
    
    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona nome e categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")
    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na lista
    expenseList.append(expenseItem)

    // Limpa o formulario para adicionar um novo item
    formClear()

    // Atualiza os totais
    updateTotals()
    
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals(){
   try {
     // Recupera todos os itens (li) da lista (ul)
     const items = expenseList.children

     // Atualiza a quantidade de itens da lista
     expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

     // Variável para incrementar o total
     let total = 0
    // Percorre cada item (li) da lista (ul)
     for(let item = 0; item < items.length; item++) {
        const itemAmount = items[item].querySelector(".expense-amount")

        // Remove caracteres não numericos e substitui a virgula pelo ponto.
        let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(", ", ".")

        value = parseFloat(value)

        if(isNaN(value)) {
          return alert(
            "Não foi possível calcular o total. O valor não parece ser um número"
          )
        }

        // Incrementar o valor total
        total += Number(value)
     }

     // Cria a span para adicionar o R$ formatado
     const symbolBRL = document.createElement("small")
     symbolBRL.textContent = "R$"

     // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
     total = formatCurrencyBRL(total).toUpperCase().replace("R$","")
    
     // Limpa o conteudo do elemento
     expensesTotal.innerHTML = ""

     // Adiciona o simbolo da moeda e valor formatado
     expensesTotal.append(symbolBRL, total)
   } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
   }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
  // Verifica se o elemento clicado é o icone de remover
  if(event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")
    
    // Remove o item da lista
    item.remove()
  }
  // Atualiza os itens da lista
  updateTotals()
})

function formClear() {
  // Limpa os inputs
  amount.value = ""
  expense.value = ""
  category.value = ""
  // Coloca o foco no input amount
  expense.focus()
}