class RouteSegmenter:
    def __init__(self):
        pass

    def get_direction(self, gradient):
        if gradient > 6.0:
            return "Climb"
        elif gradient > 2.0:
            return "Uphill"
        elif gradient > -2.0:
            return "Flat"
        elif gradient > -6.0:
            return "Downhill"
        else:
            return "Descent"

    def process_route(self, raw_coordinates):
        if not raw_coordinates:
            return []

        # DYNAMIC THRESHOLDING AGRESIF (Pemadatan Segmen)
        total_dist = raw_coordinates[-1]['dist']
        
        # Peningkatan agresif pada jarak penahanan agar segmen lebih padat
        if total_dist <= 5.0:
            adaptive_min_dist = 0.15  # Potong minimal per 150m untuk rute sangat pendek
        elif total_dist <= 15.0:
            adaptive_min_dist = 0.35  # Potong minimal per 350m untuk rute pendek
        elif total_dist <= 30.0:
            adaptive_min_dist = 0.70  # Potong minimal per 700m untuk rute menengah
        else:
            adaptive_min_dist = 1.00  # Ultra Trail: Potong minimal per 1 Kilometer

        segments = []
        current_segment = {
            "segment_id": 1,
            "start_km": raw_coordinates[0]["dist"],
            "start_elev": raw_coordinates[0]["elev"],
            "points": [raw_coordinates[0]]
        }
        
        raw_coordinates[0]["segment_id"] = 1

        for i in range(1, len(raw_coordinates)):
            pt = raw_coordinates[i]
            prev_pt = raw_coordinates[i-1]
            
            dist_diff = pt["dist"] - prev_pt["dist"]
            elev_diff = pt["elev"] - prev_pt["elev"]
            
            current_grad = (elev_diff / (dist_diff * 1000)) * 100 if dist_diff > 0 else 0
            current_dir = self.get_direction(current_grad)
            
            current_seg_dist = pt["dist"] - current_segment["start_km"]
            
            # DIRECTIONAL MERGING KETAT: Memaksa penggabungan jika jarak belum mencapai threshold
            if current_seg_dist < adaptive_min_dist:
                current_segment["points"].append(pt)
                pt["segment_id"] = current_segment["segment_id"]
                continue
                
            seg_elev_diff = pt["elev"] - current_segment["start_elev"]
            seg_grad = (seg_elev_diff / (current_seg_dist * 1000)) * 100 if current_seg_dist > 0 else 0
            seg_dir = self.get_direction(seg_grad)

            if current_dir != seg_dir:
                self._finalize_segment(current_segment, pt)
                segments.append(current_segment)
                
                current_segment = {
                    "segment_id": current_segment["segment_id"] + 1,
                    "start_km": pt["dist"],
                    "start_elev": pt["elev"],
                    "points": [pt]
                }
            else:
                current_segment["points"].append(pt)
            
            pt["segment_id"] = current_segment["segment_id"]

        if len(current_segment["points"]) > 1:
            self._finalize_segment(current_segment, raw_coordinates[-1])
            segments.append(current_segment)

        return segments

    def _finalize_segment(self, segment, end_pt):
        segment["end_km"] = end_pt["dist"]
        segment["end_elev"] = end_pt["elev"]
        segment["distance_km"] = segment["end_km"] - segment["start_km"]
        
        elev_diff = segment["end_elev"] - segment["start_elev"]
        
        # INJEKSI BARU: Simpan selisih absolut (bisa minus) untuk Pace Notes
        segment["elevation_change_m"] = elev_diff
        
        if segment["distance_km"] > 0:
            segment["avg_gradient_percent"] = (elev_diff / (segment["distance_km"] * 1000)) * 100
        else:
            segment["avg_gradient_percent"] = 0
            
        segment["tag"] = self.get_direction(segment["avg_gradient_percent"])
        del segment["points"]