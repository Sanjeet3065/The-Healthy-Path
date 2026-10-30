export interface UPDistrict {
  id: string;
  name: string;
  division: string;
  lat: number;
  lng: number;
  region: 'Central' | 'Eastern' | 'Western' | 'Bundelkhand' | 'Rohilkhand';
  prominentPlaces?: string[];
}

// Complete reference of all 75 districts of Uttar Pradesh
export const UP_DISTRICTS: UPDistrict[] = [
  // Central
  { id: 'lucknow', name: 'Lucknow', division: 'Lucknow', lat: 26.8467, lng: 80.9462, region: 'Central', prominentPlaces: ['Hazratganj', 'Gomti Nagar', 'Alambagh', 'Charbagh', 'Indira Nagar'] },
  { id: 'kanpur-nagar', name: 'Kanpur', division: 'Kanpur', lat: 26.4499, lng: 80.3319, region: 'Central', prominentPlaces: ['Mall Road', 'Civil Lines', 'Kalyanpur', 'Panki'] },
  { id: 'kanpur-dehat', name: 'Kanpur Dehat', division: 'Kanpur', lat: 26.3475, lng: 79.9472, region: 'Central', prominentPlaces: ['Akbarpur', 'Rura', 'Jhinjhak'] },
  { id: 'unnao', name: 'Unnao', division: 'Lucknow', lat: 26.5454, lng: 80.4878, region: 'Central', prominentPlaces: ['Shuklaganj', 'Safipur', 'Purwa'] },
  { id: 'raebareli', name: 'Rae Bareli', division: 'Lucknow', lat: 26.2236, lng: 81.2409, region: 'Central', prominentPlaces: ['Lalganj', 'Bachhrawan', 'Salon'] },
  { id: 'sitapur', name: 'Sitapur', division: 'Lucknow', lat: 27.5684, lng: 80.6829, region: 'Central', prominentPlaces: ['Naimisharanya', 'Biswan', 'Mahmoodabad'] },
  { id: 'hardoi', name: 'Hardoi', division: 'Lucknow', lat: 27.3989, lng: 80.1313, region: 'Central', prominentPlaces: ['Sandila', 'Bilgram', 'Shahabad'] },
  { id: 'lakhimpur-kheri', name: 'Lakhimpur Kheri', division: 'Lucknow', lat: 27.9464, lng: 80.7788, region: 'Central', prominentPlaces: ['Dudhwa', 'Gola Gokarannath', 'Palia'] },
  { id: 'barabanki', name: 'Barabanki', division: 'Ayodhya', lat: 26.9268, lng: 81.1834, region: 'Central', prominentPlaces: ['Dewa Sharif', 'Ram Sanehi Ghat', 'Fatehpur'] },
  { id: 'ayodhya', name: 'Ayodhya', division: 'Ayodhya', lat: 26.7922, lng: 82.1998, region: 'Central', prominentPlaces: ['Faizabad', 'Rudauli', 'Bikapur'] },
  { id: 'sultanpur', name: 'Sultanpur', division: 'Ayodhya', lat: 26.2648, lng: 82.0727, region: 'Central', prominentPlaces: ['Kadipur', 'Lambhua', 'Jaisinghpur'] },
  { id: 'amethi', name: 'Amethi', division: 'Ayodhya', lat: 26.1557, lng: 81.8155, region: 'Central', prominentPlaces: ['Gauriganj', 'Musafirkhana', 'Tiloi'] },
  { id: 'ambedkar-nagar', name: 'Ambedkar Nagar', division: 'Ayodhya', lat: 26.4447, lng: 82.5392, region: 'Central', prominentPlaces: ['Akbarpur', 'Tanda', 'Jalalpur'] },
  { id: 'fatehpur', name: 'Fatehpur', division: 'Prayagraj', lat: 25.9263, lng: 80.8135, region: 'Central', prominentPlaces: ['Bindki', 'Khaga', 'Haswa'] },
  { id: 'kaushambi', name: 'Kaushambi', division: 'Prayagraj', lat: 25.5312, lng: 81.4111, region: 'Central', prominentPlaces: ['Manjhanpur', 'Chail', 'Sirathu'] },
  { id: 'pratapgarh', name: 'Pratapgarh', division: 'Prayagraj', lat: 25.8988, lng: 81.9442, region: 'Central', prominentPlaces: ['Bela Pratapgarh', 'Kunda', 'Patti'] },
  { id: 'prayagraj', name: 'Prayagraj (Allahabad)', division: 'Prayagraj', lat: 25.4358, lng: 81.8463, region: 'Central', prominentPlaces: ['Civil Lines', 'Sangam', 'Naini', 'Phulpur'] },

  // Eastern (Purvanchal)
  { id: 'varanasi', name: 'Varanasi', division: 'Varanasi', lat: 25.3176, lng: 82.9739, region: 'Eastern', prominentPlaces: ['Ghats', 'Cantt', 'BHU', 'Sarnath', 'Lanka'] },
  { id: 'jaunpur', name: 'Jaunpur', division: 'Varanasi', lat: 25.7464, lng: 82.6837, region: 'Eastern', prominentPlaces: ['Shahganj', 'Machhlishahr', 'Mariahu'] },
  { id: 'ghazipur', name: 'Ghazipur', division: 'Varanasi', lat: 25.5840, lng: 83.5770, region: 'Eastern', prominentPlaces: ['Zamania', 'Saidpur', 'Mohammadabad'] },
  { id: 'chandauli', name: 'Chandauli', division: 'Varanasi', lat: 25.2604, lng: 83.2709, region: 'Eastern', prominentPlaces: ['Mughalsarai / Pt. DDU', 'Sakaldiha', 'Chakia'] },
  { id: 'gorakhpur', name: 'Gorakhpur', division: 'Gorakhpur', lat: 26.7606, lng: 83.3732, region: 'Eastern', prominentPlaces: ['Golghar', 'Gorakhnath', 'Pipraich', 'Sahjanwa'] },
  { id: 'deoria', name: 'Deoria', division: 'Gorakhpur', lat: 26.5024, lng: 83.7791, region: 'Eastern', prominentPlaces: ['Salempur', 'Bhatpar Rani', 'Rudrapur'] },
  { id: 'kushinagar', name: 'Kushinagar', division: 'Gorakhpur', lat: 26.7408, lng: 83.8890, region: 'Eastern', prominentPlaces: ['Padrauna', 'Hata', 'Kasia'] },
  { id: 'maharajganj', name: 'Maharajganj', division: 'Gorakhpur', lat: 27.1464, lng: 83.5615, region: 'Eastern', prominentPlaces: ['Nautanwa', 'Pharenda', 'Nichlaul'] },
  { id: 'basti', name: 'Basti', division: 'Basti', lat: 26.8140, lng: 82.7630, region: 'Eastern', prominentPlaces: ['Harraiya', 'Bhanpur', 'Rudhaulee'] },
  { id: 'siddharthnagar', name: 'Siddharthnagar', division: 'Basti', lat: 27.2947, lng: 82.8144, region: 'Eastern', prominentPlaces: ['Naugarh', 'Bansi', 'Shohratgarh'] },
  { id: 'sant-kabir-nagar', name: 'Sant Kabir Nagar', division: 'Basti', lat: 26.7820, lng: 83.0298, region: 'Eastern', prominentPlaces: ['Khalilabad', 'Maghar', 'Mehdawal'] },
  { id: 'azamgarh', name: 'Azamgarh', division: 'Azamgarh', lat: 26.0738, lng: 83.1859, region: 'Eastern', prominentPlaces: ['Phulpur', 'Lalganj', 'Sagri'] },
  { id: 'mau', name: 'Mau', division: 'Azamgarh', lat: 25.9417, lng: 83.5615, region: 'Eastern', prominentPlaces: ['Ghosi', 'Madhuban', 'Muhammadabad Gohna'] },
  { id: 'ballia', name: 'Ballia', division: 'Azamgarh', lat: 25.7607, lng: 84.1481, region: 'Eastern', prominentPlaces: ['Rasra', 'Bairia', 'Bansdih'] },
  { id: 'mirzapur', name: 'Mirzapur', division: 'Mirzapur', lat: 25.1461, lng: 82.5690, region: 'Eastern', prominentPlaces: ['Vindhyachal', 'Chunar', 'Lalganj'] },
  { id: 'sant-ravidas-nagar', name: 'Bhadohi', division: 'Mirzapur', lat: 25.3957, lng: 82.5694, region: 'Eastern', prominentPlaces: ['Gyanpur', 'Suriyawan', 'Aurai'] },
  { id: 'sonbhadra', name: 'Sonbhadra', division: 'Mirzapur', lat: 24.6850, lng: 83.0685, region: 'Eastern', prominentPlaces: ['Robertsganj', 'Renukoot', 'Anpara', 'Obra'] },
  { id: 'gonda', name: 'Gonda', division: 'Devipatan', lat: 27.1332, lng: 81.9619, region: 'Eastern', prominentPlaces: ['Colonelganj', 'Tarabganj', 'Mankapur'] },
  { id: 'bahraich', name: 'Bahraich', division: 'Devipatan', lat: 27.5744, lng: 81.5976, region: 'Eastern', prominentPlaces: ['Nanpara', 'Mahasi', 'Payagpur'] },
  { id: 'shravasti', name: 'Shravasti', division: 'Devipatan', lat: 27.7025, lng: 81.9360, region: 'Eastern', prominentPlaces: ['Binka', 'Ikauna', 'Payagpur'] },
  { id: 'balrampur', name: 'Balrampur', division: 'Devipatan', lat: 27.4297, lng: 82.1795, region: 'Eastern', prominentPlaces: ['Tulsipur', 'Utraula', 'Gainsari'] },

  // Western
  { id: 'gautam-buddha-nagar', name: 'Noida (Gautam Buddha Nagar)', division: 'Meerut', lat: 28.5355, lng: 77.3910, region: 'Western', prominentPlaces: ['Greater Noida', 'Sector 18', 'Dadri', 'Jewar'] },
  { id: 'ghaziabad', name: 'Ghaziabad', division: 'Meerut', lat: 28.6692, lng: 77.4538, region: 'Western', prominentPlaces: ['Indirapuram', 'Vaishali', 'Modinagar', 'Loni'] },
  { id: 'meerut', name: 'Meerut', division: 'Meerut', lat: 28.9845, lng: 77.7064, region: 'Western', prominentPlaces: ['Sardhana', 'Mawana', 'Hastinapur'] },
  { id: 'bulandshahr', name: 'Bulandshahr', division: 'Meerut', lat: 28.4069, lng: 77.8498, region: 'Western', prominentPlaces: ['Khurja', 'Sikandrabad', 'Anupshahr'] },
  { id: 'baghpat', name: 'Baghpat', division: 'Meerut', lat: 28.9452, lng: 77.2201, region: 'Western', prominentPlaces: ['Baraut', 'Khekra', 'Chhaprauli'] },
  { id: 'hapur', name: 'Hapur', division: 'Meerut', lat: 28.7306, lng: 77.7759, region: 'Western', prominentPlaces: ['Garhmukteshwar', 'Dholana', 'Pilkhuwa'] },
  { id: 'saharanpur', name: 'Saharanpur', division: 'Saharanpur', lat: 29.9679, lng: 77.5510, region: 'Western', prominentPlaces: ['Deoband', 'Nakur', 'Behat'] },
  { id: 'muzaffarnagar', name: 'Muzaffarnagar', division: 'Saharanpur', lat: 29.4727, lng: 77.7085, region: 'Western', prominentPlaces: ['Khatauli', 'Budhana', 'Jansath'] },
  { id: 'shamli', name: 'Shamli', division: 'Saharanpur', lat: 29.4497, lng: 77.3129, region: 'Western', prominentPlaces: ['Kairana', 'Thana Bhawan', 'Unn'] },
  { id: 'agra', name: 'Agra', division: 'Agra', lat: 27.1767, lng: 78.0081, region: 'Western', prominentPlaces: ['Tajganj', 'Fatehpur Sikri', 'Sikandra', 'Etmadpur'] },
  { id: 'mathura', name: 'Mathura', division: 'Agra', lat: 27.4924, lng: 77.6737, region: 'Western', prominentPlaces: ['Vrindavan', 'Govardhan', 'Barsana', 'Chhata'] },
  { id: 'firozabad', name: 'Firozabad', division: 'Agra', lat: 27.1593, lng: 78.3957, region: 'Western', prominentPlaces: ['Shikohabad', 'Sirsaganj', 'Jasrana'] },
  { id: 'mainpuri', name: 'Mainpuri', division: 'Agra', lat: 27.2289, lng: 79.0289, region: 'Western', prominentPlaces: ['Bhongaon', 'Karhal', 'Kishni'] },
  { id: 'aligarh', name: 'Aligarh', division: 'Aligarh', lat: 27.8974, lng: 78.0880, region: 'Western', prominentPlaces: ['Civil Lines', 'AMU', 'Khair', 'Atrauli'] },
  { id: 'hathras', name: 'Hathras', division: 'Aligarh', lat: 27.5969, lng: 78.0519, region: 'Western', prominentPlaces: ['Sadabad', 'Sasni', 'Sikandra Rao'] },
  { id: 'etah', name: 'Etah', division: 'Aligarh', lat: 27.5615, lng: 78.6653, region: 'Western', prominentPlaces: ['Aliganj', 'Jalesar', 'Kasganj'] },
  { id: 'kasganj', name: 'Kasganj', division: 'Aligarh', lat: 27.8083, lng: 78.6477, region: 'Western', prominentPlaces: ['Soron', 'Patiyali', 'Sahawar'] },

  // Rohilkhand
  { id: 'bareilly', name: 'Bareilly', division: 'Bareilly', lat: 28.3670, lng: 79.4304, region: 'Rohilkhand', prominentPlaces: ['Civil Lines', 'Aonla', 'Baheri', 'Nawabganj'] },
  { id: 'budaun', name: 'Budaun', division: 'Bareilly', lat: 28.0321, lng: 79.1245, region: 'Rohilkhand', prominentPlaces: ['Ujhani', 'Bilsi', 'Dataganj'] },
  { id: 'pilibhit', name: 'Pilibhit', division: 'Bareilly', lat: 28.6315, lng: 79.8028, region: 'Rohilkhand', prominentPlaces: ['Pilibhit Tiger Reserve', 'Bisalpur', 'Puranpur'] },
  { id: 'shahjahanpur', name: 'Shahjahanpur', division: 'Bareilly', lat: 27.8814, lng: 79.9118, region: 'Rohilkhand', prominentPlaces: ['Tilhar', 'Powayan', 'Jalalabad'] },
  { id: 'moradabad', name: 'Moradabad', division: 'Moradabad', lat: 28.8386, lng: 78.7733, region: 'Rohilkhand', prominentPlaces: ['Civil Lines', 'Kanth', 'Bilari', 'Thakurdwara'] },
  { id: 'rampur', name: 'Rampur', division: 'Moradabad', lat: 28.8154, lng: 79.0257, region: 'Rohilkhand', prominentPlaces: ['Bilaspur', 'Milak', 'Shahabad', 'Suar'] },
  { id: 'amroha', name: 'Amroha', division: 'Moradabad', lat: 28.9044, lng: 78.4678, region: 'Rohilkhand', prominentPlaces: ['Gajraula', 'Dhanaura', 'Hasanpur'] },
  { id: 'bijnor', name: 'Bijnor', division: 'Moradabad', lat: 29.3732, lng: 78.1357, region: 'Rohilkhand', prominentPlaces: ['Najibabad', 'Dhampur', 'Chandpur', 'Nagina'] },
  { id: 'sambhal', name: 'Sambhal', division: 'Moradabad', lat: 28.5847, lng: 78.5670, region: 'Rohilkhand', prominentPlaces: ['Chandausi', 'Gunnaur', 'Bahjoi'] },
  { id: 'farrukhabad', name: 'Farrukhabad', division: 'Kanpur', lat: 27.3826, lng: 79.5840, region: 'Rohilkhand', prominentPlaces: ['Fatehgarh', 'Kaimganj', 'Amritpur'] },
  { id: 'kannauj', name: 'Kannauj', division: 'Kanpur', lat: 27.0543, lng: 79.9184, region: 'Rohilkhand', prominentPlaces: ['Chhibramau', 'Tirwa'] },
  { id: 'etawah', name: 'Etawah', division: 'Kanpur', lat: 26.7854, lng: 79.0152, region: 'Rohilkhand', prominentPlaces: ['Saifai', 'Bharthana', 'Jaswantnagar'] },
  { id: 'auraiya', name: 'Auraiya', division: 'Kanpur', lat: 26.4674, lng: 79.5161, region: 'Rohilkhand', prominentPlaces: ['Bidhuna', 'Dibiyapur', 'Ajitmal'] },

  // Bundelkhand
  { id: 'jhansi', name: 'Jhansi', division: 'Jhansi', lat: 25.4484, lng: 78.5685, region: 'Bundelkhand', prominentPlaces: ['Jhansi Fort', 'Mauranipur', 'Babina', 'Moth'] },
  { id: 'lalitpur', name: 'Lalitpur', division: 'Jhansi', lat: 24.6896, lng: 78.4124, region: 'Bundelkhand', prominentPlaces: ['Mahroni', 'Talbehat', 'Madawara'] },
  { id: 'jalaun', name: 'Jalaun (Orai)', division: 'Jhansi', lat: 25.9967, lng: 79.4526, region: 'Bundelkhand', prominentPlaces: ['Orai', 'Kalpi', 'Konch', 'Madhogarh'] },
  { id: 'hamirpur', name: 'Hamirpur', division: 'Chitrakoot', lat: 25.9555, lng: 80.1517, region: 'Bundelkhand', prominentPlaces: ['Rath', 'Maudaha', 'Sarila'] },
  { id: 'mahoba', name: 'Mahoba', division: 'Chitrakoot', lat: 25.2922, lng: 79.8732, region: 'Bundelkhand', prominentPlaces: ['Charkhari', 'Kulpahar'] },
  { id: 'banda', name: 'Banda', division: 'Chitrakoot', lat: 25.4754, lng: 80.3347, region: 'Bundelkhand', prominentPlaces: ['Atarra', 'Baberu', 'Naraini'] },
  { id: 'chitrakoot', name: 'Chitrakoot', division: 'Chitrakoot', lat: 25.2104, lng: 80.8906, region: 'Bundelkhand', prominentPlaces: ['Karwi', 'Mau', 'Manikpur'] },
];

/**
 * Searches the pre-indexed Uttar Pradesh districts & prominent towns.
 */
export function searchUPDistricts(query: string): UPDistrict[] {
  if (!query || query.trim().length < 2) return [];
  const clean = query.trim().toLowerCase();

  const matches = UP_DISTRICTS.filter((d) => {
    if (d.name.toLowerCase().includes(clean)) return true;
    if (d.prominentPlaces?.some((p) => p.toLowerCase().includes(clean))) return true;
    if (d.division.toLowerCase().includes(clean)) return true;
    return false;
  });

  // Sort so exact or prefix name matches come first
  return matches.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName === clean) return -1;
    if (bName === clean) return 1;
    if (aName.startsWith(clean) && !bName.startsWith(clean)) return -1;
    if (!aName.startsWith(clean) && bName.startsWith(clean)) return 1;
    return 0;
  });
}
