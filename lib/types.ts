export type Category='Evictions'|'Nominations'|'Weekend Ka Vaar'|'Fights & drama'|'Wild cards'|'Tasks & captaincy'|'Other';
export type Story={language?:'Hindi'|'English';id:string;title:string;summary:string;source:string;published:string;url:string;category:Category;important:boolean;spoiler:boolean};
export type Episode={id:number;number:number;title:string;airdate:string;url:string};
