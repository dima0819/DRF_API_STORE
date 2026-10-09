# Wdrożenie na produkcję (motiongear.duckdns.org)

Instrukcja dla zmian frontendu z października 2026 (redesign + naprawa dwóch bugów).
**Nic z tego nie zostało wykonane — wszystkie kroki uruchamiasz sam.**

## Stan wyjściowy

- Praca jest **niezacommitowana** w working tree (41 plików, 16 zdjęć).
- Prod serwuje build sprzed redesignu.
- `localhost:3000` ma już nową wersję (kontener przebudowany lokalnie).

## 1. Commit i push

```bash
cd ~/Desktop/DRF_API_STORE

git checkout -b feat/frontend-redesign
git add -A
git commit -m "feat: przebudowa frontendu + naprawa czarnego ekranu i sesji"
git push -u origin feat/frontend-redesign
```

Po przejściu CI zmerguj do `main` (PR albo `git checkout main && git merge feat/frontend-redesign && git push`).

## 2. Wdrożenie na serwerze

Zaloguj się na maszynę, na której stoi prod, i w katalogu projektu:

```bash
git pull origin main

docker compose build frontend
docker compose up -d frontend
```

Backend, baza i Redis zostają nietknięte — zmienił się wyłącznie frontend.

## 3. Weryfikacja po wdrożeniu

```bash
# nowy build (hash powinien się różnić od poprzedniego)
curl -sS https://motiongear.duckdns.org/ | grep -oE 'index-[A-Za-z0-9_-]+\.js'

# pliki dodane w tej zmianie
curl -sS https://motiongear.duckdns.org/robots.txt | head -3
curl -sS -o /dev/null -w "%{http_code}\n" https://motiongear.duckdns.org/products/kask-rowerowy.jpg

# API nadal odpowiada
curl -sS -o /dev/null -w "%{http_code}\n" "https://motiongear.duckdns.org/api/v1/store/categories/?page_size=50"
```

W przeglądarce przejdź: strona główna → kategoria → produkt → koszyk → checkout → zamówienia,
**raz po polsku i raz po angielsku** (przełącznik PL/EN w nagłówku).

## 4. Wycofanie zmian

```bash
git revert <hash-merge-commita>
docker compose build frontend && docker compose up -d frontend
```

Albo szybciej, jeśli poprzedni obraz jest jeszcze lokalnie:

```bash
docker images | grep drf_api_store-frontend     # znajdź starszy tag/ID
docker tag <stary-id> drf_api_store-frontend:latest
docker compose up -d frontend
```

## Uwagi

- **Migracje bazy nie są potrzebne** — zmiany dotyczą wyłącznie frontendu.
- **Zdjęcia produktów** (`frontend/public/products/`, 16 plików, ~1,4 MB) wchodzą do repo
  i są kopiowane do obrazu podczas builda. Nie wymagają wolumenu ani osobnego hostingu.
- **Licencje zdjęć:** pochodzą z Unsplash (licencja Unsplash) i Openverse (CC).
  Dla projektu demonstracyjnego to wystarcza; przy komercyjnym użyciu zweryfikuj
  licencje zdjęć z Openverse (`kettlebell.jpg`, `sztanga-olimpijska.jpg`, `kask-rowerowy.jpg`)
  albo podmień je na własne.
- **Tokeny JWT w localStorage** — nietknięte na Twoją prośbę. To ryzyko XSS po stronie
  frontendu, niezależne od zabezpieczeń backendu. Do rozważenia osobno (httpOnly cookies + CSRF).
