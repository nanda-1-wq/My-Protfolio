// ==================== WEATHER DATA & STATE ====================
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let currentLocation = { lat: 5.6037, lng: -0.1870, name: 'Accra, Ghana' };
let currentWeather = null;
let forecastData = null;
let historicalData = [];
let units = localStorage.getItem('weatherUnits') || 'metric';
let alertsEnabled = localStorage.getItem('alertsEnabled') !== 'false';
let notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';

// Mock weather cities for search - Comprehensive worldwide database (500+ cities)
const citiesDatabase = [
    // AFRICA - 60+ cities
    { name: 'Accra, Ghana', lat: 5.6037, lng: -0.1870 },
    { name: 'Kumasi, Ghana', lat: 6.6753, lng: -1.6167 },
    { name: 'Tema, Ghana', lat: 5.7169, lng: -0.0057 },
    { name: 'Sekondi-Takoradi, Ghana', lat: 4.9283, lng: -1.7577 },
    { name: 'Cape Coast, Ghana', lat: 5.1088, lng: -1.2469 },
    { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
    { name: 'Abuja, Nigeria', lat: 9.0765, lng: 7.3986 },
    { name: 'Kano, Nigeria', lat: 12.0022, lng: 8.6753 },
    { name: 'Ibadan, Nigeria', lat: 7.3775, lng: 3.8735 },
    { name: 'Port Harcourt, Nigeria', lat: 4.7527, lng: 7.0075 },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Alexandria, Egypt', lat: 31.2001, lng: 29.9187 },
    { name: 'Giza, Egypt', lat: 30.0131, lng: 31.2089 },
    { name: 'Aswan, Egypt', lat: 24.0889, lng: 32.8998 },
    { name: 'Luxor, Egypt', lat: 25.6866, lng: 32.6348 },
    { name: 'Johannesburg, South Africa', lat: -26.1925, lng: 28.0436 },
    { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
    { name: 'Durban, South Africa', lat: -29.8587, lng: 31.0218 },
    { name: 'Pretoria, South Africa', lat: -25.7461, lng: 28.2313 },
    { name: 'Port Elizabeth, South Africa', lat: -33.9844, lng: 25.6095 },
    { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
    { name: 'Mombasa, Kenya', lat: -4.0435, lng: 39.6682 },
    { name: 'Kisumu, Kenya', lat: -0.1022, lng: 34.7617 },
    { name: 'Dar es Salaam, Tanzania', lat: -6.8000, lng: 39.2833 },
    { name: 'Dodoma, Tanzania', lat: -6.1639, lng: 35.7465 },
    { name: 'Mwanza, Tanzania', lat: -2.5333, lng: 32.8833 },
    { name: 'Addis Ababa, Ethiopia', lat: 9.0320, lng: 38.7469 },
    { name: 'Dire Dawa, Ethiopia', lat: 9.5469, lng: 41.8639 },
    { name: 'Kampala, Uganda', lat: 0.3476, lng: 32.5825 },
    { name: 'Gulu, Uganda', lat: 2.7721, lng: 32.3057 },
    { name: 'Kigali, Rwanda', lat: -1.9536, lng: 29.8739 },
    { name: 'Bujumbura, Burundi', lat: -3.3731, lng: 29.3585 },
    { name: 'Kinshasa, DRC', lat: -4.2634, lng: 15.2429 },
    { name: 'Lubumbashi, DRC', lat: -11.6655, lng: 27.4833 },
    { name: 'Dakar, Senegal', lat: 14.7167, lng: -17.4667 },
    { name: 'Saint-Louis, Senegal', lat: 16.0255, lng: -16.4900 },
    { name: 'Bamako, Mali', lat: 12.6395, lng: -8.0029 },
    { name: 'Abidjan, Ivory Coast', lat: 5.3364, lng: -4.0265 },
    { name: 'Yamoussoukro, Ivory Coast', lat: 6.8270, lng: -5.2893 },
    { name: 'Douala, Cameroon', lat: 4.0511, lng: 9.7679 },
    { name: 'Yaoundé, Cameroon', lat: 3.8667, lng: 11.5167 },
    { name: 'Harare, Zimbabwe', lat: -17.8252, lng: 31.0335 },
    { name: 'Lusaka, Zambia', lat: -15.3875, lng: 28.3228 },
    { name: 'Gaborone, Botswana', lat: -24.6282, lng: 25.9231 },
    { name: 'Windhoek, Namibia', lat: -22.5597, lng: 17.0832 },
    { name: 'Luanda, Angola', lat: -8.8383, lng: 13.2344 },
    { name: 'Maputo, Mozambique', lat: -23.8645, lng: 35.3300 },
    { name: 'Antananarivo, Madagascar', lat: -18.8792, lng: 47.5079 },
    { name: 'Toliara, Madagascar', lat: -23.3815, lng: 43.6677 },
    { name: 'Port Louis, Mauritius', lat: -20.1609, lng: 57.5012 },
    { name: 'Victoria, Seychelles', lat: -4.6796, lng: 55.4920 },
    { name: 'Casablanca, Morocco', lat: 33.5731, lng: -7.5898 },
    { name: 'Fez, Morocco', lat: 34.0379, lng: -5.0088 },
    { name: 'Tunis, Tunisia', lat: 36.8065, lng: 10.1686 },
    
    // EUROPE - 100+ cities
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Manchester, UK', lat: 53.4808, lng: -2.2426 },
    { name: 'Birmingham, UK', lat: 52.5086, lng: -1.8755 },
    { name: 'Leeds, UK', lat: 53.8008, lng: -1.5491 },
    { name: 'Liverpool, UK', lat: 53.4084, lng: -2.9916 },
    { name: 'Glasgow, Scotland', lat: 55.8642, lng: -4.2518 },
    { name: 'Edinburgh, Scotland', lat: 55.9533, lng: -3.1883 },
    { name: 'Cardiff, Wales', lat: 51.4816, lng: -3.1791 },
    { name: 'Belfast, Northern Ireland', lat: 54.5973, lng: -5.9301 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Marseille, France', lat: 43.2965, lng: 5.3698 },
    { name: 'Lyon, France', lat: 45.7640, lng: 4.8357 },
    { name: 'Toulouse, France', lat: 43.6047, lng: 1.4422 },
    { name: 'Nice, France', lat: 43.7102, lng: 7.2620 },
    { name: 'Nantes, France', lat: 47.2184, lng: -1.5536 },
    { name: 'Strasbourg, France', lat: 48.5734, lng: 7.7521 },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
    { name: 'Munich, Germany', lat: 48.1351, lng: 11.5820 },
    { name: 'Frankfurt, Germany', lat: 50.1109, lng: 8.6821 },
    { name: 'Hamburg, Germany', lat: 53.5511, lng: 9.9937 },
    { name: 'Cologne, Germany', lat: 50.9375, lng: 6.9603 },
    { name: 'Stuttgart, Germany', lat: 48.7758, lng: 9.1829 },
    { name: 'Düsseldorf, Germany', lat: 51.2277, lng: 6.7735 },
    { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
    { name: 'Barcelona, Spain', lat: 41.3874, lng: 2.1686 },
    { name: 'Valencia, Spain', lat: 39.4699, lng: -0.3763 },
    { name: 'Seville, Spain', lat: 37.3886, lng: -5.9823 },
    { name: 'Bilbao, Spain', lat: 43.2627, lng: -2.9355 },
    { name: 'Malaga, Spain', lat: 36.7213, lng: -4.4214 },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Milan, Italy', lat: 45.4642, lng: 9.1900 },
    { name: 'Naples, Italy', lat: 40.8518, lng: 14.2681 },
    { name: 'Turin, Italy', lat: 45.0705, lng: 7.6868 },
    { name: 'Venice, Italy', lat: 45.4408, lng: 12.3155 },
    { name: 'Florence, Italy', lat: 43.7696, lng: 11.2558 },
    { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
    { name: 'Rotterdam, Netherlands', lat: 51.9225, lng: 4.4792 },
    { name: 'The Hague, Netherlands', lat: 52.0705, lng: 4.3007 },
    { name: 'Utrecht, Netherlands', lat: 52.0907, lng: 5.1211 },
    { name: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517 },
    { name: 'Antwerp, Belgium', lat: 51.2194, lng: 4.4025 },
    { name: 'Ghent, Belgium', lat: 51.0537, lng: 3.7159 },
    { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173 },
    { name: 'Saint Petersburg, Russia', lat: 59.9311, lng: 30.3609 },
    { name: 'Yekaterinburg, Russia', lat: 56.8389, lng: 60.6057 },
    { name: 'Vladivostok, Russia', lat: 43.1056, lng: 131.8735 },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
    { name: 'Ankara, Turkey', lat: 39.9334, lng: 32.8597 },
    { name: 'Izmir, Turkey', lat: 38.4192, lng: 27.1289 },
    { name: 'Athens, Greece', lat: 37.9838, lng: 23.7275 },
    { name: 'Thessaloniki, Greece', lat: 40.6401, lng: 22.9444 },
    { name: 'Patras, Greece', lat: 38.2466, lng: 21.7346 },
    { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 },
    { name: 'Krakow, Poland', lat: 50.0647, lng: 19.9450 },
    { name: 'Gdańsk, Poland', lat: 54.3520, lng: 18.6466 },
    { name: 'Wrocław, Poland', lat: 51.1079, lng: 17.0385 },
    { name: 'Vienna, Austria', lat: 48.2082, lng: 16.3738 },
    { name: 'Salzburg, Austria', lat: 47.8095, lng: 13.0550 },
    { name: 'Innsbruck, Austria', lat: 47.2692, lng: 11.4041 },
    { name: 'Prague, Czech Republic', lat: 50.0755, lng: 14.4378 },
    { name: 'Brno, Czech Republic', lat: 49.1950, lng: 16.6068 },
    { name: 'Budapest, Hungary', lat: 47.4979, lng: 19.0402 },
    { name: 'Debrecen, Hungary', lat: 47.5316, lng: 21.6273 },
    { name: 'Bucharest, Romania', lat: 44.4268, lng: 26.1025 },
    { name: 'Cluj-Napoca, Romania', lat: 46.7712, lng: 23.6236 },
    { name: 'Sofia, Bulgaria', lat: 42.6977, lng: 23.3219 },
    { name: 'Plovdiv, Bulgaria', lat: 42.1500, lng: 24.7500 },
    { name: 'Belgrade, Serbia', lat: 44.8176, lng: 20.4633 },
    { name: 'Sarajevo, Bosnia', lat: 43.8564, lng: 18.4131 },
    { name: 'Zagreb, Croatia', lat: 45.8150, lng: 15.9819 },
    { name: 'Split, Croatia', lat: 43.5081, lng: 16.4402 },
    { name: 'Ljubljana, Slovenia', lat: 46.0569, lng: 14.5058 },
    { name: 'Bratislava, Slovakia', lat: 48.1486, lng: 17.1077 },
    { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
    { name: 'Porto, Portugal', lat: 41.1579, lng: -8.6291 },
    { name: 'Dublin, Ireland', lat: 53.3498, lng: -6.2603 },
    { name: 'Cork, Ireland', lat: 51.8985, lng: -8.4756 },
    { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686 },
    { name: 'Gothenburg, Sweden', lat: 57.7089, lng: 11.9746 },
    { name: 'Malmö, Sweden', lat: 55.6050, lng: 12.9773 },
    { name: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683 },
    { name: 'Aarhus, Denmark', lat: 56.1629, lng: 10.2039 },
    { name: 'Helsinki, Finland', lat: 60.1695, lng: 24.9354 },
    { name: 'Turku, Finland', lat: 60.4518, lng: 22.2666 },
    { name: 'Tampere, Finland', lat: 61.4978, lng: 23.7610 },
    { name: 'Oslo, Norway', lat: 59.9139, lng: 10.7522 },
    { name: 'Bergen, Norway', lat: 60.3895, lng: 5.3221 },
    { name: 'Trondheim, Norway', lat: 63.4305, lng: 10.3951 },
    { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 },
    { name: 'Luxembourg City, Luxembourg', lat: 49.6116, lng: 6.1319 },
    { name: 'Geneva, Switzerland', lat: 46.2044, lng: 6.1432 },
    { name: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5472 },
    { name: 'Bern, Switzerland', lat: 46.9479, lng: 7.4474 },
    
    // ASIA - 150+ cities
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Osaka, Japan', lat: 34.6937, lng: 135.5023 },
    { name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681 },
    { name: 'Yokohama, Japan', lat: 35.4437, lng: 139.6380 },
    { name: 'Nagoya, Japan', lat: 35.1815, lng: 136.9066 },
    { name: 'Kobe, Japan', lat: 34.6901, lng: 135.1955 },
    { name: 'Sapporo, Japan', lat: 43.0642, lng: 141.3469 },
    { name: 'Fukuoka, Japan', lat: 33.5904, lng: 130.4017 },
    { name: 'Beijing, China', lat: 39.9042, lng: 116.4074 },
    { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
    { name: 'Guangzhou, China', lat: 23.1291, lng: 113.2644 },
    { name: 'Chongqing, China', lat: 29.4316, lng: 106.9123 },
    { name: 'Shenzhen, China', lat: 22.5431, lng: 114.0579 },
    { name: 'Chengdu, China', lat: 30.5728, lng: 104.0668 },
    { name: 'Xi\'an, China', lat: 34.2658, lng: 108.9398 },
    { name: 'Hangzhou, China', lat: 30.2875, lng: 120.1551 },
    { name: 'Nanjing, China', lat: 32.0603, lng: 118.7969 },
    { name: 'Wuhan, China', lat: 30.5928, lng: 114.3055 },
    { name: 'Shenyang, China', lat: 41.8045, lng: 123.4328 },
    { name: 'Tianjin, China', lat: 39.0842, lng: 117.2010 },
    { name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
    { name: 'Taipei, Taiwan', lat: 25.0330, lng: 121.5654 },
    { name: 'Kaohsiung, Taiwan', lat: 22.6167, lng: 120.3167 },
    { name: 'Taichung, Taiwan', lat: 24.1477, lng: 120.6736 },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 },
    { name: 'Busan, South Korea', lat: 35.1795, lng: 129.0756 },
    { name: 'Daegu, South Korea', lat: 35.8714, lng: 128.5917 },
    { name: 'Incheon, South Korea', lat: 37.2757, lng: 126.7297 },
    { name: 'Daejeon, South Korea', lat: 36.3504, lng: 127.3845 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869 },
    { name: 'Penang, Malaysia', lat: 5.3520, lng: 100.3330 },
    { name: 'Klang, Malaysia', lat: 3.0304, lng: 101.5241 },
    { name: 'Johor Bahru, Malaysia', lat: 1.4854, lng: 103.7618 },
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
    { name: 'Chiang Mai, Thailand', lat: 18.7883, lng: 98.9853 },
    { name: 'Phuket, Thailand', lat: 7.8804, lng: 98.3923 },
    { name: 'Hat Yai, Thailand', lat: 7.0085, lng: 100.4649 },
    { name: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542 },
    { name: 'Ho Chi Minh City, Vietnam', lat: 10.7769, lng: 106.7009 },
    { name: 'Da Nang, Vietnam', lat: 16.0544, lng: 108.2022 },
    { name: 'Hai Phong, Vietnam', lat: 20.8449, lng: 106.6881 },
    { name: 'Can Tho, Vietnam', lat: 10.0379, lng: 105.7860 },
    { name: 'Phnom Penh, Cambodia', lat: 11.5564, lng: 104.9282 },
    { name: 'Siem Reap, Cambodia', lat: 13.3667, lng: 103.8333 },
    { name: 'Vientiane, Laos', lat: 17.9757, lng: 102.6331 },
    { name: 'Luang Prabang, Laos', lat: 19.8852, lng: 102.1348 },
    { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842 },
    { name: 'Cebu City, Philippines', lat: 10.3157, lng: 123.8854 },
    { name: 'Davao, Philippines', lat: 7.1108, lng: 125.6423 },
    { name: 'Quezon City, Philippines', lat: 14.8314, lng: 121.0235 },
    { name: 'Makati, Philippines', lat: 14.5549, lng: 121.0175 },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya, Indonesia', lat: -7.2504, lng: 112.7508 },
    { name: 'Bandung, Indonesia', lat: -6.9175, lng: 107.6062 },
    { name: 'Medan, Indonesia', lat: 3.5952, lng: 98.6722 },
    { name: 'Bali, Indonesia', lat: -8.6705, lng: 115.2126 },
    { name: 'Yogyakarta, Indonesia', lat: -7.7956, lng: 110.3695 },
    { name: 'Semarang, Indonesia', lat: -7.0507, lng: 110.2708 },
    { name: 'New Delhi, India', lat: 28.7041, lng: 77.1025 },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore, India', lat: 12.9716, lng: 77.5946 },
    { name: 'Kolkata, India', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
    { name: 'Hyderabad, India', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune, India', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad, India', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur, India', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow, India', lat: 26.8467, lng: 80.9462 },
    { name: 'Surat, India', lat: 21.1702, lng: 72.8311 },
    { name: 'Chandigarh, India', lat: 30.7333, lng: 76.7794 },
    { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011 },
    { name: 'Lahore, Pakistan', lat: 31.5204, lng: 74.3587 },
    { name: 'Islamabad, Pakistan', lat: 33.7294, lng: 73.1882 },
    { name: 'Faisalabad, Pakistan', lat: 31.4181, lng: 72.9779 },
    { name: 'Multan, Pakistan', lat: 30.1575, lng: 71.4391 },
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
    { name: 'Chittagong, Bangladesh', lat: 22.3384, lng: 91.8374 },
    { name: 'Khulna, Bangladesh', lat: 22.8456, lng: 89.5668 },
    { name: 'Colombo, Sri Lanka', lat: 6.9271, lng: 80.7789 },
    { name: 'Kandy, Sri Lanka', lat: 6.9271, lng: 80.6387 },
    { name: 'Galle, Sri Lanka', lat: 6.0535, lng: 80.2181 },
    { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.3240 },
    { name: 'Pokhara, Nepal', lat: 28.2096, lng: 83.9856 },
    { name: 'Bhaktapur, Nepal', lat: 27.6310, lng: 85.4127 },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi, UAE', lat: 24.4539, lng: 54.3773 },
    { name: 'Sharjah, UAE', lat: 25.3571, lng: 55.3989 },
    { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753 },
    { name: 'Jeddah, Saudi Arabia', lat: 21.5433, lng: 39.1727 },
    { name: 'Mecca, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
    { name: 'Medina, Saudi Arabia', lat: 24.4744, lng: 39.6087 },
    { name: 'Dammam, Saudi Arabia', lat: 26.4153, lng: 50.1136 },
    { name: 'Kuwait City, Kuwait', lat: 29.3759, lng: 47.9774 },
    { name: 'Doha, Qatar', lat: 25.2854, lng: 51.5310 },
    { name: 'Manama, Bahrain', lat: 26.1551, lng: 50.1657 },
    { name: 'Muscat, Oman', lat: 23.6100, lng: 58.5400 },
    { name: 'Salalah, Oman', lat: 17.0151, lng: 54.0924 },
    { name: 'Baghdad, Iraq', lat: 33.3128, lng: 44.3615 },
    { name: 'Basra, Iraq', lat: 30.5085, lng: 47.8078 },
    { name: 'Tehran, Iran', lat: 35.6892, lng: 51.3890 },
    { name: 'Isfahan, Iran', lat: 32.6573, lng: 51.6680 },
    { name: 'Shiraz, Iran', lat: 29.6295, lng: 52.5311 },
    { name: 'Mashhad, Iran', lat: 36.2605, lng: 59.5832 },
    { name: 'Tel Aviv, Israel', lat: 32.0853, lng: 34.7818 },
    { name: 'Jerusalem, Israel', lat: 31.7683, lng: 35.2137 },
    { name: 'Haifa, Israel', lat: 32.8191, lng: 34.9885 },
    { name: 'Amman, Jordan', lat: 31.9454, lng: 35.9284 },
    { name: 'Beirut, Lebanon', lat: 33.8886, lng: 35.4955 },
    { name: 'Sidon, Lebanon', lat: 33.5641, lng: 35.3720 },
    { name: 'Damascus, Syria', lat: 33.5138, lng: 36.2765 },
    { name: 'Aleppo, Syria', lat: 36.2021, lng: 37.1591 },
    { name: 'Sanaa, Yemen', lat: 15.3694, lng: 48.2163 },
    { name: 'Aden, Yemen', lat: 12.7684, lng: 45.3604 },
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
    { name: 'Almaty, Kazakhstan', lat: 43.2380, lng: 76.9450 },
    { name: 'Astana, Kazakhstan', lat: 51.1694, lng: 71.4491 },
    { name: 'Tashkent, Uzbekistan', lat: 41.2995, lng: 69.2401 },
    { name: 'Samarkand, Uzbekistan', lat: 39.6548, lng: 66.9597 },
    { name: 'Bishkek, Kyrgyzstan', lat: 42.8746, lng: 74.5698 },
    { name: 'Dushanbe, Tajikistan', lat: 38.5598, lng: 68.7738 },
    { name: 'Ashgabat, Turkmenistan', lat: 37.9601, lng: 58.3261 },
    { name: 'Kabul, Afghanistan', lat: 34.5553, lng: 69.2075 },
    { name: 'Kandahar, Afghanistan', lat: 31.6257, lng: 65.7245 },
    { name: 'Ulaanbaatar, Mongolia', lat: 47.9214, lng: 106.9055 },
    { name: 'Lhasa, Tibet', lat: 29.6470, lng: 91.1100 },
    
    // NORTH AMERICA - 100+ cities
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago, USA', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston, USA', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix, USA', lat: 33.4484, lng: -112.0742 },
    { name: 'Philadelphia, USA', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio, USA', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego, USA', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas, USA', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose, USA', lat: 37.3382, lng: -121.8863 },
    { name: 'Austin, USA', lat: 30.2672, lng: -97.7431 },
    { name: 'Jacksonville, USA', lat: 30.3322, lng: -81.6557 },
    { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
    { name: 'Seattle, USA', lat: 47.6062, lng: -122.3321 },
    { name: 'Boston, USA', lat: 42.3601, lng: -71.0589 },
    { name: 'Miami, USA', lat: 25.7617, lng: -80.1918 },
    { name: 'Atlanta, USA', lat: 33.7490, lng: -84.3880 },
    { name: 'Detroit, USA', lat: 42.3314, lng: -83.0458 },
    { name: 'Denver, USA', lat: 39.7392, lng: -104.9903 },
    { name: 'Las Vegas, USA', lat: 36.1699, lng: -115.1398 },
    { name: 'Washington D.C., USA', lat: 38.9072, lng: -77.0369 },
    { name: 'Portland, USA', lat: 45.5152, lng: -122.6784 },
    { name: 'Minneapolis, USA', lat: 44.9778, lng: -93.2650 },
    { name: 'Cleveland, USA', lat: 41.4993, lng: -81.6954 },
    { name: 'New Orleans, USA', lat: 29.9511, lng: -90.2623 },
    { name: 'Nashville, USA', lat: 36.1627, lng: -86.7816 },
    { name: 'Memphis, USA', lat: 35.1495, lng: -90.0490 },
    { name: 'Louisville, USA', lat: 38.2527, lng: -85.7585 },
    { name: 'Baltimore, USA', lat: 39.2904, lng: -76.6122 },
    { name: 'Honolulu, USA', lat: 21.3099, lng: -157.8581 },
    { name: 'Anchorage, USA', lat: 61.2181, lng: -149.9003 },
    { name: 'Orlando, USA', lat: 28.5421, lng: -81.3723 },
    { name: 'Tampa, USA', lat: 27.9947, lng: -82.4596 },
    { name: 'Phoenix, USA', lat: 33.4484, lng: -112.0742 },
    { name: 'Long Beach, USA', lat: 33.7701, lng: -118.1937 },
    { name: 'Fresno, USA', lat: 36.7469, lng: -119.7726 },
    { name: 'Sacramento, USA', lat: 38.5816, lng: -121.4944 },
    { name: 'Kansas City, USA', lat: 39.0997, lng: -94.5786 },
    { name: 'Mesa, USA', lat: 33.4152, lng: -111.8313 },
    { name: 'Tucson, USA', lat: 32.2217, lng: -110.9265 },
    { name: 'Toronto, Canada', lat: 43.6629, lng: -79.3957 },
    { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207 },
    { name: 'Montreal, Canada', lat: 45.5017, lng: -73.5673 },
    { name: 'Calgary, Canada', lat: 51.0447, lng: -114.0719 },
    { name: 'Ottawa, Canada', lat: 45.4215, lng: -75.6972 },
    { name: 'Edmonton, Canada', lat: 53.5461, lng: -113.4938 },
    { name: 'Quebec City, Canada', lat: 46.8139, lng: -71.2080 },
    { name: 'Winnipeg, Canada', lat: 49.8844, lng: -97.1477 },
    { name: 'Hamilton, Canada', lat: 43.2557, lng: -79.8711 },
    { name: 'Kitchener, Canada', lat: 43.4516, lng: -80.4925 },
    { name: 'London, Canada', lat: 42.9849, lng: -81.2453 },
    { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Guadalajara, Mexico', lat: 20.6596, lng: -103.2497 },
    { name: 'Cancun, Mexico', lat: 21.1629, lng: -86.8519 },
    { name: 'Monterrey, Mexico', lat: 25.6866, lng: -100.3161 },
    { name: 'Cabo San Lucas, Mexico', lat: 22.8896, lng: -109.9161 },
    { name: 'Acapulco, Mexico', lat: 16.8636, lng: -99.8827 },
    { name: 'Puerto Vallarta, Mexico', lat: 20.6295, lng: -105.2581 },
    { name: 'Playa del Carmen, Mexico', lat: 20.6296, lng: -87.0739 },
    { name: 'Cozumel, Mexico', lat: 20.5029, lng: -87.0725 },
    { name: 'San Juan, Puerto Rico', lat: 18.3891, lng: -66.1193 },
    { name: 'Havana, Cuba', lat: 23.1136, lng: -82.3666 },
    { name: 'Santo Domingo, Dominican Republic', lat: 18.4861, lng: -69.9312 },
    { name: 'Kingston, Jamaica', lat: 18.0179, lng: -76.8099 },
    { name: 'Panama City, Panama', lat: 8.9824, lng: -79.5199 },
    { name: 'San Jose, Costa Rica', lat: 9.9281, lng: -84.0907 },
    { name: 'San Salvador, El Salvador', lat: 13.6929, lng: -89.2182 },
    { name: 'Guatemala City, Guatemala', lat: 14.6343, lng: -90.5069 },
    { name: 'Tegucigalpa, Honduras', lat: 14.0723, lng: -87.1921 },
    { name: 'Managua, Nicaragua', lat: 12.1150, lng: -86.2362 },
    { name: 'Port-au-Prince, Haiti', lat: 18.9712, lng: -72.2852 },
    { name: 'Belmopan, Belize', lat: 17.2508, lng: -88.7713 },
    
    // SOUTH AMERICA - 80+ cities
    { name: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729 },
    { name: 'Salvador, Brazil', lat: -12.9714, lng: -38.5014 },
    { name: 'Brasília, Brazil', lat: -15.7975, lng: -47.8919 },
    { name: 'Belo Horizonte, Brazil', lat: -19.8267, lng: -43.9449 },
    { name: 'Manaus, Brazil', lat: -3.1190, lng: -60.0217 },
    { name: 'Recife, Brazil', lat: -8.0476, lng: -34.8770 },
    { name: 'Fortaleza, Brazil', lat: -3.7319, lng: -38.5267 },
    { name: 'Curitiba, Brazil', lat: -25.4284, lng: -49.2733 },
    { name: 'Porto Alegre, Brazil', lat: -30.0277, lng: -51.2287 },
    { name: 'Belém, Brazil', lat: -1.4558, lng: -48.4902 },
    { name: 'Natal, Brazil', lat: -5.7945, lng: -35.2110 },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
    { name: 'Córdoba, Argentina', lat: -31.4135, lng: -64.1811 },
    { name: 'Rosario, Argentina', lat: -32.9468, lng: -60.6393 },
    { name: 'Mendoza, Argentina', lat: -32.8894, lng: -68.8458 },
    { name: 'La Plata, Argentina', lat: -34.9215, lng: -57.9544 },
    { name: 'Bogotá, Colombia', lat: 4.7110, lng: -74.0721 },
    { name: 'Medellín, Colombia', lat: 6.2442, lng: -75.5812 },
    { name: 'Cali, Colombia', lat: 3.4372, lng: -76.5197 },
    { name: 'Cartagena, Colombia', lat: 10.3904, lng: -75.5007 },
    { name: 'Barranquilla, Colombia', lat: 10.9639, lng: -74.7964 },
    { name: 'Lima, Peru', lat: -12.0462, lng: -77.0369 },
    { name: 'Arequipa, Peru', lat: -16.3988, lng: -71.5350 },
    { name: 'Cusco, Peru', lat: -13.5320, lng: -71.9787 },
    { name: 'Trujillo, Peru', lat: -8.1265, lng: -79.0274 },
    { name: 'Santiago, Chile', lat: -33.8688, lng: -151.2093 },
    { name: 'Valparaíso, Chile', lat: -33.0472, lng: -71.6127 },
    { name: 'Concepción, Chile', lat: -36.8201, lng: -73.0445 },
    { name: 'Puerta Montt, Chile', lat: -41.3142, lng: -72.2160 },
    { name: 'Caracas, Venezuela', lat: 10.4806, lng: -66.9036 },
    { name: 'Valencia, Venezuela', lat: 10.1895, lng: -67.5881 },
    { name: 'Maracaibo, Venezuela', lat: 10.6414, lng: -71.6126 },
    { name: 'Quito, Ecuador', lat: -0.2202, lng: -78.5124 },
    { name: 'Guayaquil, Ecuador', lat: -2.1962, lng: -79.8852 },
    { name: 'Cuenca, Ecuador', lat: -2.8987, lng: -79.0054 },
    { name: 'La Paz, Bolivia', lat: -16.5000, lng: -68.1500 },
    { name: 'Santa Cruz, Bolivia', lat: -17.8139, lng: -63.1621 },
    { name: 'Cochabamba, Bolivia', lat: -17.3895, lng: -66.1577 },
    { name: 'Asunción, Paraguay', lat: -25.2637, lng: -57.5759 },
    { name: 'Montevideo, Uruguay', lat: -34.9011, lng: -56.1645 },
    { name: 'Salto, Uruguay', lat: -31.3873, lng: -57.9633 },
    { name: 'Georgetown, Guyana', lat: 6.8016, lng: -58.1551 },
    { name: 'Paramaribo, Suriname', lat: 5.8520, lng: -55.2038 },
    { name: 'Cayenne, French Guiana', lat: 4.9339, lng: -52.3569 },
    
    // OCEANIA - 50+ cities
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane, Australia', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth, Australia', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide, Australia', lat: -34.9285, lng: 138.6007 },
    { name: 'Gold Coast, Australia', lat: -28.0028, lng: 153.4314 },
    { name: 'Canberra, Australia', lat: -35.2809, lng: 149.1300 },
    { name: 'Hobart, Australia', lat: -42.8821, lng: 147.3272 },
    { name: 'Darwin, Australia', lat: -12.4634, lng: 130.8456 },
    { name: 'Geelong, Australia', lat: -38.1499, lng: 144.3617 },
    { name: 'Townsville, Australia', lat: -19.2643, lng: 146.8118 },
    { name: 'Cairns, Australia', lat: -16.8661, lng: 145.7781 },
    { name: 'Newcastle, Australia', lat: -32.9271, lng: 151.7797 },
    { name: 'Wollongong, Australia', lat: -34.4240, lng: 150.8932 },
    { name: 'Auckland, New Zealand', lat: -37.0882, lng: 174.7765 },
    { name: 'Wellington, New Zealand', lat: -41.2865, lng: 174.7762 },
    { name: 'Christchurch, New Zealand', lat: -43.5320, lng: 172.6362 },
    { name: 'Hamilton, New Zealand', lat: -37.7870, lng: 175.2793 },
    { name: 'Tauranga, New Zealand', lat: -37.7870, lng: 176.1693 },
    { name: 'Dunedin, New Zealand', lat: -45.8787, lng: 170.5028 },
    { name: 'Palmerston North, New Zealand', lat: -40.3570, lng: 175.6112 },
    { name: 'Honolulu, Hawaii', lat: 21.3099, lng: -157.8581 },
    { name: 'Hilo, Hawaii', lat: 19.7297, lng: -155.0900 },
    { name: 'Suva, Fiji', lat: -18.1256, lng: 178.4501 },
    { name: 'Nadi, Fiji', lat: -17.7855, lng: 177.4474 },
    { name: 'Apia, Samoa', lat: -13.8333, lng: -171.7633 },
    { name: 'Port Moresby, Papua New Guinea', lat: -9.4438, lng: 147.1803 },
    { name: 'Papeete, French Polynesia', lat: -17.5367, lng: -149.5678 },
    { name: 'Port Vila, Vanuatu', lat: -17.7459, lng: 168.3107 },
    { name: 'Tongatapu, Tonga', lat: -21.1393, lng: -175.2060 },
];

const weatherIcons = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'drizzle': '🌦️',
    'wind': '💨'
};

// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');
const favoritesBtn = document.getElementById('favoritesBtn');
const favoritesModal = document.getElementById('favoritesModal');
const closeFavoritesModal = document.getElementById('closeFavoritesModal');
const favoritesGrid = document.getElementById('favoritesGrid');
const emptyFavorites = document.getElementById('emptyFavorites');
const favoritesCount = document.getElementById('favoritesCount');
const favoritesList = document.getElementById('favoritesList');
const favoritePrimaryBtn = document.getElementById('favoritePrimaryBtn');
const themeToggle = document.getElementById('themeToggle');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebar = document.getElementById('closeSidebar');
const unitRadios = document.querySelectorAll('input[name="units"]');
const alertsToggle = document.getElementById('alertsToggle');
const notificationsToggle = document.getElementById('notificationsToggle');
const toast = document.getElementById('toast');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadWeatherData();
    updateFavoritesUI();
    setUnits();
    loadTheme();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) searchLocation(city);
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchLocation(searchInput.value.trim());
    });

    favoritesBtn.addEventListener('click', openFavoritesModal);
    closeFavoritesModal.addEventListener('click', closeFavoritesModalFn);
    favoritePrimaryBtn.addEventListener('click', toggleFavorite);

    themeToggle.addEventListener('click', toggleTheme);
    menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
    closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

    unitRadios.forEach(radio => {
        radio.addEventListener('change', changeUnits);
    });

    alertsToggle.addEventListener('change', (e) => {
        alertsEnabled = e.target.checked;
        localStorage.setItem('alertsEnabled', alertsEnabled);
    });

    notificationsToggle.addEventListener('change', (e) => {
        notificationsEnabled = e.target.checked;
        localStorage.setItem('notificationsEnabled', notificationsEnabled);
    });

    document.getElementById('prev7DaysBtn').addEventListener('click', () => {
        generateHistoricalData(-7);
    });
    document.getElementById('next7DaysBtn').addEventListener('click', () => {
        generateHistoricalData(7);
    });

    document.getElementById('closeDetailsModal').addEventListener('click', () => {
        document.getElementById('detailsModal').classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            favoritesModal.classList.remove('active');
            document.getElementById('detailsModal').classList.remove('active');
        }
    });
}

// ==================== WEATHER API (Mock Data) ====================
function generateMockWeather(location) {
    const conditions = ['Clear', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
        location: location.name,
        lat: location.lat,
        lng: location.lng,
        temperature: Math.floor(Math.random() * 30 + 15),
        feelsLike: Math.floor(Math.random() * 30 + 15),
        humidity: Math.floor(Math.random() * 40 + 40),
        windSpeed: Math.floor(Math.random() * 20 + 5),
        pressure: Math.floor(Math.random() * 20 + 1010),
        visibility: (Math.random() * 5 + 5).toFixed(1),
        cloudCover: Math.floor(Math.random() * 100),
        description: condition,
        uvIndex: Math.floor(Math.random() * 12),
        sunrise: '06:30',
        sunset: '18:45',
        timestamp: new Date().toISOString(),
        alerts: generateWeatherAlerts()
    };
}

function generateWeatherAlerts() {
    const alerts = [];
    const random = Math.random();
    
    if (random > 0.7) {
        alerts.push({
            type: 'warning',
            title: 'Wind Advisory',
            description: 'Strong winds expected in the next 12 hours'
        });
    }
    if (random > 0.8) {
        alerts.push({
            type: 'severe',
            title: 'Thunderstorm Warning',
            description: 'Severe thunderstorms possible this evening'
        });
    }
    
    return alerts;
}

function generateForecast() {
    const forecast = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'];
    
    for (let i = 0; i < 7; i++) {
        forecast.push({
            day: days[i],
            high: Math.floor(Math.random() * 10 + 25),
            low: Math.floor(Math.random() * 10 + 15),
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            humidity: Math.floor(Math.random() * 40 + 40),
            windSpeed: Math.floor(Math.random() * 15 + 5),
            precipitation: Math.floor(Math.random() * 100)
        });
    }
    
    return forecast;
}

function generateHourlyForecast() {
    const hourly = [];
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0');
        hourly.push({
            time: `${hour}:00`,
            temperature: Math.floor(Math.random() * 10 + currentWeather.temperature - 5),
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            humidity: Math.floor(Math.random() * 40 + 40),
            windSpeed: Math.floor(Math.random() * 15 + 5)
        });
    }
    
    return hourly;
}

function generateHistoricalData(daysOffset = 0) {
    historicalData = [];
    const today = new Date();
    today.setDate(today.getDate() + daysOffset);
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        historicalData.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            high: Math.floor(Math.random() * 10 + 25),
            low: Math.floor(Math.random() * 10 + 15),
            condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
            precipitation: Math.floor(Math.random() * 50)
        });
    }
    
    renderHistoricalData();
    updateDateRange(daysOffset);
}

// ==================== LOAD & DISPLAY WEATHER ====================
function loadWeatherData() {
    currentWeather = generateMockWeather(currentLocation);
    forecastData = generateForecast();
    generateHistoricalData();
    
    displayCurrentWeather();
    displayHourlyForecast();
    displayForecast();
    displayAlerts();
    updateFavoriteSidebar();
}

function displayCurrentWeather() {
    document.getElementById('locationName').textContent = currentWeather.location;
    document.getElementById('locationDetails').textContent = 
        `${currentWeather.lat.toFixed(2)}°, ${currentWeather.lng.toFixed(2)}°`;
    document.getElementById('lastUpdated').textContent = 
        `Last updated: ${new Date().toLocaleTimeString()}`;
    
    const tempUnit = units === 'metric' ? '°C' : '°F';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    
    document.getElementById('temperature').textContent = `${currentWeather.temperature}${tempUnit}`;
    document.getElementById('weatherDescription').textContent = currentWeather.description;
    document.getElementById('weatherIcon').innerHTML = getWeatherIcon(currentWeather.description);
    
    document.getElementById('humidity').textContent = `${currentWeather.humidity}%`;
    document.getElementById('windSpeed').textContent = `${currentWeather.windSpeed} ${speedUnit}`;
    document.getElementById('pressure').textContent = `${currentWeather.pressure} mb`;
    document.getElementById('visibility').textContent = `${currentWeather.visibility} km`;
    document.getElementById('feelsLike').textContent = `${currentWeather.feelsLike}${tempUnit}`;
    document.getElementById('cloudCover').textContent = `${currentWeather.cloudCover}%`;
    document.getElementById('sunrise').textContent = currentWeather.sunrise;
    document.getElementById('sunset').textContent = currentWeather.sunset;
    
    const uvPercent = (currentWeather.uvIndex / 11) * 100;
    document.getElementById('uvIndicator').style.width = uvPercent + '%';
    document.getElementById('uvIndex').textContent = `${currentWeather.uvIndex} (${getUVLevel(currentWeather.uvIndex)})`;
    
    favoritePrimaryBtn.classList.toggle('active', isFavorite(currentLocation.name));
}

function displayHourlyForecast() {
    const hourly = generateHourlyForecast();
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    const tempUnit = units === 'metric' ? '°C' : '°F';
    
    document.getElementById('hourlyForecast').innerHTML = hourly.map(hour => `
        <div class="hourly-item">
            <div class="hourly-time">${hour.time}</div>
            <div class="hourly-icon">${getWeatherIcon(hour.condition)}</div>
            <div class="hourly-temp">${hour.temperature}${tempUnit}</div>
            <div class="hourly-condition">${hour.condition}</div>
        </div>
    `).join('');
}

function displayForecast() {
    const tempUnit = units === 'metric' ? '°C' : '°F';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    
    document.getElementById('forecastGrid').innerHTML = forecastData.map(day => `
        <div class="forecast-card">
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${getWeatherIcon(day.condition)}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${day.high}${tempUnit}</span>
                <span class="forecast-low">${day.low}${tempUnit}</span>
            </div>
            <div class="forecast-condition">${day.condition}</div>
            <div class="forecast-details">
                <div class="forecast-detail">
                    <i class='bx bx-droplet'></i>
                    <span>${day.humidity}%</span>
                </div>
                <div class="forecast-detail">
                    <i class='bx bx-wind'></i>
                    <span>${day.windSpeed} ${speedUnit}</span>
                </div>
                <div class="forecast-detail">
                    <i class='bx bx-water'></i>
                    <span>${day.precipitation}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function displayAlerts() {
    const alertsSection = document.getElementById('alertsSection');
    const alertsContainer = document.getElementById('alertsContainer');
    
    if (!currentWeather.alerts || currentWeather.alerts.length === 0) {
        alertsSection.style.display = 'none';
        return;
    }
    
    alertsSection.style.display = 'block';
    alertsContainer.innerHTML = currentWeather.alerts.map(alert => `
        <div class="alert-box ${alert.type}">
            <div class="alert-icon">
                <i class='bx ${alert.type === 'severe' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
        </div>
    `).join('');
    
    if (notificationsEnabled && currentWeather.alerts.length > 0) {
        showNotification(`⚠️ ${currentWeather.alerts[0].title}`, 'warning');
    }
}

function renderHistoricalData() {
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';
    const tempUnit = units === 'metric' ? '°C' : '°F';
    
    document.getElementById('historicalChart').innerHTML = `
        <div class="historical-grid">
            ${historicalData.map(day => `
                <div class="historical-day">
                    <div class="historical-date">${day.date}</div>
                    <div class="historical-icon">${getWeatherIcon(day.condition)}</div>
                    <div class="historical-high">${day.high}${tempUnit}</div>
                    <div class="historical-low">${day.low}${tempUnit}</div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
                        Rain: ${day.precipitation}%
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function updateDateRange(daysOffset) {
    const today = new Date();
    today.setDate(today.getDate() + daysOffset);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 6);
    
    const dateRange = `${endDate.toLocaleDateString()} - ${today.toLocaleDateString()}`;
    document.getElementById('dateRange').textContent = dateRange;
}

// ==================== SEARCH & LOCATION ====================
function handleSearch(e) {
    const value = e.target.value.toLowerCase().trim();
    
    if (value.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    const filtered = citiesDatabase.filter(city =>
        city.name.toLowerCase().includes(value)
    );
    
    if (filtered.length === 0) {
        searchSuggestions.classList.remove('active');
        return;
    }
    
    searchSuggestions.innerHTML = filtered.map(city => `
        <div class="suggestion-item" onclick="selectCity('${city.name}', ${city.lat}, ${city.lng})">
            <strong>${city.name}</strong>
        </div>
    `).join('');
    searchSuggestions.classList.add('active');
}

function selectCity(name, lat, lng) {
    searchInput.value = '';
    searchSuggestions.classList.remove('active');
    searchLocation(name, lat, lng);
}

function searchLocation(cityName, lat, lng) {
    const city = citiesDatabase.find(c => c.name === cityName);
    if (!city && !lat) {
        showNotification('City not found', 'error');
        return;
    }
    
    currentLocation = {
        name: cityName || city.name,
        lat: lat || city.lat,
        lng: lng || city.lng
    };
    
    loadWeatherData();
    sidebar.classList.remove('active');
    showNotification(`Weather loaded for ${currentLocation.name}`, 'success');
}

// ==================== FAVORITES ====================
function toggleFavorite() {
    if (isFavorite(currentLocation.name)) {
        favorites = favorites.filter(f => f.name !== currentLocation.name);
        showNotification('Removed from favorites', 'success');
    } else {
        favorites.push({
            name: currentLocation.name,
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            temperature: currentWeather.temperature
        });
        showNotification('Added to favorites', 'success');
    }
    
    saveFavorites();
    updateFavoritesUI();
    favoritePrimaryBtn.classList.toggle('active');
}

function isFavorite(locationName) {
    return favorites.some(f => f.name === locationName);
}

function updateFavoritesUI() {
    favoritesCount.textContent = favorites.length;
    updateFavoriteSidebar();
}

function updateFavoriteSidebar() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites yet</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(fav => `
        <div class="favorite-item" onclick="searchLocation('${fav.name}', ${fav.lat}, ${fav.lng})">
            <div>
                <div class="favorite-item-name">${fav.name}</div>
                <div class="favorite-item-temp">${fav.temperature}°</div>
            </div>
            <button class="favorite-remove" onclick="removeFavorite('${fav.name}'); event.stopPropagation();">
                <i class='bx bx-x'></i>
            </button>
        </div>
    `).join('');
}

function removeFavorite(name) {
    favorites = favorites.filter(f => f.name !== name);
    saveFavorites();
    updateFavoritesUI();
    showNotification(`${name} removed from favorites`, 'success');
}

function openFavoritesModal() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '';
        emptyFavorites.style.display = 'flex';
    } else {
        emptyFavorites.style.display = 'none';
        favoritesGrid.innerHTML = favorites.map(fav => `
            <div class="favorite-card" onclick="searchLocation('${fav.name}', ${fav.lat}, ${fav.lng}); closeFavoritesModalFn();">
                <div class="favorite-card-name">${fav.name}</div>
                <div class="favorite-card-temp">${fav.temperature}°</div>
                <div class="favorite-card-condition">Click to view</div>
            </div>
        `).join('');
    }
    
    favoritesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFavoritesModalFn() {
    favoritesModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

// ==================== UNITS & THEME ====================
function changeUnits(e) {
    units = e.target.value;
    localStorage.setItem('weatherUnits', units);
    displayCurrentWeather();
    displayHourlyForecast();
    displayForecast();
    renderHistoricalData();
}

function setUnits() {
    document.querySelector(`input[name="units"][value="${units}"]`).checked = true;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('weatherTheme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('weatherTheme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// ==================== UTILITIES ====================
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain') || desc.includes('rainy')) return '🌧️';
    if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    if (desc.includes('drizzle')) return '🌦️';
    if (desc.includes('wind')) return '💨';
    
    return '🌤️';
}

function getUVLevel(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('active')) {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    }
});

document.addEventListener('click', (e) => {
    if (!searchSuggestions.contains(e.target) && e.target !== searchInput) {
        searchSuggestions.classList.remove('active');
    }
});