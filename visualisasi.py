import gpxpy
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from matplotlib.colors import LinearSegmentedColormap
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import math
import os

# ==========================================
# 1. KONFIGURASI FILE & FUNGSI SPASIAL
# ==========================================
# Ganti dengan nama file GPX Anda. Pastikan file berada di folder yang sama dengan skrip ini!
FILE_GPX = 'abahdonny-paniisan.gpx' 

def haversine(lat1, lon1, lat2, lon2):
    """Menghitung jarak jarak aktual antar koordinat (meter)"""
    R = 6371000 # Radius bumi dalam meter
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# ==========================================
# 2. EKSTRAKSI & PEMROSESAN DATA (PIPELINE)
# ==========================================
def run_analysis():
    if not os.path.exists(FILE_GPX):
        print(f"❌ ERROR: File '{FILE_GPX}' tidak ditemukan di folder ini!")
        print("💡 SOLUSI: Pastikan file GPX sudah dipindahkan ke folder yang sama dengan visualisasi.py")
        return

    print("🏃‍♂️ Membedah data GPX dan memanaskan mesin AI...")
    
    with open(FILE_GPX, 'r') as gpx_file:
        gpx = gpxpy.parse(gpx_file)

    data = []
    prev_point = None
    cumulative_distance = 0.0

    # Ekstraksi titik koordinat
    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                if prev_point:
                    dist = haversine(prev_point.latitude, prev_point.longitude, point.latitude, point.longitude)
                    # Filter noise: abaikan pergerakan di bawah 2 meter
                    if dist > 2.0: 
                        delta_ele = point.elevation - prev_point.elevation
                        slope = (delta_ele / dist) * 100
                        # Capping batas ekstrem kemiringan (-100% sd 100%)
                        slope = max(min(slope, 100), -100)
                        cumulative_distance += dist
                        
                        data.append({
                            'distance_km': cumulative_distance / 1000,
                            'elevation': point.elevation,
                            'slope': slope,
                            'abs_slope': abs(slope)
                        })
                        prev_point = point
                else:
                    prev_point = point

    df = pd.DataFrame(data)

    # ==========================================
    # 3. K-MEANS CLUSTERING (KACAMATA MESIN)
    # ==========================================
    # Penskalaan fitur (Wajib agar jarak & slope setara di mata mesin)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df[['abs_slope']])

    # Eksekusi K-Means dengan K=3 (Aman, Waspada, Bahaya)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['raw_cluster'] = kmeans.fit_predict(X_scaled)

    # Mengurutkan klaster secara dinamis berdasarkan nilai rata-rata kemiringan
    cluster_means = df.groupby('raw_cluster')['abs_slope'].mean().sort_values()
    mapping = {old_label: new_label for new_label, old_label in enumerate(cluster_means.index)}
    df['cluster'] = df['raw_cluster'].map(mapping)

    # Median Filter (Filter Anti-Kerikil) - Menyetrika noise pada label AI
    df['cluster_filtered'] = df['cluster'].rolling(window=15, min_periods=1, center=True).median().astype(int)

    # ==========================================
    # 4. RENDERING VISUALISASI MULTI-PLOT
    # ==========================================
    print("🎨 Menggambar peta harta karun untuk atlet...")
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 10), gridspec_kw={'height_ratios': [1, 1.2]})
    fig.suptitle('ANALISIS MEDAN LINTAS ALAM ALTI DEPOK\n(Evaluasi Algoritma K-Means & Profil Elevasi Fisik)', fontsize=14, fontweight='bold')
    plt.subplots_adjust(hspace=0.3)

    colors = {0: '#2ecc71', 1: '#f1c40f', 2: '#e74c3c'}
    labels = {0: 'Klaster Aman (< 10%)', 1: 'Klaster Waspada (Transisi)', 2: 'Klaster Bahaya (> 20%)'}

    # PANEL 1: FEATURE SPACE (Scatter Plot K-Means)
    for cluster_id in sorted(df['cluster'].unique()):
        cluster_data = df[df['cluster'] == cluster_id]
        ax1.scatter(
            cluster_data['distance_km'], 
            cluster_data['abs_slope'], 
            c=colors[cluster_id], 
            label=labels[cluster_id],
            alpha=0.6, s=20
        )
    ax1.set_title('A. Feature Space (Pemetaan Klaster K-Means pada Sumbu Absolut Kemiringan)', fontweight='bold')
    ax1.set_xlabel('Jarak Tempuh (Kilometer)')
    ax1.set_ylabel('Absolut Kemiringan (%)')
    ax1.grid(True, linestyle='--', alpha=0.5)
    ax1.legend()

    # PANEL 2: PHYSICAL SPACE (Profil Elevasi Gradasi)
    cmap_colors = ['#2ecc71', '#f1c40f', '#e74c3c']
    custom_cmap = LinearSegmentedColormap.from_list("trail_risk", cmap_colors)
    
    points = np.array([df['distance_km'].values, df['elevation'].values]).T.reshape(-1, 1, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)
    
    norm = plt.Normalize(0, 2)
    lc = LineCollection(segments, cmap=custom_cmap, norm=norm)
    lc.set_array(df['cluster_filtered'].values)
    lc.set_linewidth(3.5)
    
    ax2.add_collection(lc)
    ax2.fill_between(df['distance_km'], df['elevation'], df['elevation'].min() - 20, color='#f5f5f5', alpha=0.7)
    
    ax2.set_xlim(df['distance_km'].min(), df['distance_km'].max())
    ax2.set_ylim(df['elevation'].min() - 10, df['elevation'].max() + 20)
    
    ax2.set_title('B. Physical Space (Penerapan AI pada Profil Elevasi Aktual Gunung Pancar/Paniisan)', fontweight='bold')
    ax2.set_xlabel('Jarak Tempuh (Kilometer)')
    ax2.set_ylabel('Elevasi (mdpl)')
    ax2.grid(True, linestyle='--', alpha=0.5)

    from matplotlib.lines import Line2D
    custom_lines = [
        Line2D([0], [0], color='#2ecc71', lw=4),
        Line2D([0], [0], color='#f1c40f', lw=4),
        Line2D([0], [0], color='#e74c3c', lw=4)
    ]
    ax2.legend(custom_lines, ['Aman (Lari / Cruising)', 'Waspada (Kontrol Pacing)', 'Bahaya (Power Hiking)'], loc='upper left')

    # Simpan sebagai file resolusi tinggi untuk skripsi
    plt.savefig('grafik_kmeans_skripsi_final.png', dpi=300, bbox_inches='tight')
    print("✅ SUKSES! Gambar telah disimpan sebagai 'grafik_kmeans_skripsi_final.png'.")
    plt.show()

if __name__ == "__main__":
    run_analysis()