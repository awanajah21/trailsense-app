# core/ai_model.py
import numpy as np
from sklearn.cluster import KMeans

class HazardAnalyzer:
    def __init__(self, n_clusters=3):
        self.n_clusters = n_clusters

    def analyze_segments(self, segments):
        if not segments: return []

        # 1. Ambil nilai kemiringan absolut (Turunan & Tanjakan curam sama-sama membahayakan sendi)
        gradients = [abs(seg.get('avg_gradient_percent', 0.0)) for seg in segments]

        # 2. TRIK ANCHOR: Paksa AI tahu standar absolut medan trail running
        # 0.0% (Aman), 7.0% (Waspada), 15.0% (Bahaya)
        anchors = [0.0, 7.0, 15.0]
        training_data = np.array(gradients + anchors).reshape(-1, 1)

        # 3. Latih AI dengan data campuran (Rute Asli + Jangkar Standar)
        model = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        model.fit(training_data)

        # 4. Urutkan centroid dari yang paling landai ke paling curam
        centers = model.cluster_centers_.flatten()
        sorted_idx = np.argsort(centers)
        
        # Mapping label absolut (0 pasti hijau, 2 pasti merah)
        label_mapping = {
            sorted_idx[0]: {"level": "Aman (Zona Hijau)", "color": "#10B981"},
            sorted_idx[1]: {"level": "Waspada (Zona Kuning)", "color": "#F59E0B"},
            sorted_idx[2]: {"level": "Bahaya (Zona Merah)", "color": "#EF4444"}
        }

        # 5. Prediksi TINGKAT BAHAYA untuk segmen rute asli (tanpa anchor)
        predictions = model.predict(np.array(gradients).reshape(-1, 1))

        for i, seg in enumerate(segments):
            cluster_label = predictions[i]
            seg['ai_hazard_level'] = label_mapping[cluster_label]["level"]
            seg['color_hex'] = label_mapping[cluster_label]["color"]
            
            # Bersihkan array 'pts' yang berukuran besar agar payload JSON API web tidak membebani HP pelatih
            if 'pts' in seg:
                del seg['pts']

        return segments