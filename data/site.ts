export const siteSettings = {
  name: "ONIKART",
  owner: "Оник Артушян",
  location: "Воронеж / Работаю удалённо",
  availability: false,
  contactFormEnabled: true,
  contactEndpoint: "",
  contacts: [{ label: "+7 995 669-12-42", href: "tel:+79956691242" },{ label: "Telegram · @iamartush1an", href: "https://t.me/iamartush1an" },{label:"MAX · +7 995 250-77-63",href:"https://max.ru/u/f9LHodD0cOJW6yx3Pe2D9tITV0YnoLucCXH4bNTkzpTCoeBMzLvZdyOXFHg"}],
  socialLinks: [{ label: "VK", href: "https://vk.ru/iamartush1an" },{ label: "Instagram", href: "https://www.instagram.com/iamartush1an" }],
};

export const services = [
  { number: "01", kicker: "DIGITAL FOUNDATION", title: "Цифровой фундамент", description: "Фундамент продукта: позиционирование, структура, визуальная система и интерфейс.", items: ["Структура", "UI / UX", "Визуальная система", "Прототипирование", "Контент-архитектура"] },
  { number: "02", kicker: "WEB & SYSTEMS", title: "Веб и системы", description: "Сайты и внутренние инструменты, которые не заканчиваются красивой главной страницей.", items: ["Сайты", "Каталоги", "Frontend", "Backend", "Базы данных", "Админ-панели", "Формы и заявки"] },
  { number: "03", kicker: "AUTOMATION & GROWTH", title: "Автоматизация и рост", description: "Интеграции и автоматизация процессов, которые помогают системе работать после запуска.", items: ["Аналитика", "API", "Интеграции", "AI", "Автоматизация", "Production"] },
  { number: "04", kicker: "SOCIAL & CONTENT", title: "Социальные каналы", description: "Создание и оформление соцсетей, редизайн существующих аккаунтов, контент-система, ведение и связь с digital-экосистемой.", items: ["Создание соцсетей", "Оформление", "Редизайн", "Контент", "Ведение", "Сопровождение"] },
  { number: "05", kicker: "CONSULTING", title: "Консультация", description: "Разбор задачи, текущей цифровой системы и возможных следующих шагов.", items: ["Digital-аудит", "Аудит сайта", "Бизнес-процессы", "Roadmap", "Выбор инструментов"] },
  { number: "06", kicker: "SUPPORT / LONG-TERM", title: "Сопровождение и развитие", description: "После запуска продолжаю развитие проекта: поддержка, новые функции, аналитика, интеграции и автоматизация.", items: ["Поддержка", "Обновления", "Новые функции", "Аналитика", "Интеграции", "Контент"] },
];

export const initialTariffs = [
 {name:"DIGITAL START",eyebrow:"01",description:"Сильная digital-точка входа для небольшого бизнеса или специалиста.",features:["Анализ задачи","Структура и дизайн","Адаптивная разработка","Форма заявки","Базовое SEO и аналитика","Production launch"],priceMode:"FROM"},
 {name:"BUSINESS SYSTEM",eyebrow:"02",description:"Для бизнеса, которому нужен не просто сайт, а рабочая система.",features:["Всё из Digital Start","Дополнительные страницы","Каталог и база данных","Админ-панель","Заявки и события","Интеграции"],priceMode:"FROM"},
 {name:"DIGITAL BUSINESS",eyebrow:"03",description:"Комплексная цифровая инфраструктура бизнеса.",features:["Стратегия и брендинг","Website, backend и database","Custom admin и роли","Bots и automation","Social ecosystem","Production infrastructure"],priceMode:"FROM"},
 {name:"ДАЛЬНЕЙШЕЕ СОТРУДНИЧЕСТВО",eyebrow:"04",description:"Поддержка и развитие уже запущенной системы.",features:["Техническая поддержка","Новые функции","Аналитика","Интеграции","Автоматизация","Развитие digital-системы"],priceMode:"INDIVIDUAL"},
] as const;

export const processSteps = [
  ["01", "АНАЛИЗ", "Разбираю бизнес, аудиторию, текущую систему и задачу."],
  ["02", "СТРАТЕГИЯ", "Определяю, что действительно необходимо проекту и что будет лишним."],
  ["03", "ДИЗАЙН", "Создаю структуру, интерфейс и визуальный язык продукта."],
  ["04", "РАЗРАБОТКА", "Собираю frontend, backend и необходимую бизнес-логику."],
  ["05", "ЗАПУСК", "Проверяю production, адаптивность, аналитику и инфраструктуру."],
  ["06", "РАЗВИТИЕ", "После запуска система может расширяться вместе с бизнесом."],
] as const;

export const technologies = ["NEXT.JS", "TYPESCRIPT", "REACT", "CSS", "CLOUDFLARE"];

export const systemRows = [
  ["01", "BRAND", "Индивидуальный дизайн и brandbook."], ["02", "WEB", "Публичный сайт и адаптивный интерфейс."], ["03", "CATALOG", "Каталог и карточки продукции."], ["04", "ADMIN", "Управление контентом и внутренними процессами."], ["05", "MAX", "Собственная система бота и операционных уведомлений."], ["06", "SOCIAL", "Создание, оформление и ведение социальных каналов."], ["07", "ANALYTICS", "События и operational analytics."], ["08", "INFRASTRUCTURE", "Production, persistence и дальнейшее развитие."],
] as const;
