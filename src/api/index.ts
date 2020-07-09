export interface CryptApiInterface {
  endpoint: string;
}

export type AlgoList = {
  [key: string]: {
    keyLength: number;
    ivLength: number;
  };
};

type cryptProps = {
  file: FileList;
  key: string;
  salt: string;
  algo: string;
};

export default class CryptApi implements CryptApiInterface {
  endpoint = "";
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  encryptFile = (props: cryptProps) => this.cryptFile(props, false);

  decryptFile = (props: cryptProps) => this.cryptFile(props, true);

  cryptFile = async (
    { file, key, salt, algo }: cryptProps,
    decrypt: boolean
  ) => {
    try {
      const path = decrypt ? "/decrypt" : "/encrypt";
      console.log(path);
      const formData = new FormData();
      formData.append("key", key);
      formData.append("salt", salt);
      formData.append("algo", algo);
      formData.append("file", file[0] as File);
      const res = await fetch(this.endpoint + path, {
        method: "POST",
        body: formData,
      });
      if (res.status !== 200) throw new Error("Something went wrong");
      const blob = await res.blob();
      return blob;
    } catch (e) {
      throw new Error(e);
    }
  };

  loadAlgorithms = async () => {
    const response = await fetch(`${this.endpoint}/algorithms`);
    const data: AlgoList = await response.json();
    return data;
  };
}
