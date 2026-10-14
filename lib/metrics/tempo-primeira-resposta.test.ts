import { describe, expect, it } from "vitest";
import { formatarTempoPrimeiraResposta } from "./tempo-primeira-resposta";

describe("formatarTempoPrimeiraResposta", () => {
  it("não confunde ausência de dados com zero", () => {
    expect(formatarTempoPrimeiraResposta(null)).toBe("—");
    expect(formatarTempoPrimeiraResposta(Number.NaN)).toBe("—");
    expect(formatarTempoPrimeiraResposta(-1)).toBe("—");
    expect(formatarTempoPrimeiraResposta(0)).toBe("0s");
  });

  it("exibe segundos e minutos com precisão", () => {
    expect(formatarTempoPrimeiraResposta(45)).toBe("45s");
    expect(formatarTempoPrimeiraResposta(60)).toBe("1min");
    expect(formatarTempoPrimeiraResposta(74)).toBe("1min 14s");
    expect(formatarTempoPrimeiraResposta(3599)).toBe("59min 59s");
  });

  it("exibe horas sem esconder o tempo decorrido", () => {
    expect(formatarTempoPrimeiraResposta(3600)).toBe("1h 00min");
    expect(formatarTempoPrimeiraResposta(4440)).toBe("1h 14min");
    expect(formatarTempoPrimeiraResposta(7320)).toBe("2h 02min");
  });
});
