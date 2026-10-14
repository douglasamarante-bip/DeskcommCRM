/** Duração média da primeira resposta humana em texto legível. */
export function formatarTempoPrimeiraResposta(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.round(seconds);
  if (total < 60) return `${total}s`;
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  if (horas > 0) return `${horas}h ${String(minutos).padStart(2, "0")}min`;
  return segundos ? `${minutos}min ${String(segundos).padStart(2, "0")}s` : `${minutos}min`;
}
