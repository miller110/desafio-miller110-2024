class Animal {
    constructor(especie, quantidade) {
        const nomes = ["LEAO", "LEOPARDO", "CROCODILO", "MACACO", "GAZELA", "HIPOPOTAMO"];
        this.especie = especie;
        this.quantidade = quantidade;

        if (!nomes.includes(especie)) {
            throw new Error("Animal inválido");
        }

        if (quantidade <= 0 || isNaN(quantidade)) {
            throw new Error("Quantidade inválida");
        }


        if (this.especie === "LEAO") {
            this.tamanho = 3;
            this.bioma = "savana";
            this.carnivoro = true;

        } else if (this.especie === "LEOPARDO") {
            this.tamanho = 2;
            this.bioma = "savana";
            this.carnivoro = true;

        } else if (this.especie === "CROCODILO") {
            this.tamanho = 3;
            this.bioma = "rio";
            this.carnivoro = true;

        } else if (this.especie === "MACACO") {
            this.tamanho = 1;
            this.bioma = ["savana", "floresta"];
            this.carnivoro = false;

        } else if (this.especie === "GAZELA") {
            this.tamanho = 2;
            this.bioma = "savana";
            this.carnivoro = false;

        } else if (this.especie === "HIPOPOTAMO") {
            this.tamanho = 4;
            this.bioma = ["savana", "rio"];
            this.carnivoro = false;
        }
    }
}

class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3, carnivoro: false }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1, carnivoro: false }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1, carnivoro: true }] }
        ];
    }

    analisaRecintos(especie, quantidade) {
        let animal;
        let i = 0;

        try {
            animal = new Animal(especie, quantidade);
        } catch (error) {
            switch (error.message){
                case "Animal inválido":
                    return {erro: "Animal inválido", recintosViaveis: null};
                case "Quantidade inválida":
                    return {erro: "Quantidade inválida", recintosViaveis: null};
            }
        }

        const recintosViaveis = [];
        
        while (i < this.recintos.length){
            const recinto = this.recintos[i];

            const biomaValido = Array.isArray(recinto.bioma) 
                ? (Array.isArray(animal.bioma)
                    ? animal.bioma.some(bioma => recinto.bioma.includes(bioma))
                    : recinto.bioma.includes(animal.bioma))
                : (Array.isArray(animal.bioma)
                    ? animal.bioma.includes(recinto.bioma)
                    : recinto.bioma === animal.bioma);

            if (biomaValido){
                let compatibilidade = true;

                if (animal.carnivoro){
                    const temCarnivoros = recinto.animais.some(animalAtual => animalAtual.carnivoro);
                    const naoTemCarnivoros = recinto.animais.some(animalAtual => !animalAtual.carnivoro);

                    if (naoTemCarnivoros){
                        compatibilidade = false;
                    } else {
                        compatibilidade = temCarnivoros ? recinto.animais.every(animalAtual => animalAtual.carinivoro && animalAtual.especie === animal.especie) : true;
                    }
                } else {
                    const temCarnivoros = recinto.animais.some(animalAtual => animalAtual.carnivoro);
                    compatibilidade = !temCarnivoros;
                }

                switch(animal.especie){
                    case "MACACO":
                        const animaisNaoCarnivoros = recinto.animais.some(animalAtual => !animalAtual.carnivoro);
                        const biomaVazio = recinto.animais.length === 0;

                        compatibilidade = (animal.quantidade > 1) ? (biomaVazio || animaisNaoCarnivoros) : (animaisNaoCarnivoros && recinto.animais.length > 0);
                        break;

                    case "HIPOPOTAMO":
                        const biomaAceito = recinto.bioma.includes("savana") && recinto.bioma.includes("rio");
                        const semCarnivoros = recinto.animais.every(animalAtual => !animalAtual.carnivoro);
                        const biomaVazioHipopotamo = recinto.animais.length === 0;

                        compatibilidade = (biomaAceito && semCarnivoros) || (biomaVazioHipopotamo && (recinto.bioma.includes("savana") || recinto.bioma.includes("rio")));
                        break;
                }

                if (compatibilidade){
                    const espacoOcupado = recinto.animais.reduce((totalEspacoOcupado, animalAtual) => totalEspacoOcupado + (animalAtual.quantidade * new Animal(animalAtual.especie, animalAtual.quantidade).tamanho), 0);

                    const espacoDoAnimal = animal.tamanho * quantidade;
                    const espacoExtra = recinto.animais.some(animalAtual => animalAtual.especie !== animal.especie) ? 1 : 0;
                    const espacoNecessario = espacoDoAnimal + espacoExtra;

                    const espacoRestante = recinto.tamanhoTotal - espacoOcupado;

                    if (espacoRestante >= espacoNecessario){
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante - espacoNecessario} total: ${recinto.tamanhoTotal})`);

                    }
                }
            }
            i++;
        }

        recintosViaveis.sort((recintoA, recintoB) => {
            const numeroA = parseInt(recintoA.split(' ')[1]);
            const numeroB = parseInt(recintoB.split(' ')[1]);
            return numeroA - numeroB;
        });

        if (!recintosViaveis.length){
            return {erro: "Não há recinto viável", recintosViaveis: null};
        }

        return {erro: null, recintosViaveis};
    }
}

export {RecintosZoo as RecintosZoo};
