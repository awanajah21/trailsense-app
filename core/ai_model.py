# core/ai_model.py
import numpy as np

class HazardAnalyzer:
    def __init__(self, n_clusters=3, max_iter=100, tol=1e-4):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol

    def _fit_kmeans_1d(self, data: np.ndarray, initial_anchors: list) -> np.ndarray:
        """
        Mesin K-Means Clustering berbasis matriks NumPy murni (tanpa scikit-learn).
        Menggunakan Anchor Injection sebagai titik pusat (centroid) awal agar
        konvergensi instan, deterministik, dan bebas bias rute homogen.
        """
        centroids = np.array(initial_anchors, dtype=float)

        for _ in range(self.max_iter):
            # Hitung jarak Euclidean setiap titik data ke masing-masing centroid
            distances = np.abs(data[:, np.newaxis] - centroids)
            labels = np.argmin(distances, axis=1)

            # Perbarui posisi centroid berdasarkan rata-rata anggota klaster
            new_centroids = np.array([
                data[labels == k].mean() if np.any(labels == k) else centroids[k]
                for k in range(self.n_clusters)
            ])

            # Hentikan iterasi jika posisi centroid sudah stabil (konvergen)
            if np.all(np.abs(new_centroids - centroids) < self.tol):
                break
            centroids = new_centroids

        return centroids

    def analyze_segments(self, segments):
        if not segments:
            return []

        # 1. Ambil nilai kemiringan absolut (Turunan & Tanjakan curam sama-sama membebani sendi lutut)
        gradients = [abs(seg.get('avg_gradient_percent', 0.0)) for seg in segments]

        # 2. TRIK ANCHOR: Standar absolut medan trail running
        # 0.0% (Aman), 7.0% (Waspada), 15.0% (Bahaya)
        anchors = [0.0, 7.0, 15.0]
        training_data = np.array(gradients + anchors, dtype=float)

        # 3. Latih K-Means dengan data campuran (Rute Asli + Jangkar Standar)
        centers = self._fit_kmeans_1d(training_data, anchors)

        # 4. Urutkan centroid dari yang paling landai ke paling curam
        sorted_idx = np.argsort(centers)
        
        label_mapping = {
            sorted_idx[0]: {"level": "Aman (Zona Hijau)", "color": "#10B981"},
            sorted_idx[1]: {"level": "Waspada (Zona Kuning)", "color": "#F59E0B"},
            sorted_idx[2]: {"level": "Bahaya (Zona Merah)", "color": "#EF4444"}
        }

        # 5. Prediksi tingkat bahaya untuk segmen rute asli menggunakan jarak Euclidean terdekat
        grad_array = np.array(gradients, dtype=float)
        distances = np.abs(grad_array[:, np.newaxis] - centers)
        predictions = np.argmin(distances, axis=1)

        for i, seg in enumerate(segments):
            cluster_label = int(predictions[i])
            seg['ai_hazard_level'] = label_mapping[cluster_label]["level"]
            seg['color_hex'] = label_mapping[cluster_label]["color"]
            
            # Bersihkan array 'pts' agar payload JSON API tetap ramping di HP pelatih
            if 'pts' in seg:
                del seg['pts']

        return segments