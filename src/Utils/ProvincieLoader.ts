import * as fs from 'fs';
const provincieLoader = (filePath: string) => {
    const provincies: {nome: string, sigla: string}[] = [];
    const file = fs.readFileSync(filePath, 'utf-8');
    const fileLines = file.split('\n');
    fileLines.forEach((line) => {
        provincies.push({
            nome: line.split(',')[0],
            sigla: line.split(',')[1],
        });
    });
    return provincies;
}

async function readFileContent() {
    try {
      const response = await fetch('./src/Utils/province-sigle.csv');
      const text = await response.text();
      // console.log(text); // Do something with the file content
        const provincie: {nome: string, sigla: string}[] = [];
        const fileLines = text.split('\n');
        fileLines.forEach((line) => {
            try {
                provincie.push({
                    nome: line.split(',')[0],
                    sigla: line.split(',')[1].slice(0, 2),
                });
            } catch (error) {
                console.error(error);
            }

        });
        console.log(provincie);
        return provincie;
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

export const provincie = await readFileContent();
