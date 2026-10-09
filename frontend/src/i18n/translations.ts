export type Lang = 'pl' | 'en'

const pl = {
  'meta.title': 'MotionGear — Sklep sportowy',
  'nav.home': 'Strona główna',
  'nav.cart': 'Koszyk',
  'nav.orders': 'Zamówienia',
  'nav.logout': 'Wyloguj',
  'nav.login': 'Zaloguj',
  'nav.register': 'Rejestracja',
  'footer.tagline': 'Twój sklep ze sprzętem sportowym',
  'footer.categories': 'Kategorie',
  'home.badge': 'Nowa kolekcja 2026',
  'home.hero1': 'Osiągnij swój',
  'home.heroAccent': 'sportowy',
  'home.hero2': 'potencjał',
  'home.heroText':
    'Odkryj profesjonalny sprzęt sportowy — piłki, sztangi, rowery i więcej. Wybierz kategorię i znajdź idealny sprzęt dla siebie.',
  'home.browseCategories': 'Przeglądaj kategorie',
  'home.stat.delivery': 'Dostawa 24–48 h',
  'home.stat.warranty': '2 lata gwarancji',
  'home.stat.returns': '30 dni na zwrot',
  'home.categoryCount': '{n} kategorii',
  'home.choose': 'Wybierz',
  'home.chooseAccent': 'kategorię',
  'home.chooseText': 'Przeglądaj sprzęt według dyscypliny sportowej',
  'home.noCategories': 'Brak kategorii. Uruchom seed danych w backendzie.',
  'category.back': 'Wróć do kategorii',
  'category.searchPlaceholder': 'Szukaj produktu...',
  'category.empty': 'Brak produktów w tej kategorii.',
  'category.productsHeading': 'Produkty w kategorii',
  'card.browse': 'Przeglądaj',
  'product.outOfStock': 'Brak na stanie',
  'product.lastFew': 'Ostatnie sztuki',
  'product.lastN': 'Ostatnie {n} szt.',
  'product.availableN': 'Dostępne: {n} szt.',
  'product.description': 'Opis produktu',
  'product.addToCart': 'Dodaj do koszyka',
  'product.added': 'Dodano!',
  'product.unavailable': 'Ten produkt jest obecnie niedostępny. Sprawdź ponownie później.',
  'product.decrease': 'Zmniejsz ilość',
  'product.increase': 'Zwiększ ilość',
  'product.remove': 'Usuń',
  'cart.guestTitle': 'Twój koszyk jest pusty',
  'cart.guestText': 'Zaloguj się, aby dodawać produkty do koszyka i składać zamówienia.',
  'cart.login': 'Zaloguj się',
  'cart.createAccount': 'Utwórz konto',
  'cart.continueGuest': '← Kontynuuj zakupy bez logowania',
  'cart.emptyTitle': 'Koszyk jest pusty',
  'cart.emptyText': 'Dodaj produkty z katalogu, aby rozpocząć zakupy.',
  'cart.browseProducts': 'Przeglądaj produkty',
  'cart.title': 'Koszyk',
  'cart.total': 'Razem',
  'cart.checkout': 'Przejdź do zamówienia',
  'cart.addedToast': 'Dodano do koszyka!',
  'checkout.title': 'Finalizacja zamówienia',
  'checkout.subtitle': 'Uzupełnij dane dostawy i potwierdź zamówienie',
  'checkout.addressHeader': 'Adres dostawy',
  'checkout.recipient': 'Imię i nazwisko odbiorcy',
  'checkout.street': 'Ulica',
  'checkout.houseNumber': 'Nr domu / lokalu',
  'checkout.postalCode': 'Kod pocztowy',
  'checkout.city': 'Miasto',
  'checkout.notes': 'Uwagi do zamówienia',
  'checkout.optional': '(opcjonalnie)',
  'checkout.notesPlaceholder': 'Np. kod do domofonu, godziny odbioru...',
  'checkout.info':
    'Po złożeniu zamówienia otrzymasz potwierdzenie na email. Płatność realizowana jest przy odbiorze (demo).',
  'checkout.submit': 'Złóż zamówienie',
  'checkout.successTitle': 'Zamówienie złożone!',
  'checkout.successText': 'Twoje zamówienie #{id} zostało przyjęte. Potwierdzenie wysłaliśmy na email.',
  'checkout.myOrders': 'Moje zamówienia',
  'checkout.continueShopping': 'Kontynuuj zakupy',
  'checkout.summary': 'Podsumowanie',
  'checkout.backToCart': '← Wróć do koszyka',
  'checkout.errRecipient': 'Podaj imię i nazwisko odbiorcy',
  'checkout.errStreet': 'Podaj nazwę ulicy',
  'checkout.errHouse': 'Podaj numer domu / lokalu',
  'checkout.errPostal': 'Podaj kod pocztowy w formacie 00-000',
  'checkout.errCity': 'Podaj miasto',
  'login.title': 'Zaloguj się',
  'login.subtitle': 'Zaloguj się, aby korzystać z koszyka i składać zamówienia',
  'login.email': 'Email',
  'login.password': 'Hasło',
  'login.noAccount': 'Nie masz konta?',
  'login.registerLink': 'Zarejestruj się',
  'login.continueGuest': '← Kontynuuj bez logowania',
  'register.title': 'Utwórz konto',
  'register.subtitle': 'Rejestracja jest wymagana tylko do koszyka i zamówień',
  'register.firstName': 'Imię',
  'register.lastName': 'Nazwisko',
  'register.phone': 'Telefon',
  'register.submit': 'Zarejestruj się',
  'register.haveAccount': 'Masz już konto?',
  'register.loginLink': 'Zaloguj się',
  'register.passwordHint': 'Minimum {n} znaków',
  'orders.title': 'Moje zamówienia',
  'orders.subtitle': 'Historia Twoich zakupów w MotionGear',
  'orders.empty': 'Brak zamówień',
  'orders.emptyText': 'Nie masz jeszcze żadnych zamówień. Zacznij od przeglądania katalogu.',
  'orders.startShopping': 'Rozpocznij zakupy',
  'orders.order': 'Zamówienie',
  'orders.paid': 'Opłacone',
  'orders.pending': 'Oczekuje na płatność',
  'orders.address': 'Adres:',
  'errors.generic': 'Wystąpił błąd',
  'errors.unexpected': 'Wystąpił nieoczekiwany błąd',
  'errors.boundaryTitle': 'Coś poszło nie tak',
  'errors.boundaryText': 'Przepraszamy — strona napotkała nieoczekiwany błąd. Spróbuj odświeżyć.',
  'errors.boundaryRetry': 'Odśwież stronę',
  'errors.boundaryHome': 'Wróć na stronę główną',
}

const en: Record<TranslationKey, string> = {
  'meta.title': 'MotionGear — Sports Store',
  'nav.home': 'Home',
  'nav.cart': 'Cart',
  'nav.orders': 'Orders',
  'nav.logout': 'Log out',
  'nav.login': 'Log in',
  'nav.register': 'Sign up',
  'footer.tagline': 'Your sports equipment store',
  'footer.categories': 'Categories',
  'home.badge': 'New 2026 collection',
  'home.hero1': 'Unlock your',
  'home.heroAccent': 'athletic',
  'home.hero2': 'potential',
  'home.heroText':
    'Discover professional sports gear — balls, barbells, bikes and more. Pick a category and find the perfect equipment for you.',
  'home.browseCategories': 'Browse categories',
  'home.stat.delivery': 'Delivery in 24–48 h',
  'home.stat.warranty': '2-year warranty',
  'home.stat.returns': '30-day returns',
  'home.categoryCount': '{n} categories',
  'home.choose': 'Choose a',
  'home.chooseAccent': 'category',
  'home.chooseText': 'Browse gear by sport discipline',
  'home.noCategories': 'No categories yet. Run the data seed in the backend.',
  'category.back': 'Back to categories',
  'category.searchPlaceholder': 'Search products...',
  'category.empty': 'No products in this category.',
  'category.productsHeading': 'Products in this category',
  'card.browse': 'Browse',
  'product.outOfStock': 'Out of stock',
  'product.lastFew': 'Last items',
  'product.lastN': 'Only {n} left',
  'product.availableN': 'In stock: {n}',
  'product.description': 'Product description',
  'product.addToCart': 'Add to cart',
  'product.added': 'Added!',
  'product.unavailable': 'This product is currently unavailable. Please check back later.',
  'product.decrease': 'Decrease quantity',
  'product.increase': 'Increase quantity',
  'product.remove': 'Remove',
  'cart.guestTitle': 'Your cart is empty',
  'cart.guestText': 'Log in to add products to your cart and place orders.',
  'cart.login': 'Log in',
  'cart.createAccount': 'Create account',
  'cart.continueGuest': '← Continue shopping without logging in',
  'cart.emptyTitle': 'Your cart is empty',
  'cart.emptyText': 'Add products from the catalog to start shopping.',
  'cart.browseProducts': 'Browse products',
  'cart.title': 'Cart',
  'cart.total': 'Total',
  'cart.checkout': 'Proceed to checkout',
  'cart.addedToast': 'Added to cart!',
  'checkout.title': 'Checkout',
  'checkout.subtitle': 'Fill in the delivery details and confirm your order',
  'checkout.addressHeader': 'Delivery address',
  'checkout.recipient': 'Recipient full name',
  'checkout.street': 'Street',
  'checkout.houseNumber': 'House / apartment no.',
  'checkout.postalCode': 'Postal code',
  'checkout.city': 'City',
  'checkout.notes': 'Order notes',
  'checkout.optional': '(optional)',
  'checkout.notesPlaceholder': 'E.g. intercom code, preferred delivery hours...',
  'checkout.info':
    'After placing the order you will receive an email confirmation. Payment is on delivery (demo).',
  'checkout.submit': 'Place order',
  'checkout.successTitle': 'Order placed!',
  'checkout.successText': 'Your order #{id} has been received. A confirmation was sent to your email.',
  'checkout.myOrders': 'My orders',
  'checkout.continueShopping': 'Continue shopping',
  'checkout.summary': 'Summary',
  'checkout.backToCart': '← Back to cart',
  'checkout.errRecipient': "Enter the recipient's full name",
  'checkout.errStreet': 'Enter the street name',
  'checkout.errHouse': 'Enter the house or apartment number',
  'checkout.errPostal': 'Enter the postal code in 00-000 format',
  'checkout.errCity': 'Enter the city',
  'login.title': 'Log in',
  'login.subtitle': 'Log in to use the cart and place orders',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.noAccount': "Don't have an account?",
  'login.registerLink': 'Sign up',
  'login.continueGuest': '← Continue without logging in',
  'register.title': 'Create an account',
  'register.subtitle': 'Registration is only required for the cart and orders',
  'register.firstName': 'First name',
  'register.lastName': 'Last name',
  'register.phone': 'Phone',
  'register.submit': 'Sign up',
  'register.haveAccount': 'Already have an account?',
  'register.loginLink': 'Log in',
  'register.passwordHint': 'At least {n} characters',
  'orders.title': 'My orders',
  'orders.subtitle': 'Your purchase history at MotionGear',
  'orders.empty': 'No orders yet',
  'orders.emptyText': "You haven't placed any orders yet. Start by browsing the catalog.",
  'orders.startShopping': 'Start shopping',
  'orders.order': 'Order',
  'orders.paid': 'Paid',
  'orders.pending': 'Awaiting payment',
  'orders.address': 'Address:',
  'errors.generic': 'Something went wrong',
  'errors.unexpected': 'An unexpected error occurred',
  'errors.boundaryTitle': 'Something went wrong',
  'errors.boundaryText': 'Sorry — the page hit an unexpected error. Try reloading.',
  'errors.boundaryRetry': 'Reload page',
  'errors.boundaryHome': 'Back to home',
}

export type TranslationKey = keyof typeof pl

export const translations: Record<Lang, Record<TranslationKey, string>> = { pl, en }

const LANG_STORAGE_KEY = 'motiongear_lang'

function readStoredLang(): Lang {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'pl'
  } catch {
    return 'pl'
  }
}

let currentLang: Lang = readStoredLang()

export function getLang(): Lang {
  return currentLang
}

export function setStoredLang(lang: Lang): void {
  currentLang = lang
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    return
  }
}

export function translate(
  key: TranslationKey,
  params?: Record<string, string | number>,
  lang: Lang = currentLang,
): string {
  const dictionary = translations[lang] ?? translations.pl
  const template = dictionary[key] ?? translations.pl[key] ?? key
  if (!params) return template
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template,
  )
}

export function productsWord(count: number, lang: Lang): string {
  if (lang === 'en') return count === 1 ? 'product' : 'products'
  if (count === 1) return 'produkt'
  const ones = count % 10
  const tens = count % 100
  if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return 'produkty'
  return 'produktów'
}
