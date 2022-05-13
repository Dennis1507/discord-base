import fs from 'fs';

export async function getLang(lang: string, str: string, ...args: Array<string>) {

	if (!(lang + '.json' in fs.readdirSync('./src/lang'))) lang = 'en-GB';
	const langFile: Record<string, string> = await import(`./${lang}.json`);
	if (str in langFile) {
		let i = -1;
		return langFile[str].replace(/\$_/g, () => {
			i++;
			return args[i];
		});
	}
	else {return `${str} was not found in the language file.`;}
}