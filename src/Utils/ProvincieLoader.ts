import {createContext} from "react";

export async function readFileContent(filepath) {
    try {
      const response = await fetch(filepath);
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

const province = null