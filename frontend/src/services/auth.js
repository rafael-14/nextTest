export const TOKEN_KEY = '&app-token';
export const ID_SETOR = "&id-setor";
export const NOME_SETOR = "&nome-setor";
export const USER_TYPE = "&user-type";

export function login(token) { localStorage.setItem(TOKEN_KEY, token)}
export const logout = () => { localStorage.clear()};

export const setIdSetor = id => localStorage.setItem(ID_SETOR, id);
export const getIdSetor = () => localStorage.getItem(ID_SETOR);

export const setNomeSetor = nome => localStorage.setItem(NOME_SETOR, nome);
export const getNomeSetor = () => localStorage.getItem(NOME_SETOR);

export const getToken = () => localStorage.getItem(TOKEN_KEY);