# Dashbord //będzie pełnił rolę strony głównej o adresie
  '/'
  - ma zawierać statystyki zamówień (zdalne i lokalne)
  - listę rezewacji i eventów zaplanowanych na dzisiaj
# Logowanie
  '/login'
  - ma zawierać pola na login i hało
  - guzik do zalogowania (link do dasboardu)
# Widok dostępności stolików
  '/tables'
  - ma zawierać wybór daty i godziny
  - tabela z listą rezerwacji oraz wydarzeń
    - każda kolumna = 1 stolik
    - każdy wiersz = 30 minut
    - ma przypominać widok tgodnia w kalendarzu Google, gdzie w kolumnach zamiast dni są różne stoliki
    - po kliknięciu rezerwacji lub eventu przechodzimy na stronę szczegółów
  '/tables/booking/;id'
  - zawiera wszystkie informacje dotyczące rezerwacji
  - umożliwia edycję i zapisanie zmian
  '/tables/booking/new'
  - analogicznie do powyżej, bez początkowych informacji
  '/tables/events/:id'
  - analogicznie do powyższej, dla eventów
  '/tables/events/new'
  - analogicznie do powyższej, dla eventów, bez początkowych informacji

# Widok kelnera
  '/waiter'
  - zawiera tabelę która w wierszach wyświetli stoliki a w kolumnach różne rodzaje informacji (status,czas od ostatniej aktywności)
  - w ostatniej kolumnie dostępne akcje dla danego stolika
  '/waiter/order/new'
  - numer stolika (edytowalny)
  - menu produktów
  - opcje wybranego produktu
  - zamówienie (zamówione produkty z opcjami i ceną)
  - kwotę zamówienia
  '/waiter/order/:id'
  - jak powyżej
# Widok kuchni
  '/kitchen'
  - wyświetla listę zamówień w kolejności ich złożenia
  - lista musi zawierać:
    - numer stolika (lub zamówienia zdalnego)
    - pełne informacje dot. zamówionych dań
  - na liście musi być możliwość oznaczenia zamówienia jako zrealizowane
