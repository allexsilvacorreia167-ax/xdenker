import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip()

def popular_todos_ministerios():
    print("Conectando ao banco de dados...")
    # Adicionado connect_args para estabilizar a conexão SSL com o Supabase
    engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})

    # Lista ajustada com os termos exatos para pegar os ministros restantes corretamente
    ministerios_dados = [
        {"termos": ["FERNANDO", "HADDAD"], "nome_pasta": "Fazenda", "ordem": 1},
        {"termos": ["SIMONE", "TEBET"], "nome_pasta": "Planejamento e Orçamento", "ordem": 2},
        {"termos": ["RUI COSTA"], "nome_pasta": "Casa Civil", "ordem": 3}, # Ajustado para buscar direto pelo nome de urna/completo exato
        {"termos": ["CAMILO", "SANTANA"], "nome_pasta": "Educação", "ordem": 4},
        {"termos": ["ALEXANDRE", "PADILHA"], "nome_pasta": "Saúde", "ordem": 5},
        {"termos": ["MAURO", "VIEIRA"], "nome_pasta": "Relações Exteriores", "ordem": 6},
        {"termos": ["JOSÉ MÚCIO"], "nome_pasta": "Defesa", "ordem": 7},
        {"termos": ["ALEXANDRE", "SILVEIRA"], "nome_pasta": "Minas e Energia", "ordem": 8},
        {"termos": ["MARINA", "SILVA"], "nome_pasta": "Meio Ambiente", "ordem": 9},
        {"termos": ["LUIZ", "MARINHO"], "nome_pasta": "Trabalho e Emprego", "ordem": 10},
        {"termos": ["JADER", "BARBALHO"], "nome_pasta": "Cidades", "ordem": 11},
        {"termos": ["LUCIANA", "SANTOS"], "nome_pasta": "Ciência e Tecnologia", "ordem": 12}
    ]

    print("Buscando dados dos políticos no Supabase...")
    df_politicos = pd.read_sql("SELECT id, nome FROM politicos", engine)

    # Limpa a tabela de ministérios primeiro para remover os dados errados anteriores
    print("Limpando registros incorretos anteriores da tabela 'ministerios'...")
    with engine.begin() as conn:
        conn.exec_driver_sql("DELETE FROM ministerios;")

    dados_para_inserir = []
    for item in ministerios_dados:
        # Filtra o DataFrame exigindo que o nome contenha TODOS os termos da lista (ex: "FERNANDO" E "HADDAD")
        match = df_politicos.copy()
        for termo in item["termos"]:
            match = match[match['nome'].str.upper().str.contains(termo, na=False)]
        
        if not match.empty:
            politico_id = match.iloc[0]['id']
            nome_encontrado = match.iloc[0]['nome']
            print(f"✔ Encontrado para '{item['nome_pasta']}': {nome_encontrado}")
            
            dados_para_inserir.append({
                'politico_id': politico_id,
                'nome_pasta': item['nome_pasta'],
                'ordem': item['ordem']
            })
        else:
            print(f"✖ Aviso: Nenhum político encontrado combinando os termos para a pasta '{item['nome_pasta']}'.")

    if dados_para_inserir:
        df_final = pd.DataFrame(dados_para_inserir)
        print("Enviando ministérios corretos para o Supabase...")
        df_final.to_sql('ministerios', engine, if_exists='append', index=False)
        print("🎉 Todos os ministérios reais foram vinculados e salvos com sucesso!")
    else:
        print("Nenhum ministério foi vinculado.")

if __name__ == "__main__":
    popular_todos_ministerios()