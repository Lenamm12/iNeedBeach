# iNeedBeach

Eine Web-App zur Suche nach Stränden in deiner Umgebung.

## Funktionen

- Standortermittlung über Browser-Geolocation oder manuelle Adresseingabe
- Anzeige von Stränden im gewählten Umkreis (50-1000km) auf einer interaktiven Karte
- Liste aller gefundenen Strände mit:
  - Direkter Navigation zum Strand auf der Karte
  - Detailansicht der Strandinformationen
  - Öffnen des Strandes in Google Maps

## Technologien

- HTML/CSS/JavaScript 
- Leaflet.js für die Kartenintegration
- OpenStreetMap & Nominatim für Geodaten
- Overpass API für POI-Abfragen
- Bootstrap für das UI

## Verwendung

1. Standort über Browser ermitteln lassen oder Adresse eingeben
2. Gewünschten Suchradius auswählen (50-1000km)
3. "Strände anzeigen" klicken
4. Gefundene Strände werden auf der Karte und in der Seitenleiste angezeigt
5. Über die Buttons in der Liste:
   - Strand auf der Karte zentrieren
   - Details zum Strand anzeigen
   - Strand in Google Maps öffnen
