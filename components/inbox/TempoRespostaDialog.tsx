"use client";

import Link from "next/link";
import { Clock } from "@/lib/ui/icons";
import { useT } from "@/hooks/i18n/useT";
import { useAttendantMetrics, type AttendantMetric } from "@/hooks/metrics/useAttendantMetrics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Exibe duração sem arredondar minutos para zero ou ocultar as horas. */
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

function nomeDoVendedor(vendedor: AttendantMetric, t: (s: string) => string): string {
  return vendedor.name ?? vendedor.email ?? `${t("Atendente")} ${vendedor.user_id.slice(0, 8)}`;
}

interface TempoRespostaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * O painel só é montado depois do clique no Inbox. Reutiliza a API autenticada
 * /api/v1/metrics/attendants e sua RLS: gerente vê a equipe; atendente vê a si.
 * Não busca mensagens nem dados de clientes fora do escopo do usuário.
 */
export function TempoRespostaDialog({ open, onOpenChange }: TempoRespostaDialogProps) {
  const t = useT();
  const { data, isLoading, isError } = useAttendantMetrics(null);
  const vendedores = [...(data?.data.attendants ?? [])].sort((a, b) =>
    nomeDoVendedor(a, t).localeCompare(nomeDoVendedor(b, t), "pt-BR"),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,740px)] w-[calc(100vw-2rem)] max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-5 text-left sm:px-6">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Clock size={20} className="text-primary" aria-hidden />
            {t("Tempo de resposta dos vendedores")}
          </DialogTitle>
          <DialogDescription>
            {t("Média do tempo até a primeira resposta humana ao cliente, nos últimos 30 dias.")}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground" role="status">
              {t("Carregando tempos de resposta…")}
            </p>
          ) : isError || !data ? (
            <p className="py-8 text-center text-sm text-destructive" role="alert">
              {t("Não foi possível carregar os tempos de resposta.")}
            </p>
          ) : vendedores.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("Nenhuma resposta humana registrada no período.")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Vendedor")}</TableHead>
                    <TableHead className="whitespace-nowrap text-right">
                      {t("Conversas atribuídas")}
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-right">
                      {t("1ª resposta (média)")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendedores.map((vendedor) => (
                    <TableRow key={vendedor.user_id}>
                      <TableCell className="max-w-56 truncate font-medium">
                        {nomeDoVendedor(vendedor, t)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {vendedor.conversations_handled}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatarTempoPrimeiraResposta(vendedor.avg_first_response_seconds)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {t("O tempo é contado da primeira mensagem recebida até a primeira resposta humana registrada na conversa. Respostas automáticas não entram na média. “—” significa ausência de dados suficientes, não zero segundos.")}
          </p>
        </div>

        <div className="flex justify-end border-t px-5 py-3 sm:px-6">
          <Button asChild size="sm" variant="outline">
            <Link href="/app/metrics" onClick={() => onOpenChange(false)}>
              {t("Ver desempenho completo")}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
