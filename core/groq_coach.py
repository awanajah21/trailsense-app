import os
import time
from openai import OpenAI
from dotenv import load_dotenv

# Muat environment variables dari .env (pastikan GROQ_API_KEY ada di sana)
load_dotenv()

client = OpenAI(
    # Tempel API Key asli Anda secara langsung di dalam tanda kutip ini
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_ai_coach_summary(segments: list) -> str:
    """
    Mengekstrak instruksi taktis menggunakan Llama 3 via Groq LPU.
    """
    if not segments:
        return "Data segmen tidak valid untuk dianalisis."

    # Kompresi data agar tidak membebani payload AI
    compressed_data = []
    for seg in segments:
        compressed_data.append(
            f"KM {round(seg.get('start_km', 0), 1)}-{round(seg.get('end_km', 0), 1)}: "
            f"{seg.get('character', 'Flat')} ({round(seg.get('avg_gradient_percent', 0), 1)}%), "
            f"Status: {seg.get('ai_hazard_level', 'Aman')}"
        )
    
    payload_text = "\n".join(compressed_data)

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="qwen/qwen3.8-27b",
                messages=[
                    {
                        "role": "system", 
                        "content": "Bertindaklah sebagai Pelatih Lari Trail Senior ALTI Depok yang tegas. Berikan instruksi mitigasi cedera dan pacing (kapan harus power-hiking, jaga detak jantung, dll) berdasarkan data rute. Jawab langsung dalam 1 paragraf singkat (maks 3-4 kalimat) tanpa kalimat pembuka basa-basi."
                    },
                    {"role": "user", "content": f"Data Rute:\n{payload_text}"}
                ],
                temperature=0.5,
                max_tokens=300
            )
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            error_msg = str(e)
            if "503" in error_msg or "429" in error_msg:
                if attempt < max_retries - 1:
                    jeda_waktu = 2 ** attempt
                    print(f"Lalu Lintas Groq Padat. Antre ulang dalam {jeda_waktu} detik...")
                    time.sleep(jeda_waktu)
                    continue
            
            print(f"Jalur Komunikasi Pelatih Putus: {e}")
            return "Pelatih AI sedang menangani terlalu banyak atlet saat ini (Server Overload). Tetap patuhi Pace Notes di atas, hemat tenaga di Zona Merah, dan jaga hidrasi Anda."