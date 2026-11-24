
const fs = require("fs")
const prompt = require("prompt-sync")()

const ARQUIVO = process.env.ARQUIVO_TAREFAS || "tarefas.json"

function listar() {
    try {
        const dados = fs.readFileSync(ARQUIVO, "utf-8")
        return JSON.parse(dados)
    } catch (erro) {
        if (erro.code === "ENOENT") return []
        throw erro
    }
}

function gravar(tarefas) {
    fs.writeFileSync(ARQUIVO, JSON.stringify(tarefas, null, 2))
}

function salvar(nome) {
    const tarefas = listar()

    const novaTarefa = {
        nome,
        concluida: false
    }

    tarefas.push(novaTarefa)
    gravar(tarefas)

    return novaTarefa
}

function buscar(nome) {
    const tarefas = listar()

    return tarefas.find(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase()) || null
}

function concluir(nome) {
    const tarefas = listar()

    const tarefa = tarefas.find(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase())

    if (!tarefa) return null

    tarefa.concluida = true

    gravar(tarefas)

    return tarefa
}

function remover(nome) {
    const tarefas = listar()

    const novaLista = tarefas.filter(tarefa => tarefa.nome.toLowerCase() !== nome.toLowerCase())

    if (novaLista.length === tarefas.length) return false

    gravar(novaLista)

    return true
}

function iniciar() {
    let opcao = ""

    while (opcao !== "0") {
        console.log("\n===== GERENCIADOR DE TAREFAS =====")
        console.log("1 - Cadastrar tarefa")
        console.log("2 - Listar tarefas")
        console.log("3 - Buscar tarefa")
        console.log("4 - Concluir tarefa")
        console.log("5 - Remover tarefa")
        console.log("0 - Sair")

        opcao = prompt("\nEscolha uma opção: ")

        if (opcao === "1") {
            const nome = prompt("Nome da tarefa: ")

            if (!nome.trim()) {
                console.log("Digite um nome válido!")
                continue
            }

            salvar(nome)
            console.log("Tarefa cadastrada!")

        } else if (opcao === "2") {
            const tarefas = listar()

            if (tarefas.length === 0) {
                console.log("Nenhuma tarefa cadastrada!")
            } else {
                tarefas.forEach(tarefa => {
                    console.log(`${tarefa.nome} - ${tarefa.concluida ? "Concluída" : "Pendente"}`)
                })
            }

        } else if (opcao === "3") {
            const nome = prompt("Digite o nome da tarefa: ")
            const tarefa = buscar(nome)

            console.log(tarefa || "Tarefa não encontrada!")

        } else if (opcao === "4") {
            const nome = prompt("Digite o nome da tarefa: ")
            const tarefa = concluir(nome)

            console.log(tarefa ? "Tarefa concluída!" : "Tarefa não encontrada!")

        } else if (opcao === "5") {
            const nome = prompt("Digite o nome da tarefa: ")
            const resultado = remover(nome)

            console.log(resultado ? "Tarefa removida!" : "Tarefa não encontrada!")

        } else if (opcao === "0") {
            console.log("Sistema encerrado!")

        } else {
            console.log("Opção inválida!")
        }
    }
}

try {
    iniciar()
} catch (erro) {
    console.error("Erro:", erro.message)
}

module.exports = { listar, salvar, buscar, concluir, remover }
