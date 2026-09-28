-- Groq + GPT-OSS 20B
-- Additive and idempotent. Provider CHECK constraints were opened by migration 0127.
-- Runtime: Groq via OpenAI-compatible Chat Completions.

insert into public.ai_models (
  provider,
  model_id,
  display_name,
  description,
  context_window,
  input_price_per_million_cents,
  output_price_per_million_cents,
  supports_tools,
  is_default_for_provider,
  deprecated_at
)
values (
  'groq',
  'openai/gpt-oss-20b',
  'GPT-OSS 20B (Groq)',
  'GPT-OSS 20B servido pela Groq para atendimento rápido e uso de ferramentas.',
  131072,
  null,
  null,
  true,
  true,
  null
)
on conflict (provider, model_id) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  context_window = excluded.context_window,
  supports_tools = excluded.supports_tools,
  is_default_for_provider = excluded.is_default_for_provider,
  deprecated_at = null;
