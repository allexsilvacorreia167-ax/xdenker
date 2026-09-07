"""
XDENKER - Importador TSE → Supabase (estrutura nova)
----------------------------------------------------
Lê os CSVs de etl_tse/dados/ e grava em:
  - titulares  (Deputado Federal, Deputado Estadual, Senador, Governador)
  - suplentes  (Suplentes + Vice-Governador) ligados pelo titular_id

Presidente e Ministros NÃO vêm do TSE → cadastrar manualmente no Admin (tabela executivo).
"""

import os
import pandas as pd
from supabase import create_client

# ============================================================
# CONFIGURAÇÃO
# ============================================================
SUPABASE_URL = "https://kpdwkvunapbxewwjnqdp.supabase.co"
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://kpdwkvunapbxewwjnqdp.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_SERVICE_KEY:
    raise Exception("Defina a variável de ambiente SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
PASTA_DADOS = "dados"

# Mapeamento de espectro por partido
MAPEAMENTO_ESPECTRO = {
    "PT": "Esquerda", "PC DO B": "Esquerda", "PCDOB": "Esquerda", "PSOL": "Esquerda",
    "PSTU": "Esquerda", "PCB": "Esquerda", "PCO": "Esquerda", "UP": "Esquerda",
    "PSB": "Centro-Esquerda", "PDT": "Centro-Esquerda", "REDE": "Centro-Esquerda", "PV": "Centro-Esquerda",
    "MDB": "Centro", "PSD": "Centro", "PSDB": "Centro", "CIDADANIA": "Centro",
    "PODEMOS": "Centro", "PODE": "Centro", "AGIR": "Centro", "AVANTE": "Centro",
    "MOBILIZA": "Centro", "PMN": "Centro", "PMB": "Centro", "DC": "Centro",
    "UNIÃO": "Centro-Direita", "UNIAO": "Centro-Direita", "PP": "Centro-Direita",
    "REPUBLICANOS": "Centro-Direita", "PRD": "Centro-Direita", "SOLIDARIEDADE": "Centro-Direita",
    "PL": "Direita", "NOVO": "Direita", "PRTB": "Direita", "MISSÃO": "Direita", "MISSAO": "Direita",
}

# Cargos que vamos importar como TITULARES
CARGOS_TITULARES = {
    "DEPUTADO FEDERAL",
    "DEPUTADO ESTADUAL",
    "DEPUTADO DISTRITAL",
    "SENADOR",
    "GOVERNADOR",
}

# ============================================================
# FUNÇÕES AUXILIARES
# ============================================================
def normalizar_partido(partido: str) -> str:
    return str(partido or "").strip().upper()


def obter_espectro(partido: str) -> str:
    return MAPEAMENTO_ESPECTRO.get(normalizar_partido(partido), "Centro")


def limpar_texto(valor) -> str:
    return str(valor or "").strip()


def eh_eleito_titular(status: str) -> bool:
    """Retorna True apenas para eleitos titulares (não suplentes)."""
    s = (status or "").upper()
    if "SUPLENTE" in s:
        return False
    if "NÃO ELEITO" in s or "NAO ELEITO" in s:
        return False
    # ELEITO, ELEITO POR QP, ELEITO POR MÉDIA, etc.
    return "ELEITO" in s


def eh_suplente(status: str) -> bool:
    s = (status or "").upper()
    return "SUPLENTE" in s and "NÃO" not in s and "NAO" not in s


def eh_vice_governador(cargo: str) -> bool:
    c = (cargo or "").upper()
    return "VICE" in c and "GOVERNADOR" in c


# ============================================================
# IMPORTAÇÃO
# ============================================================
def processar_arquivos():
    if not os.path.exists(PASTA_DADOS):
        print(f"Erro: pasta '{PASTA_DADOS}' não encontrada.")
        return

    total_titulares = 0
    total_suplentes = 0

    # Cache para ligar suplente → titular
    # chave: (uf, cargo_base, numero_urna) → id do titular no Supabase
    mapa_titulares = {}

    arquivos = sorted([f for f in os.listdir(PASTA_DADOS) if f.endswith(".csv")])

    for arquivo in arquivos:
        # Evita duplicidade do arquivo consolidado nacional
        if "BRASIL" in arquivo.upper() or arquivo.upper().endswith("_BR.CSV"):
            print(f"Pulando arquivo consolidado: {arquivo}")
            continue

        caminho = os.path.join(PASTA_DADOS, arquivo)
        print(f"\nProcessando: {arquivo}")

        try:
            df = pd.read_csv(caminho, sep=";", encoding="latin1", low_memory=False)
        except Exception as e:
            print(f"  Erro ao ler CSV: {e}")
            continue

        if "DS_SIT_TOT_TURNO" not in df.columns or "DS_CARGO" not in df.columns:
            print("  Colunas necessárias não encontradas. Pulando.")
            continue

        # ----------------------------------------------------------
        # 1. Primeiro grava os TITULARES
        # ----------------------------------------------------------
        titulares_lote = []

        for _, row in df.iterrows():
            cargo = limpar_texto(row.get("DS_CARGO", "")).upper()
            status = limpar_texto(row.get("DS_SIT_TOT_TURNO", ""))
            uf = limpar_texto(row.get("SG_UF", "")).upper()
            numero = row.get("NR_CANDIDATO")

            # Só cargos que nos interessam
            if cargo not in CARGOS_TITULARES and not (cargo == "DEPUTADO DISTRITAL"):
                continue

            if not eh_eleito_titular(status):
                continue

            # Normaliza nome do cargo
            if "DISTRITAL" in cargo:
                cargo_final = "Deputado Estadual"  # DF trata como estadual
            elif "DEPUTADO FEDERAL" in cargo:
                cargo_final = "Deputado Federal"
            elif "DEPUTADO ESTADUAL" in cargo:
                cargo_final = "Deputado Estadual"
            elif "SENADOR" in cargo:
                cargo_final = "Senador"
            elif "GOVERNADOR" in cargo:
                cargo_final = "Governador"
            else:
                continue

            partido = normalizar_partido(row.get("SG_PARTIDO", ""))
            registro = {
                "nome_urna": limpar_texto(row.get("NM_URNA_CANDIDATO") or row.get("NM_CANDIDATO")),
                "nome_completo": limpar_texto(row.get("NM_CANDIDATO")),
                "cargo": cargo_final,
                "partido": partido,
                "uf": uf,
                "numero_urna": int(numero) if pd.notna(numero) else None,
                "espectro": obter_espectro(partido),
                "status": "eleito_agora",
                "ativo": True,
            }
            titulares_lote.append(registro)

        # Insere titulares em lotes e guarda o mapa id
        if titulares_lote:
            for i in range(0, len(titulares_lote), 200):
                lote = titulares_lote[i:i + 200]
                try:
                    resp = supabase.table("titulares").insert(lote).execute()
                    # Monta mapa para amarrar suplentes depois
                    for reg, inserted in zip(lote, resp.data):
                        chave = (
                            reg["uf"],
                            reg["cargo"],
                            reg["numero_urna"],
                        )
                        mapa_titulares[chave] = inserted["id"]
                    total_titulares += len(lote)
                except Exception as e:
                    print(f"  Erro ao inserir titulares: {e}")

            print(f"  → {len(titulares_lote)} titulares inseridos")

        # ----------------------------------------------------------
        # 2. Depois grava os SUPLENTES + VICE-GOVERNADORES
        # ----------------------------------------------------------
        suplentes_lote = []

        for _, row in df.iterrows():
            cargo = limpar_texto(row.get("DS_CARGO", "")).upper()
            status = limpar_texto(row.get("DS_SIT_TOT_TURNO", ""))
            uf = limpar_texto(row.get("SG_UF", "")).upper()
            numero = row.get("NR_CANDIDATO")

            # Vice-Governador
            if eh_vice_governador(cargo):
                # Tenta achar o Governador titular da mesma UF
                chave_gov = (uf, "Governador", None)  # número pode variar
                # Busca qualquer governador da UF no mapa
                titular_id = None
                for (u, c, n), tid in mapa_titulares.items():
                    if u == uf and c == "Governador":
                        titular_id = tid
                        break

                if not titular_id:
                    continue  # sem governador, não grava o vice

                partido = normalizar_partido(row.get("SG_PARTIDO", ""))
                suplentes_lote.append({
                    "titular_id": titular_id,
                    "nome_urna": limpar_texto(row.get("NM_URNA_CANDIDATO") or row.get("NM_CANDIDATO")),
                    "nome_completo": limpar_texto(row.get("NM_CANDIDATO")),
                    "tipo": "Vice-Governador",
                    "partido": partido,
                    "uf": uf,
                    "numero_urna": int(numero) if pd.notna(numero) else None,
                    "espectro": obter_espectro(partido),
                    "status_eleitoral": status,
                    "ativo": True,
                })
                continue

            # Suplentes normais
            if not eh_suplente(status):
                continue

            # Define o cargo base do titular correspondente
            if "DEPUTADO FEDERAL" in cargo:
                cargo_titular = "Deputado Federal"
            elif "DEPUTADO ESTADUAL" in cargo or "DEPUTADO DISTRITAL" in cargo:
                cargo_titular = "Deputado Estadual"
            elif "SENADOR" in cargo:
                cargo_titular = "Senador"
            else:
                continue

            chave = (uf, cargo_titular, int(numero) if pd.notna(numero) else None)
            titular_id = mapa_titulares.get(chave)

            if not titular_id:
                # Tenta achar só por UF + cargo + número (às vezes o cargo vem diferente)
                continue

            # Define se é 1º ou 2º suplente pelo texto do status
            tipo = "1º Suplente"
            if "2º" in status or "2 " in status:
                tipo = "2º Suplente"
            elif "3º" in status:
                tipo = "3º Suplente"

            partido = normalizar_partido(row.get("SG_PARTIDO", ""))
            suplentes_lote.append({
                "titular_id": titular_id,
                "nome_urna": limpar_texto(row.get("NM_URNA_CANDIDATO") or row.get("NM_CANDIDATO")),
                "nome_completo": limpar_texto(row.get("NM_CANDIDATO")),
                "tipo": tipo,
                "partido": partido,
                "uf": uf,
                "numero_urna": int(numero) if pd.notna(numero) else None,
                "espectro": obter_espectro(partido),
                "status_eleitoral": status,
                "ativo": True,
            })

        if suplentes_lote:
            for i in range(0, len(suplentes_lote), 200):
                lote = suplentes_lote[i:i + 200]
                try:
                    supabase.table("suplentes").insert(lote).execute()
                    total_suplentes += len(lote)
                except Exception as e:
                    print(f"  Erro ao inserir suplentes: {e}")

            print(f"  → {len(suplentes_lote)} suplentes/vices inseridos")

    print("\n======================================")
    print(f"Importação finalizada!")
    print(f"Total titulares : {total_titulares}")
    print(f"Total suplentes : {total_suplentes}")
    print("======================================")
    print("Lembrete: Presidente, Vice e Ministros devem ser cadastrados manualmente na tabela 'executivo'.")


if __name__ == "__main__":
    processar_arquivos()
