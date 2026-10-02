export class ListLineOutputParser {
  key: string;

  constructor({ key }: { key: string }) {
    this.key = key;
  }

  async parse(text: string): Promise<string[]> {
    const regex = new RegExp(
      `<${this.key}>([\\s\\S]*?)</${this.key}>`,
      "i"
    );

    const match = text.match(regex);

    if (!match) {
      return [];
    }

    return match[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }
}
