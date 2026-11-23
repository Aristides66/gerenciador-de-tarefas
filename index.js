const fs = require("fs/promises")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const ARQUIVO = process.env.ARQUIVO_TAREFAS || "tarefas.json"

function perguntar(texto) {
    return new Promise(resolve => rl.question(texto, resolve))
}

async function listar() {
    try {
        const dados = await fs.readFile(ARQUIVO, "utf-8")
        return JSON.parse(dados)
    } catch (erro) {
        if (erro.code === "ENOENT") return []
        throw erro
    }
}

async function gravar(tarefas) {
    await fs.writeFile(ARQUIVO, JSON.stringify(tarefas, null, 2))
}

async function salvar(nome) {
    const tarefas = await listar()

    const novaTarefa = {
        nome,
        concluida: false
    }

    tarefas.push(novaTarefa)
    await gravar(tarefas)

    return novaTarefa
}

async function buscar(nome) {
    const tarefas = await listar()

    return tarefas.find(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase()) || null
}

async function concluir(nome) {
    const tarefas = await listar()

    const tarefa = tarefas.find(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase())

    if (!tarefa) return null

    tarefa.concluida = true

    await gravar(tarefas)

    return tarefa
}

async function remover(nome) {
    const tarefas = await listar()

    const novaLista = tarefas.filter(tarefa => tarefa.nome.toLowerCase() !== nome.toLowerCase())

    if (novaLista.length === tarefas.length) return false

    await gravar(novaLista)

    return true
}

async function iniciar() {
    let opcao = ""

    while (opcao !== "0") {
        console.log("\n===== GERENCIADOR DE TAREFAS =====")
        console.log("1 - Cadastrar tarefa")
        console.log("2 - Listar tarefas")
        console.log("3 - Buscar tarefa")
        console.log("4 - Concluir tarefa")
        console.log("5 - Remover tarefa")
        console.log("0 - Sair")

        opcao = await perguntar("\nEscolha uma opção: ")

        if (opcao === "1") {
            const nome = await perguntar("Nome da tarefa: ")

            if (!nome.trim()) {
                console.log("Digite um nome válido!")
                continue
            }

            await salvar(nome)
            console.log("Tarefa cadastrada!")

        } else if (opcao === "2") {
            const tarefas = await listar()

            if (tarefas.length === 0) {
                console.log("Nenhuma tarefa cadastrada!")
            } else {
                tarefas.forEach(tarefa => {
                    console.log(`${tarefa.nome} - ${tarefa.concluida ? "Concluída" : "Pendente"}`)
                })
            }

        } else if (opcao === "3") {
            const nome = await perguntar("Digite o nome da tarefa: ")
            const tarefa = await buscar(nome)

            console.log(tarefa || "Tarefa não encontrada!")

        } else if (opcao === "4") {
            const nome = await perguntar("Digite o nome da tarefa: ")
            const tarefa = await concluir(nome)

            console.log(tarefa ? "Tarefa concluída!" : "Tarefa não encontrada!")

        } else if (opcao === "5") {
            const nome = await perguntar("Digite o nome da tarefa: ")
            const resultado = await remover(nome)

            console.log(resultado ? "Tarefa removida!" : "Tarefa não encontrada!")

        } else if (opcao === "0") {
            console.log("Sistema encerrado!")

        } else {
            console.log("Opção inválida!")
        }
    }

    rl.close()
}

iniciar().catch(erro => {
    console.error("Erro:", erro.message)
    rl.close()
})

module.exports = { listar, salvar, buscar, concluir, remover }